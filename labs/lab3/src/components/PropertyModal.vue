<template>
  <div class="custom-modal">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header align-items-center">
          <div class="d-flex align-items-center">
            <svg class="icon me-2 header-icon">
              <use href="#icon-house-heart"></use>
            </svg>
            <h5 class="modal-title">{{ property.title }}</h5>
          </div>

          <button type="button" class="btn-close" @click="$emit('close')" />
        </div>

        <div class="modal-body">
          <div class="row">

            <div class="col-md-6">
              <img
                  :src="image"
                  class="img-fluid rounded mb-3"
                  style="max-height:350px; width:100%; object-fit:cover"
              />
            </div>

            <div class="col-md-6">
              <p class="d-flex align-items-center">
                <svg class="icon me-2"><use href="#icon-geo"></use></svg>
                <strong>Адрес:</strong>&nbsp; {{ property.location || '—' }}
              </p>

              <p class="d-flex align-items-center">
                <svg class="icon me-2"><use href="#icon-house"></use></svg>
                <strong>Тип:</strong>&nbsp; {{ propertyType }}
              </p>

              <p class="d-flex align-items-center">
                <svg class="icon me-2"><use href="#icon-calendar"></use></svg>
                <strong>Аренда:</strong>&nbsp; {{ rentalType }}
              </p>

              <p class="d-flex align-items-center">
                <svg class="icon me-2"><use href="#icon-ruble"></use></svg>
                <strong>Цена:</strong>&nbsp; {{ price }}
              </p>

              <p v-if="property.area" class="d-flex align-items-center">
                <svg class="icon me-2"><use href="#icon-bar-chart"></use></svg>
                <strong>Площадь:</strong>&nbsp; {{ property.area }} м²
              </p>

              <p><strong>Описание:</strong></p>
              <p>{{ property.description || 'Описание отсутствует' }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            Отмена
          </button>

          <button class="btn btn-outline-primary" @click="$emit('chat', property.id)">
            <svg class="icon me-1"><use href="#icon-chat-dots"></use></svg>
            Начать чат
          </button>

          <button class="btn btn-primary" @click="$emit('rent', property.id)">
            <svg class="icon me-1"><use href="#icon-check-circle"></use></svg>
            Арендовать
          </button>
        </div>

      </div>
    </div>

    <div class="custom-modal-backdrop" @click="$emit('close')"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { propertyTypeMap, rentalTypeMap, getPlaceholderImage } from '@/api/properties.api';

const props = defineProps({
  property: { type: Object, required: true }
});

const image = computed(
    () => props.property.images?.[0] || getPlaceholderImage(props.property.propertyType)
);

const propertyType = computed(
    () => propertyTypeMap[props.property.propertyType] || props.property.propertyType
);

const rentalType = computed(
    () => rentalTypeMap[props.property.rentalType] || props.property.rentalType
);

const price = computed(() => {
  if (!props.property.price) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(props.property.price);
});
</script>