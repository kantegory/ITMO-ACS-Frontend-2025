<template>
  <main class="auth-wrapper">
    <div class="auth-card card shadow-lg border-0">
      <div class="card-body p-4 p-md-5">
        <header class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Вход</h1>
          <router-link to="/" class="link-secondary text-decoration-none">На главную</router-link>
        </header>

        <nav aria-label="Выбор типа пользователя">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'candidate' }"
                @click="activeTab = 'candidate'"
                type="button"
                role="tab"
              >
                Соискатель
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                :class="{ active: activeTab === 'employer' }"
                @click="activeTab = 'employer'"
                type="button"
                role="tab"
              >
                Работодатель
              </button>
            </li>
          </ul>
        </nav>

        <LoginForm :active-tab="activeTab" />

        <p class="mb-0 small text-muted text-center mt-3">
          Нет аккаунта?
          <router-link to="/register" class="text-decoration-none">Зарегистрироваться</router-link>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/LoginForm.vue'

const activeTab = ref('candidate')
</script>

