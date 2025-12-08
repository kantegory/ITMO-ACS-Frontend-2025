<template>
  <div class="search-page">
    <div class="search-header bg-light py-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1>Search Results</h1>
            <p class="text-muted mb-0">
              {{ filteredProperties.length }} properties found
              <span v-if="searchQuery.location">in {{ searchQuery.location }}</span>
              <span v-if="searchSource" class="ms-2">
                <i v-if="searchSource === 'external'" class="fas fa-globe text-success" title="Real hotels from external API"></i>
                <i v-else-if="searchSource === 'fallback'" class="fas fa-map-marker-alt text-warning" title="Mock hotels for your location"></i>
                {{ searchSourceText }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="filters-section py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-3">
            <div class="filters-sidebar">
              <h4>Filters</h4>

              <div class="filter-group mb-4">
                <h5>Property Type</h5>
                <div class="form-check" v-for="type in propertyTypes" :key="type">
                  <input
                    v-model="filters.types"
                    :value="type"
                    type="checkbox"
                    class="form-check-input"
                    :id="`type-${type}`"
                  >
                  <label :for="`type-${type}`" class="form-check-label text-capitalize">
                    {{ type }}
                  </label>
                </div>
              </div>

              <div class="filter-group mb-4">
                <h5>Price Range</h5>
                <div class="row">
                  <div class="col-6">
                    <input
                      v-model="filters.minPrice"
                      type="number"
                      class="form-control"
                      placeholder="Min"
                      min="0"
                    >
                  </div>
                  <div class="col-6">
                    <input
                      v-model="filters.maxPrice"
                      type="number"
                      class="form-control"
                      placeholder="Max"
                      min="0"
                    >
                  </div>
                </div>
              </div>

              <div class="filter-group mb-4">
                <h5>Dates</h5>
                <div class="row g-2">
                  <div class="col-6">
                    <label for="checkIn" class="form-label">Check In</label>
                    <input
                      v-model="filters.checkIn"
                      type="date"
                      class="form-control form-control-sm"
                      id="checkIn"
                    >
                  </div>
                  <div class="col-6">
                    <label for="checkOut" class="form-label">Check Out</label>
                    <input
                      v-model="filters.checkOut"
                      type="date"
                      class="form-control form-control-sm"
                      id="checkOut"
                    >
                  </div>
                </div>
              </div>

              <div class="filter-group mb-4">
                <h5>Guests</h5>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>Adults</span>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseAdults">-</button>
                    <span>{{ filters.adults }}</span>
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseAdults">+</button>
                  </div>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Children</span>
                  <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseChildren">-</button>
                    <span>{{ filters.children }}</span>
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseChildren">+</button>
                  </div>
                </div>
              </div>

              <div class="filter-group mb-4">
                <h5>Amenities</h5>
                <div class="form-check" v-for="amenity in amenitiesList" :key="amenity">
                  <input
                    v-model="filters.amenities"
                    :value="amenity"
                    type="checkbox"
                    class="form-check-input"
                    :id="`amenity-${amenity}`"
                  >
                  <label :for="`amenity-${amenity}`" class="form-check-label text-capitalize">
                    {{ amenity === 'aircon' ? 'Air Conditioning' : amenity }}
                  </label>
                </div>
              </div>

              <div class="filter-group mb-4">
                <h5>Rating</h5>
                <div class="form-check" v-for="rating in [4.5, 4.0, 3.5, 3.0]" :key="rating">
                  <input
                    v-model="filters.minRating"
                    :value="rating"
                    type="radio"
                    class="form-check-input"
                    :id="`rating-${rating}`"
                    name="rating"
                  >
                  <label :for="`rating-${rating}`" class="form-check-label">
                    <span class="text-warning">{{ '★'.repeat(Math.floor(rating)) }}</span>{{ '☆'.repeat(5 - Math.floor(rating)) }} & up
                  </label>
                </div>
              </div>

              <button @click="filterProperties" class="btn btn-primary w-100 mb-2">
                <i class="fas fa-filter me-2"></i>Apply Filters
              </button>
              <button @click="clearFilters" class="btn btn-outline-secondary w-100">
                Clear Filters
              </button>
            </div>
          </div>

          <div class="col-md-9">
            <div class="location-search mb-4">
              <div class="d-flex gap-3">
                <div class="flex-grow-1">
                  <input
                    v-model="searchQuery.location"
                    type="text"
                    class="form-control"
                    placeholder="Search by location..."
                    @input="filterProperties"
                  >
                </div>
                <button
                  @click="searchNearby"
                  class="btn btn-outline-primary"
                  :disabled="isLoadingLocation"
                >
                  <i class="fas fa-map-marker-alt me-2"></i>
                  {{ isLoadingLocation ? 'Finding...' : 'Near me' }}
                </button>
              </div>
            </div>

            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <PropertyList v-else :properties="filteredProperties" />

            <div v-if="!isLoading && filteredProperties.length === 0" class="text-center py-5">
              <i class="fas fa-search fa-3x text-muted mb-3"></i>
              <h3>No properties found</h3>
              <p class="text-muted">Try adjusting your filters or search criteria</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApiService } from '@/composables/useApiService'
import { type Property } from '@/types'
import PropertyList from '@/components/PropertyList.vue'

const route = useRoute()
const { apiService } = useApiService()

const properties = ref<Property[]>([])
const isLoading = ref(false)
const isLoadingLocation = ref(false)
const searchSource = ref<string>('')
const searchSourceText = ref<string>('')

const searchQuery = ref({
  location: (route.query.location as string) || '',
  checkIn: (route.query.checkIn as string) || '',
  checkOut: (route.query.checkOut as string) || '',
  guests: (route.query.guests as string) || '1'
})

const filters = ref({
  types: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  minRating: null as number | null,
  amenities: [] as string[],
  adults: 1,
  children: 0,
  checkIn: '',
  checkOut: ''
})

const propertyTypes = ['apartment', 'house', 'studio', 'hotel']
const amenitiesList = ['wifi', 'parking', 'kitchen', 'aircon', 'washer']

const filteredProperties = computed(() => {
  let result = properties.value

  if (filters.value.types.length > 0) {
    result = result.filter(property =>
      filters.value.types.includes(property.type)
    )
  }

  if (filters.value.minPrice !== null && filters.value.minPrice > 0) {
    result = result.filter(property => property.price >= filters.value.minPrice!)
  }

  if (filters.value.maxPrice !== null && filters.value.maxPrice > 0) {
    result = result.filter(property => property.price <= filters.value.maxPrice!)
  }

  if (filters.value.minRating !== null && filters.value.minRating > 0) {
    result = result.filter(property => property.rating >= filters.value.minRating!)
  }

  if (filters.value.amenities.length > 0) {
    result = result.filter(property =>
      filters.value.amenities.some(amenity => property.amenities?.includes(amenity))
    )
  }

  const totalGuests = filters.value.adults + filters.value.children
  if (totalGuests > 0) {
    result = result.filter(property =>
      property.maxGuests >= totalGuests
    )
  }

  return result
})

onMounted(async () => {
  if (route.query.useLocation === 'true' && route.query.latitude && route.query.longitude) {
    isLoading.value = true

    try {
      const latitude = parseFloat(route.query.latitude as string)
      const longitude = parseFloat(route.query.longitude as string)

      const response = await apiService.searchHotelsNearLocation(latitude, longitude)
      if (response.success && response.data) {
        properties.value = response.data
        searchSource.value = response.source || 'external'

        localStorage.setItem('external_properties', JSON.stringify(response.data))

        if (response.source === 'external') {
          searchSourceText.value = '🌐 Real hotels from OpenStreetMap'
        } else if (response.source === 'fallback') {
          const cityName = route.query.city || 'your location'
          searchSourceText.value = `📍 Mock hotels for ${cityName}`
        }
      }
    } catch (error) {
      console.error('Error loading location-based hotels:', error)
    } finally {
      isLoading.value = false
    }
  } else {
    await loadProperties()
  }
})

const loadProperties = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getProperties()
    if (response.success && response.data) {
      properties.value = response.data
    }
  } catch (error) {
    console.error('Failed to load properties:', error)
  } finally {
    isLoading.value = false
  }
}

const searchNearby = async () => {
  console.log('searchNearby function called')

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  isLoadingLocation.value = true

  try {
    console.log('Requesting geolocation permission...')

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    })

    console.log('Geolocation success:', position)

    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    }

    console.log('Location received:', location)

    const hotelsResponse = await apiService.searchHotelsNearLocation(
      location.latitude,
      location.longitude
    )
    console.log('Hotels response:', hotelsResponse)

    if (hotelsResponse.success && hotelsResponse.data) {
      properties.value = hotelsResponse.data
      searchQuery.value.location = 'Near your location'
      alert(`Found ${hotelsResponse.data.length} properties near your location!`)
    } else {
      alert('No properties found near your location')
    }
  } catch (error: any) {
    console.error('Geolocation error:', error)

    let message = 'Unable to get your location. '

    if (error.code) {
      switch (error.code) {
        case 1: 
          message += 'Location access was denied. Please enable location services in your browser.'
          break
        case 2:
          message += 'Location services are currently unavailable.'
          break
        case 3:
          message += 'Location request timed out. Please try again.'
          break
        default:
          message += 'An unknown error occurred.'
      }
    } else {
      message += error.message || 'Please try again or enter location manually.'
    }

    alert(message)
  } finally {
    isLoadingLocation.value = false
  }
}

const filterProperties = async () => {
  isLoading.value = true
  try {
    const filterParams = {
      location: searchQuery.value.location,
      types: filters.value.types,
      minPrice: filters.value.minPrice,
      maxPrice: filters.value.maxPrice,
      minRating: filters.value.minRating,
      amenities: filters.value.amenities,
      adults: filters.value.adults,
      children: filters.value.children,
      checkIn: filters.value.checkIn,
      checkOut: filters.value.checkOut
    }

    const response = await apiService.getProperties(filterParams)
    if (response.success && response.data) {
      properties.value = response.data
    }
  } catch (error) {
    console.error('Failed to filter properties:', error)
  } finally {
    isLoading.value = false
  }
}

const clearFilters = () => {
  filters.value = {
    types: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    amenities: [],
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: ''
  }
  searchQuery.value.location = ''
  filterProperties()
}

const increaseAdults = () => { filters.value.adults++ }
const decreaseAdults = () => { if (filters.value.adults > 1) filters.value.adults-- }
const increaseChildren = () => { filters.value.children++ }
const decreaseChildren = () => { if (filters.value.children > 0) filters.value.children-- }

watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value.location = (newQuery.location as string) || ''
    searchQuery.value.checkIn = (newQuery.checkIn as string) || ''
    searchQuery.value.checkOut = (newQuery.checkOut as string) || ''
    searchQuery.value.guests = (newQuery.guests as string) || '1'
    filterProperties()
  }
)

watch(
  [filters, () => searchQuery.value.location],
  () => {
    filterProperties()
  },
  { deep: true }
)
</script>

<style scoped>
.search-page {
  padding-top: 80px;
}

.search-header {
  background-color: #f8f9fa !important;
  border-bottom: 1px solid #dee2e6;
}

.filters-sidebar {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.filter-group h5 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.filter-group h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.form-check-input {
  margin-top: 0.25rem;
}

.location-search {
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

@media (max-width: 768px) {
  .filters-sidebar {
    margin-bottom: 2rem;
  }
}
</style>