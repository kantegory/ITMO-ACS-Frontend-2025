<template>
    <div>
        <div class="card mb-3 position-relative">
            <img
                class="card-img-top"
                :src="current"
                alt="Фото объекта"
                style="height: 340px; object-fit: cover;"
            />
            <button
                class="btn btn-light btn-sm position-absolute top-50 start-0 translate-middle-y ms-2"
                type="button"
                @click="prev"
            >
                &#10094;
            </button>
            <button
                class="btn btn-light btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                type="button"
                @click="next"
            >
                &#10095;
            </button>
        </div>

        <div class="row g-2">
            <div v-for="(url, idx) in photos" :key="url + idx" class="col-4">
                <img
                    class="img-fluid rounded"
                    :class="{ 'border border-2 border-primary': idx === index }"
                    :src="url"
                    alt="Миниатюра"
                    style="height: 90px; width: 100%; object-fit: cover; cursor: pointer;"
                    @click="index = idx"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
    photos: { type: Array, required: true }
});

const index = ref(0);

watch(
    () => props.photos,
    () => {
        index.value = 0;
    }
);

const current = computed(() => props.photos[index.value] || props.photos[0]);

function prev() {
    if (!props.photos.length) return;
    index.value = (index.value - 1 + props.photos.length) % props.photos.length;
}

function next() {
    if (!props.photos.length) return;
    index.value = (index.value + 1) % props.photos.length;
}
</script>