<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top" aria-label="Основная навигация сайта">
    <div class="container-fluid container-lg">
      <router-link class="navbar-brand text-success fw-bold" to="/">
        <svg class="icon logo-icon me-2" role="img" aria-label="Логотип FitLife: пульс"><use href="/icons.svg#icon-heart-pulse"></use></svg>
        FitLife
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Переключить навигацию">
        <svg class="icon-hamburger" width="30" height="30" aria-hidden="true">
          <use href="/icons.svg#icon-hamburger"></use>
        </svg>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/search" active-class="active">
              <svg class="icon me-1" aria-hidden="true"><use href="/icons.svg#icon-search"></use></svg>
              Поиск
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard" active-class="active">
              <svg class="icon me-1" aria-hidden="true"><use href="/icons.svg#icon-person"></use></svg>
              Личный кабинет
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/login" active-class="active">
              <svg class="icon me-1" aria-hidden="true"><use href="/icons.svg#icon-box-arrow-in-right"></use></svg>
              Вход
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register" active-class="active">
              Регистрация
            </router-link>
          </li>
          <li class="nav-item ms-lg-2">
            <button class="btn" :class="themeButtonClass" @click="toggleTheme" aria-label="Переключить тёмную/светлую тему">
              <svg class="icon" aria-hidden="true">
                <use :href="`/icons.svg#${isDark ? 'icon-sun-fill' : 'icon-moon-fill'}`"></use>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useTheme } from '../composables/useTheme'
import { computed } from 'vue'

export default {
  name: 'Navbar',
  setup() {
    const { isDark, toggleTheme } = useTheme()
    
    const themeButtonClass = computed(() => {
      return isDark.value ? 'btn-outline-light' : 'btn-outline-dark'
    })

    return {
      isDark,
      toggleTheme,
      themeButtonClass
    }
  }
}
</script>