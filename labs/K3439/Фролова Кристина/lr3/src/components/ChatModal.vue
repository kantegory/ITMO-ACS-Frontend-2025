<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import {formatDateTime} from "../utils/datetime.js";

const props = defineProps({
  meId: { type: [String, Number], required: true },
});

const emit = defineEmits([
  "send",
]);

const modalEl = ref(null);
const bodyEl = ref(null);
const inputEl = ref(null);

let modal = null;

const chat = ref(null);
const message = ref("");

const title = computed(() => chat.value?.title || "Диалог");
const messages = computed(() => chat.value?.messages ?? []);
const otherName = computed(() => chat.value?.participant || "Собеседник");

function scrollToBottom() {
  const el = bodyEl.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

async function open(newChat) {
  chat.value = newChat;
  modal?.show();

  await nextTick();
  scrollToBottom();
  inputEl.value?.focus();
}

function close() {
  modal?.hide();
}

function send() {
  const text = message.value.trim();
  if (!text || !chat.value) return;

  emit("send", {
    receiverId: chat.value.otherId,
    advertisementId: chat.value.advertisementId,
    text,
  });

  message.value = "";
  nextTick().then(() => {
    scrollToBottom();
    inputEl.value?.focus();
  });
}

function onKeydown(e) {
  if (e.key === "Enter") send();
}

onMounted(() => {
  modal = Modal.getOrCreateInstance(modalEl.value, {});
});

onBeforeUnmount(() => {
  modal?.dispose();
  modal = null;
});

defineExpose({ open, close });
</script>

<template>
  <div
    ref="modalEl"
    class="modal fade"
    id="chatModal"
    tabindex="-1"
    aria-labelledby="chatModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="chatModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
        </div>

        <div ref="bodyEl" class="modal-body" id="chatContent">
          <div v-if="!chat" class="text-muted">Выберите диалог</div>

          <div v-else>
            <div v-for="m in messages" :key="m.id" class="mb-2">
              <strong>{{ m.senderId === meId ? "Вы" : otherName }}:</strong>
              {{ m.text }}<br />
              <small class="text-muted">{{ formatDateTime(m.createdAt) }}</small>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <input
            ref="inputEl"
            v-model="message"
            type="text"
            class="form-control"
            id="chatInput"
            placeholder="Написать сообщение..."
            :disabled="!chat"
            @keydown="onKeydown"
          />
          <button
            id="chatSendBtn"
            class="btn btn-primary"
            type="button"
            :disabled="!chat || !message.trim()"
            @click="send"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
