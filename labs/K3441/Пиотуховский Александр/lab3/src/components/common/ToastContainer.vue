<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="custom-toast"
      :class="`toast-${toast.type}`"
      @click="removeToast(toast.id)"
    >
      <div class="d-flex align-items-center">
        <span class="toast-icon me-2">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useToast} from '@/composables/useToast'

const {toasts, removeToast} = useToast()

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.custom-toast {
  background: var(--color-card-bg);
  color: var(--color-white);
  padding: 12px 20px;
  border-radius: var(--border-radius);
  margin-bottom: 10px;
  cursor: pointer;
  animation: slideIn 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
