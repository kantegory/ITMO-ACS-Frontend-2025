<script setup>
import {onMounted, ref} from "vue";

import ProfileCard from "@/components/ProfileCard.vue";
import ProfileTabs from "@/components/ProfileTabs.vue";
import PropertyItem from "@/components/PropertyItem.vue";
import ChatModal from "@/components/ChatModal.vue";

import {
  advertisementsApi,
  advertisementsAuthApi,
  messagesAuthApi,
  rentalsAuthApi,
  usersApi,
  usersMeApi
} from "@/api";
import {formatDateTime} from "../utils/datetime.js";
import {mapAdvertisementToItem, mapRentalToItem} from "@/utils/mappers.js";

const me = ref(null);
const profile = ref({name: null, mail: null, phone: null});

const activeTab = ref("my-properties");

const myProperties = ref([]);
const renting = ref([]);
const dialogs = ref([]);

const isLoading = ref(true);
const error = ref(null);

const chatModalRef = ref(null);
const selectedDialog = ref(null);

function openDialog(dialog) {
  selectedDialog.value = dialog;
  chatModalRef.value?.open(dialog);
}

function chatKey(otherId, advertisementId) {
  return `${otherId}__${advertisementId ?? "none"}`;
}

const userLabelCache = new Map();
const advertTitleCache = new Map();

const userLabelInFlight = new Map();
const advertTitleInFlight = new Map();

async function getUserLabel(userId) {
  if (!userId) return "Пользователь";

  if (userLabelCache.has(userId)) return userLabelCache.get(userId);
  if (userLabelInFlight.has(userId)) return userLabelInFlight.get(userId);

  const p = usersApi.getById(userId).then((res) => {
    const u = res.data ?? res;
    const fullName = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();
    const label = fullName || u?.mail || "Пользователь";
    userLabelCache.set(userId, label);
    return label;
  }).finally(() => {
    userLabelInFlight.delete(userId);
  });

  userLabelInFlight.set(userId, p);
  return p;
}

async function getAdvertisementTitle(advertisementId) {
  if (!advertisementId) return "Объявление";

  if (advertTitleCache.has(advertisementId)) return advertTitleCache.get(advertisementId);
  if (advertTitleInFlight.has(advertisementId)) return advertTitleInFlight.get(advertisementId);

  const p = advertisementsApi.getById(advertisementId).then((res) => {
    const title = res.data?.title || `Объявление #${advertisementId}`;
    advertTitleCache.set(advertisementId, title);
    return title;
  }).finally(() => {
    advertTitleInFlight.delete(advertisementId);
  });

  advertTitleInFlight.set(advertisementId, p);
  return p;
}

async function buildDialogsFromMessages(allMessages, meId) {
  const map = new Map();

  for (const message of allMessages) {
    const otherId = message.senderId === meId ? message.receiverId : message.senderId;
    const advId = message.advertisementId ?? "none";
    const key = chatKey(otherId, advId);

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        otherId,
        advertisementId: message.advertisementId ?? null,
        title: "",
        participant: "",
        lastMessage: "",
        lastMessageAt: "",
        lastSenderLabel: "",
        messages: [],
      });
    }
    map.get(key).messages.push(message);
  }

  const dialogs = Array.from(map.values());

  for (const dialog of dialogs) {
    dialog.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const last = dialog.messages.at(-1);

    dialog.lastMessage = last?.text ?? "";
    dialog.lastMessageAt = last?.createdAt ?? "";

    const otherLabel = await getUserLabel(dialog.otherId);
    const advTitle = await getAdvertisementTitle(dialog.advertisementId);

    dialog.participant = otherLabel;
    dialog.title = `${advTitle} | ${otherLabel}`;

    dialog.lastSenderLabel = last?.senderId === meId ? "Вы" : otherLabel;
  }

  dialogs.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  return dialogs;
}

async function preloadAdvertisementTitles(advertisementIds) {
  const uniqueIds = [...new Set(advertisementIds)].filter(Boolean);

  await Promise.all(
    uniqueIds.map(async (id) => {
      if (advertTitleCache.has(id)) return;
      await getAdvertisementTitle(id);
    })
  );
}

async function handleChatSend({receiverId, advertisementId, text}) {
  if (!me.value?.id) return;

  let created;
  try {
    const res = await messagesAuthApi.send({
      senderId: me.value.id,
      receiverId,
      advertisementId,
      text,
    });
    created = res?.data ?? res;
  } catch (e) {
    console.error(e);
    alert("Не удалось отправить сообщение");
    return;
  }

  const message = created ?? {
    id: Date.now(),
    senderId: me.value.id,
    receiverId,
    advertisementId,
    text,
    createdAt: new Date().toISOString(),
  };

  const key = chatKey(receiverId, advertisementId ?? "none");
  let dialog = dialogs.value.find((d) => d.id === key);

  if (!dialog) {
    const userLabel = await getUserLabel(receiverId);
    const advTitle = await getAdvertisementTitle(advertisementId);

    dialog = {
      id: key,
      otherId: receiverId,
      advertisementId: advertisementId ?? null,
      title: `${advTitle} | ${userLabel}`,
      participant: userLabel,
      lastMessage: "",
      lastMessageAt: "",
      messages: [],
    };
    dialogs.value.unshift(dialog);
  }

  dialog.messages.push(message);
  dialog.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  dialog.lastMessage = message.text;
  dialog.lastMessageAt = message.createdAt;
  dialog.lastSenderLabel = "Вы";

  dialogs.value.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
}

onMounted(async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const meRes = await usersMeApi.me();
    me.value = meRes.data ?? meRes;

    if (!me.value?.id) throw new Error("Не удалось определить пользователя (me).");

    profile.value = {
      firstName: me.value.firstName ?? null,
      lastName: me.value.lastName ?? null,
      mail: me.value.mail ?? null,
      phone: me.value.phone ?? null,
    };

    const adsRes = await advertisementsAuthApi.me();
    const ads = adsRes.data?.content ?? [];
    myProperties.value = ads.map(mapAdvertisementToItem);

    const rentsRes = await rentalsAuthApi.me();
    const rents = rentsRes.data?.content ?? [];
    await preloadAdvertisementTitles(rents.map(r => r.advertisementId));
    renting.value = rents.map(r =>
      mapRentalToItem(r, advertTitleCache.get(r.advertisementId))
    );


    const msgsRes = await messagesAuthApi.me();
    const allMessages = msgsRes.data?.content ?? [];

    dialogs.value = await buildDialogsFromMessages(allMessages, me.value.id);
  } catch (e) {
    console.error(e);
    error.value = e?.message ?? "Ошибка загрузки профиля";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main id="main" class="py-4 flex-fill">
    <div class="container">
      <h1 class="h3 mb-4">Личный кабинет</h1>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div class="row">
        <div class="col-lg-3 mb-4">
          <ProfileCard :profile="profile" :loading="isLoading"/>
        </div>

        <div class="col-lg-9">
          <ProfileTabs v-model="activeTab"/>

          <div class="tab-content border border-top-0 p-3" id="profileTabsContent">
            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'my-properties' }"
              id="my-properties"
              role="tabpanel"
              aria-labelledby="tab-my-properties"
            >
              <div class="list-group" aria-live="polite">
                <PropertyItem
                  v-for="p in myProperties"
                  :key="p.id"
                  :item="p"
                  kind="property"
                />
                <div v-if="!isLoading && myProperties.length === 0" class="text-muted p-2">
                  Ничего не найдено.
                </div>
              </div>
            </div>

            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'renting' }"
              id="renting"
              role="tabpanel"
              aria-labelledby="tab-renting"
            >
              <div class="list-group" aria-live="polite">
                <PropertyItem
                  v-for="r in renting"
                  :key="r.id"
                  :item="r"
                  kind="renting"
                />
                <div v-if="!isLoading && renting.length === 0" class="text-muted p-2">
                  Ничего не найдено.
                </div>
              </div>
            </div>

            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'history' }"
              id="history"
              role="tabpanel"
              aria-labelledby="tab-history"
            >
              <h2 class="h5 mb-3">Сообщения</h2>

              <div class="list-group" aria-live="polite">
                <button
                  v-for="d in dialogs"
                  :key="d.id"
                  type="button"
                  class="list-group-item list-group-item-action text-start"
                  @click="openDialog(d)"
                >
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ d.title }}</h5>
                    <small class="text-muted">{{ formatDateTime(d.lastMessageAt) }}</small>
                  </div>
                  <p class="mb-1 text-truncate">{{ d.lastMessage }}</p>
                  <small class="text-muted">{{ d.lastSenderLabel }}</small>

                </button>

                <div v-if="!isLoading && dialogs.length === 0" class="text-muted p-2">
                  Диалогов пока нет.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatModal
        ref="chatModalRef"
        v-if="me?.id"
        :me-id="me.id"
        @send="handleChatSend"
      />
    </div>
  </main>
</template>
