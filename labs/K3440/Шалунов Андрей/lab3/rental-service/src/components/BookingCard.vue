<template>
    <div class="card mb-3">
        <div class="card-body">
            <h3 class="card-title h5 mb-3">Бронирование</h3>

            <form @submit.prevent="onSubmit">
                <div class="mb-2">
                    <label class="form-label">Дата заезда</label>
                    <input v-model="start" type="date" class="form-control form-control-sm" @change="calc" />
                </div>

                <div class="mb-2">
                    <label class="form-label">Дата выезда</label>
                    <input v-model="end" type="date" class="form-control form-control-sm" @change="calc" />
                </div>

                <p class="mb-2">
                    <strong>Итого:</strong> {{ totalText }}
                </p>

                <p v-if="error" class="text-danger small mb-2" role="alert">{{ error }}</p>

                <div class="d-flex justify-content-center mt-2">
                    <button class="btn btn-primary btn-sm btn-booking" type="submit" :disabled="disabled">
                        {{ disabled ? "Недоступно" : "Забронировать" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    pricePerDay: { type: Number, required: true },
    disabled: { type: Boolean, default: false }
});

const emit = defineEmits(["submit"]);

const start = ref("");
const end = ref("");
const total = ref(null);
const error = ref("");

const totalText = computed(() => (total.value == null ? "—" : `${total.value} ₽`));

function calc() {
    error.value = "";
    total.value = null;

    if (!start.value || !end.value) return;

    const s = new Date(start.value);
    const e = new Date(end.value);
    const days = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);

    if (!Number.isFinite(days) || days <= 0) return;

    total.value = Math.round(days * props.pricePerDay);
}

function onSubmit() {
    error.value = "";

    if (!start.value || !end.value || total.value == null) {
        error.value = "Пожалуйста, проверьте даты бронирования.";
        return;
    }

    emit("submit", {
        start_at: start.value,
        end_at: end.value,
        total_price: total.value
    });
}
</script>