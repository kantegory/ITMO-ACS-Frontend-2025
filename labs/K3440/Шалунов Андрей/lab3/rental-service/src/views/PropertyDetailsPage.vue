<template>
    <AppNavbar />
    <BaseLayout>
        <nav aria-label="Хлебные крошки" class="mb-3">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><RouterLink to="/search">Поиск</RouterLink></li>
                <li class="breadcrumb-item active" aria-current="page">{{ title }}</li>
            </ol>
        </nav>

        <div v-if="store.loading" class="text-muted">Загрузка объявления...</div>
        <div v-else-if="store.error" class="alert alert-danger">{{ store.error }}</div>

        <template v-else-if="store.property">
            <h1 class="h2 mb-1">{{ title }}</h1>
            <p class="text-muted mb-4">{{ store.property.location || "Адрес не указан" }}</p>

            <div class="row g-4 mb-4">
                <div class="col-12 col-lg-7">
                    <PropertyGallery :photos="store.photos" />
                </div>

                <div class="col-12 col-lg-5">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2 class="card-title h4 mb-3">{{ priceText }}</h2>
                            <p class="mb-1"><strong>Тип:</strong> {{ typeLabel }}</p>
                            <p class="mb-1"><strong>Статус:</strong> {{ statusLabel }}</p>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-body">
                            <h3 class="card-title h5 mb-3">Владелец</h3>
                            <p class="mb-1"><strong>Имя:</strong> {{ store.property.owner?.name || "-" }}</p>
                            <p class="mb-2"><strong>Телефон:</strong> {{ phoneText }}</p>

                            <button
                                class="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                                type="button"
                                :disabled="phoneShown"
                                @click="showPhone"
                            >
                                <IconSvg name="phone" /> {{ phoneShown ? "Номер показан" : "Показать номер" }}
                            </button>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-body">
                            <h3 class="card-title h5 mb-3">Условия аренды</h3>
                            <ul class="mb-0">
                                <li v-for="(t, i) in rentalTermsList" :key="t + i">{{ t }}</li>
                            </ul>
                        </div>
                    </div>

                    <BookingCard
                        :pricePerDay="pricePerDay"
                        :disabled="isOccupied"
                        @submit="handleBooking"
                    />

                    <div class="card mb-3">
                        <div class="card-body">
                            <h3 class="card-title h5 mb-3">Сообщение владельцу</h3>

                            <div v-if="msgError" class="alert alert-danger">{{ msgError }}</div>
                            <div v-if="msgSuccess" class="alert alert-success">Сообщение отправлено.</div>

                            <div class="mb-2">
                                <label class="form-label">Тема</label>
                                <input
                                    v-model="msgSubject"
                                    class="form-control form-control-sm"
                                    type="text"
                                    placeholder="Например: Вопрос по аренде"
                                />
                            </div>

                            <div class="mb-2">
                                <label class="form-label">Сообщение</label>
                                <textarea
                                    v-model="msgText"
                                    class="form-control form-control-sm"
                                    rows="3"
                                    placeholder="Здравствуйте..."
                                ></textarea>
                            </div>

                            <button class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1" type="button" @click="sendToOwner">
                                <IconSvg name="message" /> Отправить
                            </button>
                        </div>
                    </div>

                    <RouterLink class="btn btn-outline-secondary" to="/search">
                        Вернуться к поиску
                    </RouterLink>
                </div>
            </div>

            <div class="row g-4 align-items-stretch">
                <div class="col-12 col-lg-8">
                    <div class="card h-100">
                        <div class="card-body">
                            <h3 class="card-title h5 mb-3">Описание</h3>
                            <p class="mb-0">{{ store.property.description || "Описание пока не добавлено." }}</p>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-lg-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h3 class="card-title h5 mb-3">Особенности</h3>
                            <ul class="mb-0">
                                <li v-for="(f, i) in featuresList" :key="f + i">{{ f }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </BaseLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import PropertyGallery from "@/components/PropertyGallery.vue";
import BookingCard from "@/components/BookingCard.vue";
import IconSvg from "@/components/IconSvg.vue";

import { useAuthStore } from "@/stores/auth";
import { usePropertyDetailsStore } from "@/stores/propertyDetails";
import { useMessagesStore } from "@/stores/messages";

const route = useRoute();
const auth = useAuthStore();
const store = usePropertyDetailsStore();
const messages = useMessagesStore();

const id = computed(() => Number(route.params.id));
const phoneShown = ref(false);

const msgSubject = ref("");
const msgText = ref("");
const msgError = ref("");
const msgSuccess = ref(false);

const TYPE_LABELS = { flat: "Квартира", house: "Дом", room: "Комната" };
const STATUS_LABELS = { available: "Свободно", occupied: "Занято", closed: "Неактивно" };

const title = computed(() => store.property?.title || "Объявление");

const pricePerDay = computed(() => {
    const n = Number(store.property?.price_per_day);
    return Number.isFinite(n) ? n : 0;
});

const priceText = computed(() => (pricePerDay.value ? `${pricePerDay.value} ₽ / день` : "Цена уточняется"));

const typeLabel = computed(() => TYPE_LABELS[store.property?.type] || store.property?.type || "—");
const statusLabel = computed(() => STATUS_LABELS[store.property?.status] || store.property?.status || "—");

const isOccupied = computed(() => store.property?.status === "occupied");

const phoneText = computed(() => {
    const ph = store.property?.owner?.phone;
    if (!ph) return "+7-***-***-**-**";
    return phoneShown.value ? ph : "+7-***-***-**-**";
});

const rentalTermsList = computed(() => {
    const t = store.property?.rental_terms || "";
    const arr = t.split("\n").map((s) => s.trim()).filter(Boolean);
    return arr.length ? arr : ["Информация не указана."];
});

const featuresList = computed(() => {
    const t = store.property?.features || "";
    const arr = t.split("\n").map((s) => s.trim()).filter(Boolean);
    return arr.length ? arr : ["Информация не указана."];
});

function showPhone() {
    phoneShown.value = true;
}

async function handleBooking({ start_at, end_at, total_price }) {
    msgError.value = "";
    msgSuccess.value = false;

    const renterId = auth.user?.user_id || auth.user?.id;
    const propertyId = id.value;

    if (!renterId || !propertyId) {
        msgError.value = "Ошибка определения данных пользователя.";
        return;
    }

    try {
        await store.createBooking({
            property_id: propertyId,
            renter_id: renterId,
            start_at,
            end_at,
            total_price,
            deal_status: "pending"
        });

        await store.markOccupied(propertyId);
        await store.load(propertyId);
    } catch (e) {
        msgError.value = e.message || "Не удалось создать бронирование.";
    }
}

async function sendToOwner() {
    msgError.value = "";
    msgSuccess.value = false;

    const propertyId = id.value;
    const recipientId = store.property?.owner?.user_id || store.property?.owner_id;
    const senderId = auth.user?.user_id || auth.user?.id;

    if (!senderId || !recipientId) {
        msgError.value = "Не удалось определить владельца/пользователя.";
        return;
    }

    const text = msgText.value.trim();
    if (!text) {
        msgError.value = "Введите текст сообщения.";
        return;
    }

    const subject = msgSubject.value.trim();
    const fullText = subject ? `${subject}\n\n${text}` : text;

    try {
        await messages.sendMessage({
            sender_id: senderId,
            recipient_id: recipientId,
            property_id: propertyId,
            text: fullText
        });

        msgSubject.value = "";
        msgText.value = "";
        msgSuccess.value = true;
    } catch (e) {
        msgError.value = e.message || "Ошибка при отправке сообщения.";
    }
}

onMounted(async () => {
    if (!auth.user) await auth.fetchMe();
    if (id.value) await store.load(id.value);
});
</script>