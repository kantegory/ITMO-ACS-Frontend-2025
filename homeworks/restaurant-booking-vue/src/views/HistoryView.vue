<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'
import { useRouter } from 'vue-router'

const router = useRouter()
const bookings = ref([])

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  if (!user) return router.push('/login')
  const res = await api.getBookings(user.email)
  bookings.value = res.data
})
</script>

<template>
  <div class="container mt-4">
    <h2>История бронирований</h2>
    <ul class="list-group mt-3">
      <li class="list-group-item" v-for="b in bookings" :key="b.id">
        {{ b.name }} — {{ b.date }} — {{ b.guests }} гостей
      </li>
    </ul>
    <p v-if="bookings.length === 0" class="text-muted mt-3">История пуста</p>
  </div>
</template>
