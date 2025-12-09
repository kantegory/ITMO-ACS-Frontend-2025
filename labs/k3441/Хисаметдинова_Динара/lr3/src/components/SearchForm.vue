<template>
  <form class="search-container search-bg rounded-4 p-4" @submit.prevent="submitSearch">
    <div class="row g-3">
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label text-muted small">Location</label>
          <div class="input-group">
            <input
              v-model="searchForm.location"
              type="text"
              class="form-control border-0"
              placeholder="Where are you going? (optional)"
            >
            <button
              class="btn btn-outline-primary btn-sm"
              type="button"
              @click="useCurrentLocation"
              :disabled="isGettingLocation"
              aria-label="Use my current location"
            >
              <i v-if="isGettingLocation" class="fas fa-spinner fa-spin" aria-hidden="true"></i>
              <i v-else class="fas fa-map-marker-alt" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="checkIn" class="form-label text-muted small">Check In</label>
          <input
            v-model="searchForm.checkIn"
            type="date"
            class="form-control border-0"
            id="checkIn"
            required
          >
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="checkOut" class="form-label text-muted small">Check Out</label>
          <input
            v-model="searchForm.checkOut"
            type="date"
            class="form-control border-0"
            id="checkOut"
            required
          >
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label text-muted small">Rooms and Guests</label>
          <button
            type="button"
            class="form-control border-0 text-start"
            @click="showGuestsModal = true"
          >
            {{ guestsText }}
          </button>
        </div>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <button type="submit" class="btn btn-primary btn-lg px-5">
          <i class="fas fa-search me-2"></i>Search
        </button>
      </div>
    </div>
  </form>

  <div v-if="showGuestsModal" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Rooms and Guests</h5>
          <button type="button" class="btn-close" @click="showGuestsModal = false"></button>
        </div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <span>Rooms</span>
                <div class="d-flex align-items-center gap-3">
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseRooms">-</button>
                  <span>{{ guests.rooms }}</span>
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseRooms">+</button>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <span>Adults</span>
                <div class="d-flex align-items-center gap-3">
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseAdults">-</button>
                  <span>{{ guests.adults }}</span>
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseAdults">+</button>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <span>Children</span>
                <div class="d-flex align-items-center gap-3">
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseChildren">-</button>
                  <span>{{ guests.children }}</span>
                  <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseChildren">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="showGuestsModal = false">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiService } from '@/composables/useApiService'

const emit = defineEmits(['search'])
const { apiService } = useApiService()

const searchForm = ref({
  location: '',
  checkIn: '',
  checkOut: ''
})

const guests = ref({
  rooms: 1,
  adults: 1,
  children: 0
})

const showGuestsModal = ref(false)
const isGettingLocation = ref(false)

const guestsText = computed(() => {
  return `${guests.value.rooms} room, ${guests.value.adults} adult${guests.value.adults > 1 ? 's' : ''}, ${guests.value.children} children`
})

const submitSearch = () => {
  emit('search', {
    ...searchForm.value,
    guests: guests.value
  })
}

const useCurrentLocation = async () => {
  if (isGettingLocation.value) return

  isGettingLocation.value = true

  try {
    const position = await apiService.getUserLocation()
    console.log('Position received:', position)

    const locationInfo = await apiService.reverseGeocode(position.latitude, position.longitude)
    console.log('Location info:', locationInfo)

    searchForm.value.location = `${locationInfo.city}, ${locationInfo.country}`

    emit('search', {
      ...searchForm.value,
      guests: guests.value,
      useLocation: true,
      coordinates: {
        latitude: position.latitude,
        longitude: position.longitude
      },
      locationInfo
    })
  } catch (error) {
    console.error('Failed to get location:', error)
    alert('Unable to get your current location')
  } finally {
    isGettingLocation.value = false
  }
}

const increaseRooms = () => { guests.value.rooms++ }
const decreaseRooms = () => { if (guests.value.rooms > 1) guests.value.rooms-- }
const increaseAdults = () => { guests.value.adults++ }
const decreaseAdults = () => { if (guests.value.adults > 1) guests.value.adults-- }
const increaseChildren = () => { guests.value.children++ }
const decreaseChildren = () => { if (guests.value.children > 0) guests.value.children-- }
</script>

<style scoped>
.search-container {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 30px var(--shadow-color);
  max-width: 1000px;
}

.search-bg {
  background-color: rgba(255, 255, 255, 0.95) !important;
}

[data-theme="dark"] .search-bg {
  background-color: rgba(45, 55, 72, 0.95) !important;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .search-bg {
    background-color: rgba(45, 55, 72, 0.95) !important;
  }
}

.form-control {
  background: var(--input-bg) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

.form-label {
  color: var(--text-muted) !important;
}

[data-theme="dark"] .form-label {
  color: #adb5bd !important;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .form-label {
    color: #adb5bd !important;
  }
}

.text-muted {
  color: var(--text-muted) !important;
}

.modal.show {
  opacity: 1;
}

.modal-content {
  background-color: var(--card-bg) !important;
  color: var(--text-color) !important;
  border-color: var(--border-color) !important;
}

.modal-header {
  border-bottom-color: var(--border-color) !important;
}

.modal-footer {
  border-top-color: var(--border-color) !important;
}
</style>