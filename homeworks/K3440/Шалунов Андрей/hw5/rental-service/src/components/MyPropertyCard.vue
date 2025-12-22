<template>
    <div class="card h-100 shadow-sm">
        <img
            class="card-img-top"
            :src="property.main_photo_url || placeholder"
            alt="Фото недвижимости"
        />

        <div class="card-body">
            <h5 class="card-title">{{ property.title || "Объявление" }}</h5>

            <p class="mb-1">
                <strong>Тип:</strong>
                {{ typeLabel }}
            </p>

            <p class="mb-1">
                <strong>Статус:</strong>
                {{ statusLabel }}
            </p>

            <p class="mb-1">
                <strong>Локация:</strong>
                {{ property.location || "—" }}
            </p>

            <p class="mb-3">
                <strong>Цена:</strong>
                {{ price }} ₽/сутки
            </p>

            <div class="mt-auto d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm" type="button" @click="onEdit">
                    Редактировать
                </button>

                <button class="btn btn-outline-danger btn-sm" type="button" @click="onDelete">
                    Удалить
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    property: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(["edit", "delete"]);

const placeholder = "https://via.placeholder.com/400x250?text=Нет+фото";

const TYPE_LABELS = {
    flat: "Квартира",
    house: "Дом",
    room: "Комната"
};

const STATUS_LABELS = {
    available: "Свободно",
    occupied: "Занято",
    closed: "Неактивно"
};

const typeLabel = computed(() => {
    const t = props.property?.type;
    return TYPE_LABELS[t] || t || "—";
});

const statusLabel = computed(() => {
    const s = props.property?.status;
    return STATUS_LABELS[s] || s || "—";
});

const price = computed(() => {
    const v = props.property?.price_per_day;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
});

function onEdit() {
    emit("edit", props.property);
}

function onDelete() {
    emit("delete", props.property);
}
</script>