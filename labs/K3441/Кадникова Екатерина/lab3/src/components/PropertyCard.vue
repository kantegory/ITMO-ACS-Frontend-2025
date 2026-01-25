<template>
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card property-card h-100 shadow-sm hover-shadow">

      <div
          class="position-relative"
          style="height:200px; overflow:hidden"
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

        <p class="card-text text-muted small flex-grow-1" style="min-height:60px">
          {{ property.description || 'Описание отсутствует' }}
        </p>

        <div class="mt-3">
          <p class="mb-1">
            <svg class="icon me-2"><use href="#icon-geo"></use></svg>
            {{ property.location || 'Не указано' }}
          </p>

          <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
            <div>
              <span class="fw-bold fs-5 text-primary">
                {{ price }}
              </span>

              <span v-if="pricePer" class="text-muted small ms-1">
                / {{ pricePer }}
              </span>
            </div>

            <button
                class="btn btn-outline-primary btn-sm"
                @click="$emit('open', property)"
            >
              Подробнее
            </button>
          </div>
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

const price = computed(() => {
  if (!props.property.price) return 'Цена не указана';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(props.property.price);
});

const pricePer = computed(() => {
  const rt = props.property.rentalType;
  return rt === 'daily'
      ? 'день'
      : rt === 'monthly'
          ? 'месяц'
          : rt === 'yearly'
              ? 'год'
              : '';
});
</script>