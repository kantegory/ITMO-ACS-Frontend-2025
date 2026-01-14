<template>
  <div class="theme-switcher">
    <div class="btn-group-vertical">
      <button
        v-for="theme in themes"
        :key="theme.name"
        type="button"
        class="theme-btn"
        :class="{ active: currentTheme === theme.name }"
        :title="theme.label"
        @click="handleThemeChange(theme.name)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path v-if="theme.icon === 'sun'" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
          <path v-else-if="theme.icon === 'moon'" d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          <path v-else d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { useTheme } from '@/composables/useTheme'
import { useNotification } from '@/composables/useNotification'

export default {
  name: 'ThemeSwitcher',
  setup() {
    const { currentTheme, themes, setTheme } = useTheme()
    const { info } = useNotification()
    const themeLabels = { light: 'Light Theme', dark: 'Dark Theme', pink: 'Pink Theme' }
    const handleThemeChange = (themeName) => {
      setTheme(themeName)
      info(`Switched to ${themeLabels[themeName]}`)
    }
    return { currentTheme, themes, handleThemeChange }
  }
}
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  background: var(--theme-card-bg, rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.btn-group-vertical { display: flex; flex-direction: column; gap: 5px; }
.theme-btn {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid transparent;
  background: var(--theme-bg-light, #f3f4f6);
  color: var(--theme-text-light, #6b7280);
  cursor: pointer; transition: all 0.3s ease;
}
.theme-btn:hover { background: #e5e7eb; color: #4f86f7; }
.theme-btn.active {
  background: linear-gradient(135deg, #4f86f7, #38b2ac);
  color: white; box-shadow: 0 4px 12px rgba(79, 134, 247, 0.4);
}
</style>
