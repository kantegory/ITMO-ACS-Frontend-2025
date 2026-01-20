<template>
    <AppNavbar />

    <BaseLayout>
        <h1 class="h3 mb-3 d-flex align-items-center gap-2">
            <IconSvg name="icon-search" />
            Поиск недвижимости
        </h1>

        <div class="card card-body mb-3">
            <form class="row g-3" @submit.prevent="onApply">
                <div class="col-12 col-md-3">
                    <label class="form-label">Тип</label>
                    <select v-model="filters.type" class="form-select">
                        <option value="all">Любой</option>
                        <option value="flat">Квартира</option>
                        <option value="house">Дом</option>
                        <option value="room">Комната</option>
                    </select>
                </div>

                <div class="col-12 col-md-3">
                    <label class="form-label">Город</label>
                    <select v-model="filters.city" class="form-select">
                        <option value="all">Любой</option>
                        <option value="Санкт-Петербург">Санкт-Петербург</option>
                        <option value="Москва">Москва</option>
                    </select>
                </div>

                <div class="col-6 col-md-3">
                    <label class="form-label">Цена от</label>
                    <input v-model="filters.minPrice" type="number" min="0" class="form-control" />
                </div>

                <div class="col-6 col-md-3">
                    <label class="form-label">Цена до</label>
                    <input v-model="filters.maxPrice" type="number" min="0" class="form-control" />
                </div>

                <div class="col-12 d-flex gap-2">
                    <button class="btn btn-primary" type="submit" :disabled="propsStore.loading">
                        Применить
                    </button>
                    <button class="btn btn-outline-secondary" type="button" @click="onReset" :disabled="propsStore.loading">
                        Сбросить
                    </button>
                </div>
            </form>
        </div>

        <div v-if="propsStore.error" class="alert alert-danger" role="alert">
            {{ propsStore.error }}
        </div>

        <div v-if="propsStore.loading" class="text-muted">
            Загружаем объявления...
        </div>

        <div v-else class="row g-3">
            <div v-if="propsStore.items.length === 0" class="text-muted">
                Объявлений не найдено.
            </div>

            <div v-for="p in propsStore.items" :key="p.property_id" class="col-12 col-md-4">
                <PropertyCard :property="p" />
            </div>
        </div>
    </BaseLayout>
</template>

<script setup>
import { reactive, onMounted } from "vue";

import AppNavbar from "@/components/AppNavbar.vue";
import BaseLayout from "@/layouts/BaseLayout.vue";
import IconSvg from "@/components/IconSvg.vue";
import PropertyCard from "@/components/PropertyCard.vue";

import { usePropertiesStore } from "@/stores/properties";

const propsStore = usePropertiesStore();

const filters = reactive({
    type: "all",
    city: "all",
    minPrice: "",
    maxPrice: ""
});

async function onApply() {
    propsStore.setFilters(filters);
    await propsStore.load(filters);
}

async function onReset() {
    filters.type = "all";
    filters.city = "all";
    filters.minPrice = "";
    filters.maxPrice = "";

    propsStore.setFilters(filters);
    await propsStore.load(filters);
}

onMounted(async () => {
    propsStore.setFilters(filters);
    await propsStore.load(filters);
});
</script>