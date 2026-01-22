<template>
  <div class="card p-3 mb-3 position-relative">

    <span class="position-absolute top-0 end-0 m-2 px-2 py-1" :class="statusClass">
      {{ statusText }}
    </span>

    <h5 class="mb-2">{{ rental.property?.title || 'Без названия' }}</h5>

    <p class="mb-1">
      <strong>Адрес:</strong> {{ rental.property?.location || 'Не указано' }}
    </p>

    <p class="mb-1">
      <strong>Цена:</strong> {{ formattedPrice }}
    </p>

    <p class="mb-0">
      <strong>Период:</strong> {{ rental.startedAt || '-' }} — {{ rental.endedAt || '-' }}
    </p>

  </div>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  rental: {
    type: Object,
    required: true
  }
});

const statusText = computed(() => {
  switch (props.rental.status) {
    case 'pending':
      return 'Ожидает';
    case 'active':
      return 'Активна';
    case 'completed':
      return 'Завершена';
    case 'cancelled':
      return 'Отменена';
    default:
      return props.rental.status || '-';
  }
});

const statusClass = computed(() => {
  switch (props.rental.status) {
    case 'pending':
      return 'badge bg-warning text-dark';
    case 'active':
      return 'badge bg-primary';
    case 'completed':
      return 'badge bg-success';
    case 'cancelled':
      return 'badge bg-danger';
    default:
      return 'badge bg-secondary';
  }
});

const formattedPrice = computed(() => {
  const price = props.rental.property?.price || 0;
  return new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB', maximumFractionDigits: 0}).format(price);
});
</script>