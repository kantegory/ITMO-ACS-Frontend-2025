<template>
  <div class="container mt-4">
    <h2>История бронирований</h2>

    <div v-if="loading" class="text-center my-3">Загрузка бронирований...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <ul class="list-group mt-3" v-if="!loading && bookings.length > 0">
      <li class="list-group-item" v-for="b in bookings" :key="b.id">
        {{ b.name }} — {{ b.date }} — {{ b.guests }} гостей
      </li>
    </ul>

    <p v-if="!loading && bookings.length === 0" class="text-muted mt-3">
      История пуста
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBookings } from '../composables/useBookings'
import { currentUser } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { bookings, fetchBookings, loading, error } = useBookings()

onMounted(async () => {
  if (!currentUser.value) return router.push('/login')
  await fetchBookings(currentUser.value.email)
})
</script>
