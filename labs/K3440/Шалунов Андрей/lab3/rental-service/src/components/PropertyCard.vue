<template>
    <div class="card h-100 shadow-sm">
        <img class="card-img-top" :src="property.main_photo_url || placeholder" alt="Фото недвижимости" />

        <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ property.title || "Объявление" }}</h5>

            <p class="mb-1"><strong>Тип:</strong> {{ typeLabel }}</p>
            <p class="mb-1"><strong>Локация:</strong> {{ property.location || "-" }}</p>
            <p class="mb-3"><strong>Цена:</strong> {{ price }} ₽/день</p>

            <RouterLink class="btn btn-outline-primary btn-sm mt-auto align-self-start" :to="`/property/${property.property_id}`">
                Подробнее
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    property: { type: Object, required: true }
});

const placeholder = "https://placehold.co/400x250?text=Нет+фото";

const TYPE_LABELS = { flat: "Квартира", house: "Дом", room: "Комната" };

const typeLabel = computed(() => {
    const t = props.property?.type;
    return TYPE_LABELS[t] || t || "-";
});

const price = computed(() => {
    const n = Number(props.property?.price_per_day);
    return Number.isFinite(n) ? n : 0;
});
</script>