<template>
  <main class="container mt-5">
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="restaurant">
      <h2>{{ restaurant.name }}</h2>
      <router-link to="/" class="btn btn-secondary mb-4">← На главную</router-link>

      <!-- Carousel -->
      <div id="restaurantCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div 
            v-for="(image, index) in restaurant.images" 
            :key="index"
            :class="['carousel-item', { active: index === 0 }]"
          >
            <img 
              :src="getImageUrl(image)" 
              class="d-block w-100" 
              :alt="restaurant.name"
              style="height: 400px; object-fit: cover;"
            >
          </div>
        </div>
        <button 
          class="carousel-control-prev" 
          type="button" 
          data-bs-target="#restaurantCarousel" 
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button 
          class="carousel-control-next" 
          type="button" 
          data-bs-target="#restaurantCarousel" 
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>

      <!-- Menu -->
      <section class="mb-4">
        <h3>Меню</h3>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          <div 
            v-for="(item, index) in restaurant.menu" 
            :key="index"
            class="col"
          >
            <div class="card h-100 shadow-sm">
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-0">{{ item.name }}</h5>
                  <span class="badge bg-primary-subtle text-primary fw-semibold">
                    {{ item.price }}
                  </span>
                </div>
                <p class="card-text text-muted mb-0">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Reviews -->
      <section class="mb-4">
        <h3>Отзывы</h3>

        <div 
          v-for="(review, index) in restaurant.reviews" 
          :key="index"
          class="card mb-2"
        >
          <div class="card-body">
            <h5 class="mb-1">{{ review.name }}</h5>
            <p class="mb-0">{{ review.text }}</p>
          </div>
        </div>

        <div v-if="isAuthenticated" class="card mt-3">
          <div class="card-body">
            <h5 class="card-title">Оставить отзыв</h5>
            <form @submit.prevent="handleAddReview">
              <div class="mb-3">
                <label for="reviewText" class="form-label">Ваш отзыв</label>
                <textarea
                  id="reviewText"
                  v-model="newReviewText"
                  class="form-control"
                  rows="3"
                  placeholder="Поделитесь впечатлениями о ресторане"
                  required
                />
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="!newReviewText.trim() || submittingReview"
              >
                {{ submittingReview ? 'Отправка...' : 'Отправить отзыв' }}
              </button>
            </form>
          </div>
        </div>
        <div v-else class="alert alert-info mt-3">
          Войдите в систему, чтобы оставить отзыв.
        </div>
      </section>

      <button class="btn btn-success" @click="handleBookingClick">
        Забронировать столик
      </button>

      <BookingModal 
        ref="bookingModal"
        :restaurant-id="restaurant.id"
        :restaurant-name="restaurant.name"
        @booking-success="handleBookingSuccess"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookingModal from '@/components/BookingModal.vue'
import { useRestaurants } from '@/composables/useRestaurants'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { resolveImage } from '@/assets/imageMap'
import type { Restaurant, Review } from '@/types'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, currentUser } = useAuth()
const { showToast } = useToast()
const { fetchRestaurantById, addReview, loading, error } = useRestaurants()

const restaurant = ref<Restaurant | null>(null)
const bookingModal = ref<InstanceType<typeof BookingModal>>()
const newReviewText = ref('')
const submittingReview = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  restaurant.value = await fetchRestaurantById(id)
})

const getImageUrl = (path: string) => {
  return resolveImage(path) || ''
}

const handleBookingClick = () => {
  if (!isAuthenticated.value) {
    showToast('Сначала войдите в систему!', 'danger')
    return
  }
  bookingModal.value?.show()
}

const handleBookingSuccess = () => {
  router.push('/profile')
}

const handleAddReview = async () => {
  if (!restaurant.value) return
  if (!currentUser.value) {
    showToast('Сначала войдите в систему!', 'danger')
    return
  }

  const text = newReviewText.value.trim()
  if (!text) return

  submittingReview.value = true
  try {
    const review: Review = {
      name: currentUser.value.username,
      text
    }
    const updated = await addReview(restaurant.value.id, review)
    if (updated) {
      restaurant.value = updated
      newReviewText.value = ''
      showToast('Отзыв добавлен', 'success')
    } else {
      showToast('Не удалось добавить отзыв', 'danger')
    }
  } catch (error) {
    console.error(error)
    showToast('Ошибка добавления отзыва', 'danger')
  } finally {
    submittingReview.value = false
  }
}
</script>

