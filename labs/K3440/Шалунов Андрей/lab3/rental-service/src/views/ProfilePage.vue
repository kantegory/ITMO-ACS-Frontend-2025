<template>
    <AppNavbar />
    <BaseLayout>
        <h1 class="h3 mb-3">Личный кабинет</h1>

        <div v-if="auth.user" class="mb-4">
            <div class="card card-body">
                <p class="mb-1"><strong>Имя:</strong> {{ auth.user.name || "-" }}</p>
                <p class="mb-1"><strong>Email:</strong> {{ auth.user.email || "-" }}</p>
                <p class="mb-0"><strong>Телефон:</strong> {{ auth.user.phone || "-" }}</p>

                <RouterLink class="btn btn-outline-primary btn-sm mt-3 align-self-start" to="/profile/edit">
                    Изменить данные
                </RouterLink>
            </div>
        </div>

        <section class="row g-4 mb-4" aria-label="Список объектов">
            <div class="col-12 col-lg-6">
                <h2 class="h5">Арендую</h2>

                <div v-if="profile.loading" class="text-muted small mb-0">Загрузка...</div>
                <div v-else>
                    <div v-if="rentals.length === 0" class="text-muted small mb-0">
                        Нет активных арендуемых объектов.
                    </div>

                    <div v-for="r in rentals" :key="r.key" class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-title">{{ r.title }}</h6>
                            <p class="mb-1">Цена: {{ r.price }} ₽</p>
                            <p class="mb-1">Адрес: {{ r.location }}</p>
                            <p class="mb-0">Статус: {{ r.status }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-6">
                <h2 class="h5">Сдаю</h2>

                <div v-if="profile.loading" class="text-muted small mb-0">Загрузка...</div>
                <div v-else>
                    <div v-if="ownedPropertiesCards.length === 0" class="text-muted small mb-0">
                        Нет объектов, которые вы сдаёте.
                    </div>

                    <div v-for="o in ownedPropertiesCards" :key="o.key" class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-title">{{ o.title }}</h6>
                            <p class="mb-1">Цена: {{ o.price }} ₽</p>
                            <p class="mb-1">Адрес: {{ o.location }}</p>
                            <p class="mb-0">Статус: {{ o.status }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <h2 class="h5 mb-2">История сделок (по бронированиям)</h2>
        <div v-if="profile.loading" class="text-muted">Загрузка...</div>
        <div v-else>
            <div v-if="profile.error" class="alert alert-danger">{{ profile.error }}</div>

            <div class="table-responsive mb-4">
                <table class="table table-sm align-middle">
                    <thead>
                        <tr>
                            <th>Объект</th>
                            <th>Цена</th>
                            <th>Статус</th>
                            <th>Даты</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="profile.bookings.length === 0">
                            <td colspan="4" class="text-muted small">Сделок пока нет.</td>
                        </tr>

                        <tr v-for="b in profile.bookings" :key="b.booking_id || (b.property_id + '-' + b.start_at)">
                            <td>{{ b.property?.title || `Объект #${b.property_id || "-"}` }}</td>
                            <td>{{ toNumber(b.total_price) }} ₽</td>
                            <td>{{ b.deal_status || b.status || "-" }}</td>
                            <td>{{ formatRange(b.start_at, b.end_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h2 class="h5 mb-2">История сообщений</h2>
        <div v-if="messages.loading" class="text-muted">Загрузка...</div>
        <div v-else>
            <div v-if="messages.error" class="alert alert-danger">{{ messages.error }}</div>

            <ul class="list-group">
                <li v-if="messages.chats.length === 0" class="list-group-item text-muted small">Чатов пока нет.</li>
                <ChatListItem
                    v-for="c in messages.chats"
                    :key="c.chat_id || c.property_id + ':' + (c.lastMessage?.sent_at || '')"
                    :chat="c"
                    :myId="myId"
                />
            </ul>
        </div>
    </BaseLayout>
</template>

<script setup>
import { computed, onMounted } from "vue";
import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import ChatListItem from "@/components/ChatListItem.vue";

import { useAuthStore } from "@/stores/auth";
import { useProfileStore } from "@/stores/profile";
import { useMessagesStore } from "@/stores/messages";

const auth = useAuthStore();
const profile = useProfileStore();
const messages = useMessagesStore();

const myId = computed(() => Number(auth.user?.user_id || auth.user?.id || 0));

function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

function formatDate(value) {
    if (!value) return "-";

    const iso = String(value).slice(0, 10);
    const parts = iso.split("-");
    if (parts.length !== 3) return "-";

    const [y, m, d] = parts;
    if (!y || !m || !d) return "-";

    return `${d}.${m}.${y}`;
}

function formatRange(start, end) {
    return `${formatDate(start)} - ${formatDate(end)}`;
}

function normalizeBookingForCards(b) {
    const property = b?.property || {};

    const title = property.title || `Объект #${b.property_id || b.propertyId || "-"}`;
    const location = property.location || "-";
    const price = toNumber(b.total_price ?? b.totalPrice ?? property.price_per_day ?? property.pricePerDay ?? 0);
    const status = b.deal_status || b.status || "-";

    const renterId = Number(
        b.renter_id ?? b.renterId ?? b.renter?.user_id ?? b.renter?.id ?? 0
    ) || 0;

    const ownerId = Number(
        property.owner?.user_id ??
        property.owner?.id ??
        property.owner_id ??
        property.ownerId ??
        0
    ) || 0;

    return {
        key: b.booking_id || `${b.property_id}-${b.start_at}-${renterId}-${ownerId}`,
        title,
        location,
        price,
        status,
        renterId,
        ownerId
    };
}

const rentals = computed(() => {
    const id = myId.value;
    if (!id) return [];

    return (profile.bookings || [])
        .map(normalizeBookingForCards)
        .filter((x) => x.renterId === id);
});

const ownedPropertiesCards = computed(() => {
    return (profile.ownedProperties || []).map((p) => ({
        key: p.property_id || p.id,
        title: p.title || `Объект #${p.property_id || p.id || "-"}`,
        location: p.location || "-",
        price: toNumber(p.price_per_day ?? p.pricePerDay ?? 0),
        status: p.status || "-"
    }));
});

onMounted(async () => {
    if (!auth.user) {
        await auth.fetchMe();
    }

    await profile.loadBookings();
    await profile.loadOwnedProperties();

    if (myId.value) {
        await messages.loadChats(myId.value);
    }
});
</script>