<template>
  <div class="property-page">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="property" class="container py-4" style="margin-top: 80px;">
      <div class="row mb-4">
        <div class="col-12">
          <h1>{{ property.title }}</h1>
          <div class="d-flex align-items-center mb-2">
            <span class="text-warning me-2">{{ property.rating }}</span>
            <span class="text-muted">{{ property.reviews }} reviews</span>
            <span class="text-muted mx-2">•</span>
            <span class="text-muted">{{ property.location }}</span>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <img
            :src="property.image"
            :alt="property.title"
            class="img-fluid rounded-4 w-100"
            style="height: 400px; object-fit: cover;"
          >
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="mb-4">
            <h3>About this property</h3>
            <p>{{ property.description }}</p>
          </div>

          <div class="row mb-4">
            <div class="col-md-4">
              <div class="info-item">
                <i class="fas fa-users text-primary me-2"></i>
                <strong>{{ property.maxGuests }} guests</strong>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-item">
                <i class="fas fa-bed text-primary me-2"></i>
                <strong>{{ property.bedrooms }} bedroom{{ property.bedrooms > 1 ? 's' : '' }}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <div class="info-item">
                <i class="fas fa-bath text-primary me-2"></i>
                <strong>{{ property.bathrooms }} bathroom{{ property.bathrooms > 1 ? 's' : '' }}</strong>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h4>Amenities</h4>
            <div class="row">
              <div v-for="amenity in property.amenities" :key="amenity" class="col-6 col-md-4 mb-2">
                <div class="d-flex align-items-center">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  <span class="text-capitalize">{{ amenity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card sticky-top" style="top: 100px;">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <h3 class="mb-0">${{ property.price }}</h3>
                <span class="text-muted ms-2">per night</span>
              </div>

              <form @submit.prevent="handleBooking">
                <div class="row mb-3">
                  <div class="col-6">
                    <label class="form-label small text-muted">CHECK-IN</label>
                    <input
                      v-model="bookingForm.checkIn"
                      type="date"
                      class="form-control"
                      required
                    >
                  </div>
                  <div class="col-6">
                    <label class="form-label small text-muted">CHECK-OUT</label>
                    <input
                      v-model="bookingForm.checkOut"
                      type="date"
                      class="form-control"
                      required
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small text-muted">GUESTS</label>
                  <select v-model="bookingForm.guests" class="form-select">
                    <option v-for="i in property.maxGuests" :key="i" :value="i">
                      {{ i }} guest{{ i > 1 ? 's' : '' }}
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 py-3 mb-3"
                  :disabled="!authStore.isAuthenticated"
                >
                  {{ authStore.isAuthenticated ? 'Reserve' : 'Login to book' }}
                </button>

                <div v-if="totalNights > 0" class="border-top pt-3">
                  <div class="d-flex justify-content-between mb-2">
                    <span>${{ property.price }} x {{ totalNights }} nights</span>
                    <span>${{ totalPrice }}</span>
                  </div>
                  <div class="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${{ totalPrice }}</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
      <h3>Property not found</h3>
      <p class="text-muted">The property you're looking for doesn't exist.</p>
      <RouterLink to="/search" class="btn btn-primary">Browse Properties</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApiService } from '@/composables/useApiService'
import { type Property } from '@/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { apiService } = useApiService()

const property = ref<Property | null>(null)
const isLoading = ref(true)

const bookingForm = ref({
  checkIn: '',
  checkOut: '',
  guests: 1
})

const totalNights = computed(() => {
  if (!bookingForm.value.checkIn || !bookingForm.value.checkOut) return 0

  const checkIn = new Date(bookingForm.value.checkIn)
  const checkOut = new Date(bookingForm.value.checkOut)
  const diffTime = checkOut.getTime() - checkIn.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
})

const totalPrice = computed(() => {
  if (!property.value || totalNights.value === 0) return 0
  return property.value.price * totalNights.value
})

onMounted(async () => {
  await loadProperty()
})

const loadProperty = async () => {
  isLoading.value = true

  try {
    const propertyId = route.params.id as string
    console.log('Loading property with ID:', propertyId)

    const response = await apiService.getPropertyById(propertyId)

    if (response.success && response.data) {
      property.value = response.data
    } else {
      const allPropertiesResponse = await apiService.getProperties()
      if (allPropertiesResponse.success && allPropertiesResponse.data) {
        const numericId = parseInt(propertyId)
        property.value = allPropertiesResponse.data.find((p: any) =>
          p.id === numericId || p.id === propertyId
        ) || null
      }
    }
  } catch (error) {
    console.error('Failed to load property:', error)
  } finally {
    isLoading.value = false
  }
}

const handleBooking = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (totalNights.value === 0) {
    alert('Please select valid check-in and check-out dates')
    return
  }

  alert(`Booking created for ${totalNights.value} nights. Total: $${totalPrice.value}`)
}
</script>

<style scoped>
.property-page {
  min-height: 100vh;
}

.info-item {
  padding: 0.5rem 0;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.form-control, .form-select {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn-primary {
  font-weight: 600;
}
</style>