<template>
  <div v-if="restaurant">
    <h2 class="mb-3">{{ restaurant.name }}</h2>
    <img :src="restaurant.image" class="img-fluid rounded mb-4" alt="">

    <p><strong>Кухня:</strong> {{ restaurant.type }}</p>
    <p><strong>Цена:</strong> {{ restaurant.price }}</p>
    <p><strong>Описание:</strong> {{ restaurant.description }}</p>

    <div class="card p-3 mt-3">
      <h5>Забронировать столик</h5>

      <form @submit.prevent="handleBooking">
        <div class="mb-2">
          <label class="form-label">Дата</label>
          <input v-model="date" type="date" class="form-control" required>
        </div>

        <div class="mb-2">
          <label class="form-label">Время</label>
          <input v-model="time" type="time" class="form-control" required>
        </div>

        <div class="mb-2">
          <label class="form-label">Человек</label>
          <select v-model="guests" class="form-select">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5+</option>
          </select>
        </div>

        <button class="btn btn-success" type="submit">Забронировать</button>
      </form>
    </div>
  </div>

  <p v-else class="text-danger">Ресторан не найден</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useAuth } from '@/composables/useAuth'

const { fetchRestaurantById, createBooking } = useApi()
const { user } = useAuth()
const route  = useRoute()
const router = useRouter()

const restaurant = ref(null)
const date       = ref('')
const time       = ref('')
const guests     = ref('1')

// загружаем данные ресторана по id из url
onMounted(async () => {
  const id = route.params.id
  if (!id) return
  restaurant.value = await fetchRestaurantById(id)
})

async function handleBooking() {
  if (!user.value) {
    alert('Сначала войдите в аккаунт')
    router.push('/login')
    return
  }

  const booking = {
    userId: user.value.id,
    restaurantId: Number(route.params.id),
    date: date.value,
    time: time.value,
    guests: guests.value
  }

  try {
    await createBooking(booking)
    alert('Бронирование создано')
    router.push('/profile')
  } catch (err) {
    alert('Ошибка бронирования')
  }
}
</script>