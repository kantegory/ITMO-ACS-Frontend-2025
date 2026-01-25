<script setup>
import { computed } from 'vue'
import { useBookingsStore } from '../stores/bookings.store'

const bookings = useBookingsStore()
const count = computed(() => bookings.items.length)
</script>

<template>
  <div class="d-flex justify-content-between align-items-baseline flex-wrap gap-2 mb-3">
    <div>
      <h1 class="h3 mb-1">Мои бронирования</h1>
      <div class="text-secondary">Всего: {{ count }}</div>
    </div>

    <router-link class="btn btn-outline-primary" to="/">
      ← К ресторанам
    </router-link>
  </div>

  <div v-if="!bookings.items.length" class="alert alert-warning">
    Бронирований пока нет.
  </div>

  <div v-else class="row g-3">
    <div class="col-12 col-md-6" v-for="b in bookings.items" :key="b.id">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h3 class="h5 mb-1">{{ b.restaurantName }}</h3>

          <div class="text-secondary small mb-2">
            {{ b.date }} • {{ b.time }} • гостей: {{ b.guests }}
          </div>

          <div v-if="b.comment" class="small mb-3">
            <span class="text-secondary">Комментарий:</span> {{ b.comment }}
          </div>

          <div class="d-flex gap-2">
            <router-link class="btn btn-sm btn-outline-secondary" :to="`/restaurant/${b.restaurantId}`">
              Открыть ресторан
            </router-link>
            <button class="btn btn-sm btn-outline-danger" type="button" @click="bookings.remove(b.id)">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
