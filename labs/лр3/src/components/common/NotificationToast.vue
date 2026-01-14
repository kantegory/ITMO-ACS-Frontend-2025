<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['alert', `alert-${notification.type}`, 'alert-dismissible', 'fade', 'show']"
      >
        <strong>{{ notification.message }}</strong>
        <button type="button" class="btn-close" @click="removeNotification(notification.id)"></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script>
import { useNotification } from '@/composables/useNotification'
export default {
  name: 'NotificationToast',
  setup() {
    const { notifications, removeNotification } = useNotification()
    return { notifications, removeNotification }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed; top: 20px; right: 20px;
  z-index: 9999; min-width: 300px; max-width: 500px;
}
.notification-enter-active, .notification-leave-active { transition: all 0.3s ease; }
.notification-enter-from, .notification-leave-to { opacity: 0; transform: translateX(100px); }
</style>
