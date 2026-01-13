<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg shadow-sm">
    <div class="container">
      <router-link class="navbar-brand text-danger fw-bold" :to="{ name: 'main' }">Кулинарное сообщество</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">Поиск</router-link>
          </li>
          <li class="nav-item" v-if="!userStore.isAuthenticated">
            <router-link class="nav-link" :to="{ name: 'login' }">Вход</router-link>
          </li>
          <li class="nav-item" v-if="!userStore.isAuthenticated">
            <router-link class="nav-link" :to="{ name: 'register' }">Регистрация</router-link>
          </li>
          <li class="nav-item" v-if="userStore.isAuthenticated">
            <router-link class="nav-link" :to="{ name: 'profile' }">Профиль</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
