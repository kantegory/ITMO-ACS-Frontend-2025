<template>
  <div class="container my-4">
    <div class="row">
      <aside class="col-md-3 mb-3">
        <div class="list-group">
          <a 
            class="list-group-item list-group-item-action" 
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
          >
            Профиль
          </a>
          <a 
            class="list-group-item list-group-item-action" 
            :class="{ active: activeTab === 'bookings' }"
            @click="activeTab = 'bookings'"
          >
            Мои аренды
          </a>
        </div>
      </aside>

      <section class="col-md-9">
        <div v-if="activeTab === 'profile'">
          <h3>Привет, <span>{{ currentUser?.username || 'Пользователь' }}</span></h3>
          <p v-if="currentUser">
            <strong>Email:</strong> {{ currentUser.email }}<br>
            <strong>Телефон:</strong> {{ currentUser.phone || 'Не указан' }}
          </p>
          <div class="my-3">
            <router-link to="/" class="btn btn-secondary">На главную</router-link>
          </div>
        </div>

        <div v-if="activeTab === 'bookings'">
          <h5 class="mb-3">Активные бронирования</h5>
          
          <div v-if="bookingsLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>

          <div v-else-if="bookingsError" class="alert alert-danger" role="alert">
            {{ bookingsError }}
          </div>

          <div v-else-if="bookings.length === 0" class="alert alert-info" role="alert">
            У вас нет активных бронирований
          </div>

          <div v-else>
            <div 
              v-for="booking in bookings" 
              :key="booking.id" 
              class="card mb-2 booking-card"
            >
              <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                  <strong>{{ listingTitles[booking.listingId] || `Объявление #${booking.listingId}` }}</strong><br>
                  <span class="text-muted">
                    {{ formatDate(booking.startDate) }} — {{ formatDate(booking.endDate) }}
                  </span>
                </div>
                <div>
                  <button 
                    class="btn btn-outline-secondary btn-sm me-1" 
                    @click="viewBooking(booking)"
                  >
                    Просмотреть
                  </button>
                  <button 
                    class="btn btn-outline-danger btn-sm" 
                    @click="cancelBooking(booking.id)"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <DetailsModal
      :show="showDetailsModal"
      :listing="selectedListing"
      @close="showDetailsModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useBookings } from '@/composables/useBookings'
import { useListings } from '@/composables/useListings'
import DetailsModal from '@/components/DetailsModal.vue'

const { currentUser } = useAuth()
const { bookings, loading: bookingsLoading, error: bookingsError, fetchBookings, cancelBooking: cancelBookingApi } = useBookings()
const { getListingById } = useListings()

const activeTab = ref('profile')
const showDetailsModal = ref(false)
const selectedListing = ref(null)

const listingsCache = ref({})
const listingTitles = ref({})

const loadListingTitle = async (listingId) => {
  if (listingTitles.value[listingId]) {
    return listingTitles.value[listingId]
  }
  if (listingsCache.value[listingId]) {
    listingTitles.value[listingId] = listingsCache.value[listingId].title
    return listingTitles.value[listingId]
  }
  try {
    const listing = await getListingById(listingId)
    listingsCache.value[listingId] = listing
    listingTitles.value[listingId] = listing.title
    return listingTitles.value[listingId]
  } catch {
    listingTitles.value[listingId] = `Объявление #${listingId}`
    return listingTitles.value[listingId]
  }
}

const viewBooking = async (booking) => {
  try {
    const listing = await getListingById(booking.listingId)
    selectedListing.value = listing
    showDetailsModal.value = true
  } catch (err) {
    console.error('Error loading listing:', err)
  }
}

const cancelBooking = async (bookingId) => {
  if (confirm('Вы уверены, что хотите отменить бронирование?')) {
    try {
      await cancelBookingApi(bookingId)
    } catch (err) {
      console.error('Error canceling booking:', err)
      alert('Ошибка при отмене бронирования')
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

onMounted(async () => {
  await fetchBookings()
  for (const booking of bookings.value) {
    await loadListingTitle(booking.listingId)
  }
})
</script>

<style scoped>
.booking-card {
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.list-group-item {
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}

.list-group-item.active {
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  font-weight: bold;
  border-color: transparent;
}
</style>

