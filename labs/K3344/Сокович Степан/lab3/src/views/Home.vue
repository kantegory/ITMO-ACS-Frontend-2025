<template>
  <div class="container my-4">
    <div class="row g-4">
      <FilterPanel @filter="handleFilter" />
      
      <section class="col-lg-9">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="mb-0">Результаты поиска</h4>
          <small class="text-muted">{{ filteredCount }} найдено</small>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
        </div>

        <div v-else class="row g-3">
          <ListingCard
            v-for="listing in listings"
            :key="listing.id"
            :listing="listing"
            @show-details="showDetailsModal = true; selectedListing = listing"
            @book="showBookingModal = true; selectedListing = listing"
          />
        </div>

        <div v-if="!loading && listings.length === 0" class="text-center py-5">
          <p class="text-muted">Объявления не найдены</p>
        </div>
      </section>
    </div>

    <DetailsModal
      :show="showDetailsModal"
      :listing="selectedListing"
      @close="showDetailsModal = false"
    />

    <BookingModal
      :show="showBookingModal"
      :listing="selectedListing"
      :loading="bookingLoading"
      :error="bookingError"
      @close="showBookingModal = false"
      @submit="handleBooking"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useListings } from '@/composables/useListings'
import { useBookings } from '@/composables/useBookings'
import { useAuth } from '@/composables/useAuth'
import FilterPanel from '@/components/FilterPanel.vue'
import ListingCard from '@/components/ListingCard.vue'
import DetailsModal from '@/components/DetailsModal.vue'
import BookingModal from '@/components/BookingModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { listings, loading, error, filteredCount, fetchListings } = useListings()
const { createBooking, loading: bookingLoading, error: bookingError } = useBookings()
const { isAuthenticated } = useAuth()

const showDetailsModal = ref(false)
const showBookingModal = ref(false)
const selectedListing = ref(null)

const handleFilter = (filters) => {
  fetchListings(filters)
}

const handleBooking = async (bookingData) => {
  if (!selectedListing.value) return
  
  try {
    await createBooking(
      selectedListing.value.id,
      bookingData.startDate,
      bookingData.endDate
    )
    showBookingModal.value = false
    alert('Бронирование успешно создано!')
    router.push('/profile')
  } catch (err) {
    console.error('Booking error:', err)
  }
}

onMounted(() => {
  fetchListings()
})
</script>

<style scoped>
h4 {
  color: #444;
}
</style>

