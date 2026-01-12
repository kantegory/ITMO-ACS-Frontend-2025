<template>
  <nav class="navbar navbar-expand-lg navbar-theme bg-primary" aria-label="Главная навигация сайта">
    <div class="container">

      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <svg class="icon me-2" aria-hidden="true">
          <use href="#icon-house-heart"></use>
        </svg>
        <span>RentEstate</span>
      </RouterLink>

      <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Открыть меню навигации"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto" role="menubar" aria-label="Основные разделы сайта">

          <li v-if="isAuth" class="nav-item">
            <span class="nav-link text-light" aria-label="Текущий пользователь">
              <svg class="icon me-2"><use href="#icon-person-circle"></use></svg>
              {{ user.username }}
            </span>
          </li>

          <li
              v-for="item in menuItems"
              :key="item.name"
              class="nav-item"
          >
            <RouterLink
                v-if="item.to"
                :to="item.to"
                class="nav-link"
                :class="{ active: isActive(item.to) }"
            >
              <svg v-if="item.icon" class="icon me-1">
                <use :href="`#${item.icon}`"></use>
              </svg>
              {{ item.label }}
            </RouterLink>

            <a
                v-else
                href="#"
                class="nav-link"
                @click.prevent="item.action"
            >
              <svg v-if="item.icon" class="icon me-1">
                <use :href="`#${item.icon}`"></use>
              </svg>
              {{ item.label }}
            </a>
          </li>

        </ul>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { useNavbar } from '@/composables/useNavbar';

const {
  isAuth,
  user,
  menuItems,
  isActive
} = useNavbar();
</script>