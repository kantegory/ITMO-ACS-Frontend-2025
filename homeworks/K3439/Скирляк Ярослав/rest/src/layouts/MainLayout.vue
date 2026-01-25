<script setup>
import { useRestaurantsStore } from '../stores/restaurants.store'
const restaurantsStore = useRestaurantsStore()
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">TableBook</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
        aria-controls="nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="nav" class="collapse navbar-collapse">
        <div class="navbar-nav ms-auto">
          <router-link class="nav-link" to="/" exact-active-class="active">Рестораны</router-link>
          <router-link class="nav-link" to="/bookings" exact-active-class="active">
            Брони <span class="badge text-bg-light ms-1">{{ restaurantsStore.bookingsCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>

  <main class="container py-4">
    <router-view />
  </main>
</template>
