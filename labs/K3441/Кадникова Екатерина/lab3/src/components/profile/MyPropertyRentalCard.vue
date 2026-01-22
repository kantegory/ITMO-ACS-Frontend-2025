<template>
  <div class="card p-3 mb-3 position-relative">

    <span class="position-absolute top-0 end-0 m-2 px-2 py-1" :class="statusClass">
      {{ statusText }}
    </span>

    <h5 class="mb-2">{{ rental.property?.title || 'Без названия' }}</h5>

    <p v-if="rental.tenant" class="mb-1">
      <strong>Арендатор:</strong> {{ rental.tenant.username }}
    </p>
    <p v-else class="mb-1">
      <strong>Арендатор:</strong> Не указан
    </p>

    <p class="mb-1">
      <strong>С:</strong> {{ rental.startedAt || '-' }} <strong>По:</strong> {{ rental.endedAt || '-' }}
    </p>

    <div v-if="rental.status === 'pending'" class="mt-2">
      <button class="btn btn-success me-2" @click="changeStatus('active')">Одобрить</button>
      <button class="btn btn-danger" @click="changeStatus('cancelled')">Отклонить</button>
    </div>

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

const emit = defineEmits(['update']);

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

function changeStatus(status) {
  try {
    emit('update', props.rental.id, status);
  } catch (err) {
    console.error('Ошибка при обновлении статуса:', err);
    alert(err.message || 'Ошибка обновления статуса');
  }
}
</script>