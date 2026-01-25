<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantsStore } from '../stores/restaurants.store'
import { useBookingsStore } from '../stores/bookings.store'

const props = defineProps({ id: { type: String, required: true } })

const router = useRouter()
const restaurants = useRestaurantsStore()
const bookings = useBookingsStore()

const loading = ref(false)
const error = ref(null)
const restaurant = ref(null)

const form = ref({ date: '', time: '19:00', guests: 2, comment: '' })
const ok = ref(false)

async function load(id) {
  loading.value = true
  error.value = null
  restaurant.value = null
  ok.value = false

  try {
    restaurant.value = await restaurants.loadById(id)
  } catch (e) {
    error.value = e?.message ?? 'Ошибка'
  } finally {
    loading.value = false
  }
}

onMounted(() => load(props.id))

// если перейти с /restaurant/1 на /restaurant/2 — компонент переиспользуется, нужно перезагрузить данные [page:0]
watch(() => props.id, (newId) => load(newId))

function submit() {
  if (!restaurant.value) return

  bookings.add({
    restaurantId: restaurant.value.id,
    restaurantName: restaurant.value.name,
    ...form.value,
  })
  ok.value = true
}
</script>

<template>
  <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
    <button class="btn btn-outline-secondary" type="button" @click="router.push('/')">
      ← Назад
    </button>

    <router-link class="btn btn-outline-primary" to="/bookings">
      Перейти к броням
    </router-link>
  </div>

  <div v-if="loading" class="alert alert-info">Загрузка…</div>
  <div v-else-if="error" class="alert alert-danger">Ошибка: {{ error }}</div>

  <div v-else-if="!restaurant" class="alert alert-warning">
    Ресторан не найден.
  </div>

  <template v-else>
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <h1 class="h3 mb-1">{{ restaurant.name }}</h1>
        <div class="text-secondary mb-3">{{ restaurant.city }} • {{ restaurant.address }}</div>

        <div class="d-flex flex-wrap gap-2">
          <span class="badge text-bg-secondary">Кухня: {{ restaurant.cuisine }}</span>
          <span class="badge text-bg-secondary">Цена: {{ restaurant.price }}</span>
          <span class="badge text-bg-warning">★ {{ restaurant.rating }}</span>
          <span class="badge text-bg-info">Часы: {{ restaurant.hours }}</span>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="h5 mb-3">Бронирование</h2>

        <form class="row g-3" @submit.prevent="submit">
          <div class="col-12 col-md-4">
            <label class="form-label">Дата</label>
            <input v-model="form.date" type="date" class="form-control" required>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Время</label>
            <select v-model="form.time" class="form-select" required>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label">Количество гостей</label>
            <input v-model.number="form.guests" type="number" min="1" max="20" class="form-control" required>
          </div>

          <div class="col-12">
            <label class="form-label">Комментарий (опционально)</label>
            <textarea v-model="form.comment" rows="3" class="form-control" placeholder="Особые пожелания..."></textarea>
          </div>

          <div class="col-12 d-grid">
            <button class="btn btn-primary" type="submit">Подтвердить бронирование</button>
          </div>
        </form>

        <div v-if="ok" class="alert alert-success mt-3 mb-0">
          Бронирование добавлено (демо).
        </div>
      </div>
    </div>
  </template>
</template>
