<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">
      <svg class="icon me-2">
        <use href="#icon-house"></use>
      </svg>
      Найдите идеальную недвижимость для аренды
    </h1>

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Фильтры поиска</h5>

        <form class="row g-3" @submit.prevent="performSearch">
          <div class="col-md-3">
            <label class="form-label">Местоположение</label>
            <input v-model="filters.location" class="form-control" />
          </div>

          <div class="col-md-2">
            <label class="form-label">Тип недвижимости</label>
            <select v-model="filters.propertyType" class="form-select">
              <option value="">Все</option>
              <option
                  v-for="(label, key) in propertyTypeMap"
                  :key="key"
                  :value="key"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <div class="col-md-2">
            <label class="form-label">Тип аренды</label>
            <select v-model="filters.rentalType" class="form-select">
              <option value="">Все</option>
              <option
                  v-for="(label, key) in rentalTypeMap"
                  :key="key"
                  :value="key"
              >
                {{ label }}
              </option>
            </select>
          </div>

          <div class="col-md-2">
            <label class="form-label">Мин. цена</label>
            <input v-model.number="filters.minPrice" type="number" class="form-control" />
          </div>

          <div class="col-md-2">
            <label class="form-label">Макс. цена</label>
            <input v-model.number="filters.maxPrice" type="number" class="form-control" />
          </div>

          <div class="col-md-1 d-flex align-items-end">
            <button class="btn btn-primary w-100">
              <svg class="icon me-1">
                <use href="#icon-search"></use>
              </svg>
              Найти
            </button>
          </div>
        </form>

        <button
            class="btn btn-outline-secondary mt-3"
            @click="resetFilters"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>

    <div class="row">
      <PropertyCard
          v-for="p in properties"
          :key="p.id"
          :property="p"
          @open="openProperty"
      />
    </div>

    <div v-if="!properties.length && !loading" class="alert alert-info text-center">
      По вашему запросу ничего не найдено
    </div>

    <PropertyModal
        v-if="selectedProperty"
        :property="selectedProperty"
        @close="selectedProperty = null"
        @rent="openRental"
    />

    <RentalModal
        v-if="rentalPropertyId"
        :property-id="rentalPropertyId"
        @close="rentalPropertyId = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getAllProperties,
  searchProperties,
  propertyTypeMap,
  rentalTypeMap
} from '@/api/properties.api';

import PropertyCard from '@/components/PropertyCard.vue';
import PropertyModal from '@/components/PropertyModal.vue';
import RentalModal from '@/components/RentalModal.vue';

const properties = ref([]);
const loading = ref(false);
const selectedProperty = ref(null);
const rentalPropertyId = ref(null);

const filters = ref({
  location: '',
  propertyType: '',
  rentalType: '',
  minPrice: null,
  maxPrice: null
});

async function loadProperties() {
  loading.value = true;
  properties.value = await getAllProperties();
  loading.value = false;
}

async function performSearch() {
  loading.value = true;
  properties.value = await searchProperties(filters.value);
  loading.value = false;
}

function resetFilters() {
  filters.value = {
    location: '',
    propertyType: '',
    rentalType: '',
    minPrice: null,
    maxPrice: null
  };
  performSearch();
}

function openProperty(property) {
  selectedProperty.value = property;
}

function openRental(id) {
  rentalPropertyId.value = id;
}

onMounted(loadProperties);
</script>
