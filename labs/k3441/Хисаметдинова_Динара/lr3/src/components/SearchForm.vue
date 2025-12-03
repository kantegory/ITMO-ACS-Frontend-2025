<template>
  <form class="search-container bg-white rounded-4 p-4" @submit.prevent="submitSearch">
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
              aria-label="Use my current location"
            >
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
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

  <!-- Guests Modal -->
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
  try {
    const location = await apiService.getUserLocation()
    console.log('Current location:', location)
    // In a real implementation, you would reverse geocode these coordinates
    searchForm.value.location = 'Current Location'
  } catch (error) {
    console.error('Failed to get location:', error)
    alert('Unable to get your current location')
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

.form-control {
  background: white;
  color: #333;
}

.text-muted {
  color: #6c757d !important;
}

.modal.show {
  opacity: 1;
}
</style>