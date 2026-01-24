<template>
  <div>
    <h2 class="mb-4">Личный кабинет</h2>

    <div class="card p-4">
      <h5>Имя: {{ user?.name || '-' }}</h5>
      <p>Email: {{ user?.email }}</p>

      <h6 class="mt-3">История бронирований</h6>
      <ul class="list-group mt-2">
        <li
          v-for="b in bookings"
          :key="b.id"
          class="list-group-item"
        >
          {{ b.restaurantName }} — {{ b.date }} в {{ b.time }} — {{ b.guests }} чел.
        </li>
        <li v-if="!bookings.length" class="list-group-item">Нет бронирований</li>
      </ul>

      <button @click="logout" class="btn btn-outline-secondary mt-3">
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useApi } from '@/composables/useApi'

const { user, logout } = useAuth()
const router = useRouter()
const { fetchBookingsForUser, fetchRestaurantById } = useApi()

const bookings = ref([])

// загружаем бронирования и названия ресторанов
onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }

  const userBookings = await fetchBookingsForUser(user.value.id)

  bookings.value = await Promise.all(
    userBookings.map(async b => {
      const r = await fetchRestaurantById(b.restaurantId)
      return { ...b, restaurantName: r.name }
    })
  )
})
</script>