<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'alert',
          `alert-${notification.type === 'error' ? 'danger' : notification.type}`,
          'alert-dismissible',
          'fade',
          'show',
          'notification-item'
        ]"
        role="alert"
      >
        {{ notification.message }}
        <button
          type="button"
          class="btn-close"
          @click="remove(notification.id)"
          aria-label="Закрыть уведомление"
        ></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications'

const { notifications, remove } = useNotifications()
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 500px;
}

.notification-item {
  margin-bottom: 0.5rem;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

