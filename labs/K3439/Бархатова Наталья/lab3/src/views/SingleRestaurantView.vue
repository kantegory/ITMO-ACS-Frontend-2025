<template>
  <base-layout>
    <header class="mb-3">
      <nav class="navbar navbar-dark">
        <div class="container d-flex justify-content-between">
          <RouterLink to="/restaurants" class="navbar-brand">
            ← Назад к списку ресторанов
          </RouterLink>

          <RouterLink to="/profile" class="nav-link text-light">
            Профиль
          </RouterLink>
        </div>
      </nav>
    </header>

    <main class="container mt-4" v-if="restaurant">
      <img :src="restaurant.img" :alt="restaurant.name" class="header-img mb-3" />
      <h1>{{ restaurant.name }}</h1>

      <section class="info-card">
        <p><strong>Кухня:</strong> {{ cuisineLabel }}</p>
        <p><strong>Район:</strong> {{ locationLabel }}</p>
        <p><strong>Адрес:</strong> {{ restaurant.address }}</p>
        <p><strong>Цена:</strong> {{ '$'.repeat(restaurant.price) }}</p>

        <button class="btn btn-primary" @click="showBookingModal = true">
          Забронировать стол
        </button>
      </section>

      <section class="info-card mt-3">
        <h2>Доступность столиков</h2>
        <input type="date" class="form-control mb-2" v-model="selectedDate" @change="checkTables" />
        <p :class="tablesClass">{{ tablesInfo }}</p>
      </section>

      <RestaurantGallery :gallery="restaurant.gallery" />
      <ReviewsBlock :reviews="reviews" />

      <div v-if="showBookingModal" class="modal-backdrop">
        <div class="modal d-block" tabindex="-1">
          <div class="modal-dialog">
            <form class="modal-content" @submit.prevent="submitBooking">
              <div class="modal-header">
                <h5 class="modal-title">Бронирование</h5>
                <button type="button" class="btn-close" @click="showBookingModal = false"></button>
              </div>
              <div class="modal-body">
                <input v-model="bookingDate" type="date" class="form-control mb-2" required />
                <input v-model="bookingTime" type="time" class="form-control mb-2" required />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary w-100">Подтвердить</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="showToast" class="booking-toast">
        Бронирование подтверждено!
      </div>
    </main>
  </base-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import RestaurantGallery from '@/components/RestaurantGallery.vue'
import ReviewsBlock from '@/components/ReviewsBlock.vue'
import { useRestaurant } from '@/composables/useRestaurant'

const route = useRoute()
const userId = localStorage.getItem('userId')
const showBookingModal = ref(false)
const bookingDate = ref('')
const bookingTime = ref('')
const showToast = ref(false)
const selectedDate = ref(null)

const {
  restaurant,
  reviews,
  freeTables,
  loadRestaurant,
  checkTablesForDate,
  createBooking
} = useRestaurant(route.params.id)

const cuisineMap = { Italian: 'Итальянская', Asian: 'Азиатская', French: 'Французская', North: 'Северная' }
const locationMap = { Centre: 'Центральный', Primorsky: 'Приморский', Autozavodsky: 'Автозаводский' }

const cuisineLabel = computed(() => cuisineMap[restaurant.value.cuisine])
const locationLabel = computed(() => locationMap[restaurant.value.location])
const tablesInfo = computed(() => {
  if (freeTables.value === null) return 'Выберите дату'
  return freeTables.value > 0 ? `Свободных столиков: ${freeTables.value}` : 'Свободных столиков нет'
})
const tablesClass = computed(() => (freeTables.value > 0 ? 'text-success' : 'text-danger'))

const checkTables = () => {
  if (selectedDate.value) checkTablesForDate(selectedDate.value)
}

const submitBooking = async () => {
  if (!bookingDate.value || !bookingTime.value) return

  await createBooking({
    userId,
    date: bookingDate.value,
    time: bookingTime.value
  })

  checkTablesForDate(bookingDate.value)
  selectedDate.value = bookingDate.value
  showBookingModal.value = false
  bookingDate.value = ''
  bookingTime.value = ''
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

onMounted(loadRestaurant)
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1050;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1060;
}

.booking-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #198754;
  color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1100;
}
</style>
