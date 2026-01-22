<template>
  <div class="col-md-6 col-lg-4 mb-3">
    <div class="card h-100 shadow-sm">

      <div
          class="position-relative"
          style="height:200px; overflow:hidden; border-radius:10px 10px 0 0;"
      >
        <img
            :src="image"
            class="card-img-top"
            :alt="property.title"
            style="height:100%; width:100%; object-fit:cover"
        />

        <span class="badge bg-primary position-absolute top-0 start-0 m-2">
          {{ propertyType }}
        </span>

        <span class="badge bg-success position-absolute top-0 end-0 m-2">
          {{ rentalType }}
        </span>
      </div>

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ property.title }}</h5>
        <p class="text-muted small flex-grow-1">
          {{ property.description || 'Описание отсутствует' }}
        </p>

        <p class="mb-2">
          <svg class="icon me-2"><use href="#icon-ruble"></use></svg>
          <strong>{{ formattedPrice }}</strong>
        </p>

        <p class="small mb-3">
          <svg class="icon me-2"><use href="#icon-geo"></use></svg>
          {{ property.location || 'Не указано' }}
        </p>

        <div class="d-flex justify-content-between mt-auto pt-2 border-top">
          <button class="btn btn-primary btn-sm" @click="$emit('edit', property)">
            <svg class="icon me-1">
              <use xlink:href="#icon-pencil-square"></use>
            </svg>
            Редактировать
          </button>

          <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', property.id)">
            <svg class="icon me-1">
              <use xlink:href="#icon-trash"></use>
            </svg>
            Удалить
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getPlaceholderImage, propertyTypeMap, rentalTypeMap } from '@/api/properties.api';

const props = defineProps({
  property: { type: Object, required: true }
});

const image = computed(() =>
    props.property.images?.[0] || getPlaceholderImage(props.property.propertyType)
);

const propertyType = computed(
    () => propertyTypeMap[props.property.propertyType] || props.property.propertyType
);

const rentalType = computed(
    () => rentalTypeMap[props.property.rentalType] || props.property.rentalType
);

const formattedPrice = computed(() =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(props.property.price || 0)
);
</script>