<template>
  <div id="app">
    <ThemeSwitcher />
    <NotificationToast />
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'
import NotificationToast from '@/components/common/NotificationToast.vue'
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'App',
  components: { ThemeSwitcher, NotificationToast },
  setup() {
    const { initTheme } = useTheme()
    onMounted(() => initTheme())
  }
}
</script>
