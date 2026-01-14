<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['alert', `alert-${notification.type}`, 'notification-item']"
      >
        <span class="notification-icon">{{ getIcon(notification.type) }}</span>
        <span class="notification-message">{{ notification.message }}</span>
        <button type="button" class="btn-close-custom" @click="removeNotification(notification.id)">×</button>
        <div class="notification-progress" :class="`progress-${notification.type}`"></div>
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

    const getIcon = (type) => {
      const icons = { success: '✓', danger: '✗', warning: '⚠', info: 'ℹ' }
      return icons[type] || 'ℹ'
    }

    return { notifications, removeNotification, getIcon }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 80px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  min-width: 280px;
}

.notification-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.notification-message {
  flex: 1;
  font-weight: 500;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  padding: 0;
  line-height: 1;
  color: inherit;
}

.btn-close-custom:hover {
  opacity: 1;
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  animation: progress 3s linear forwards;
}

.progress-success { background: #059669; }
.progress-danger { background: #dc2626; animation-duration: 5s; }
.progress-warning { background: #d97706; animation-duration: 4s; }
.progress-info { background: #2563eb; animation-duration: 2s; }

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.notification-enter-active {
  animation: slideIn 0.3s ease-out;
}

.notification-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100px);
  }
}
</style>
