<template>
  <div class="application-card">
    <div class="min-w-0">
      <p class="title text-truncate mb-1">{{ application.title }}</p>
      <p class="meta mb-0 text-truncate">{{ application.candidate || '' }}</p>
    </div>
    <span v-if="!editable" class="pill">{{ application.status || 'статус не указан' }}</span>
    <button v-else class="pill buttonish" @click="$emit('change-status', application)">
      {{ application.status || 'статус не указан' }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  application: { type: Object, required: true },
  editable: { type: Boolean, default: false },
})

defineEmits(['change-status'])
</script>
