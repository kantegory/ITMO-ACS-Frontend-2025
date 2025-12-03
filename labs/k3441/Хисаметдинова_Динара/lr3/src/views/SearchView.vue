<template>
  <div class="search-page">
    <!-- Search Header -->
    <div class="search-header bg-light py-4">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1>Search Results</h1>
            <p class="text-muted mb-0">
              {{ filteredProperties.length }} properties found
              <span v-if="searchQuery.location">in {{ searchQuery.location }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Filters -->
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
                    {{ rating }}+ stars
                  </label>
                </div>
              </div>

              <button @click="clearFilters" class="btn btn-outline-secondary w-100">
                Clear Filters
              </button>
            </div>
          </div>

          <div class="col-md-9">
            <!-- Location Search -->
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

            <!-- Properties Grid -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <PropertyList v-else :properties="filteredProperties" />

            <!-- No Results -->
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
import PropertyList from '@/components/PropertyList.vue'

const route = useRoute()
const { apiService } = useApiService()

const properties = ref([])
const isLoading = ref(false)
const isLoadingLocation = ref(false)

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
  minRating: null as number | null
})

const propertyTypes = ['apartment', 'house', 'studio', 'hotel']

const filteredProperties = computed(() => {
  let filtered = [...properties.value]

  // Apply type filter
  if (filters.value.types.length > 0) {
    filtered = filtered.filter((property: any) =>
      filters.value.types.includes(property.type)
    )
  }

  // Apply price filter
  if (filters.value.minPrice !== null) {
    filtered = filtered.filter((property: any) => property.price >= filters.value.minPrice!)
  }
  if (filters.value.maxPrice !== null) {
    filtered = filtered.filter((property: any) => property.price <= filters.value.maxPrice!)
  }

  // Apply rating filter
  if (filters.value.minRating !== null) {
    filtered = filtered.filter((property: any) => property.rating >= filters.value.minRating!)
  }

  // Apply location filter
  if (searchQuery.value.location) {
    filtered = filtered.filter((property: any) =>
      property.location.toLowerCase().includes(searchQuery.value.location.toLowerCase())
    )
  }

  return filtered
})

onMounted(async () => {
  await loadProperties()
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
  isLoadingLocation.value = true
  try {
    const location = await apiService.getUserLocation()
    const hotelsResponse = await apiService.searchHotelsNearLocation(
      location.latitude,
      location.longitude
    )

    if (hotelsResponse.success && hotelsResponse.data) {
      properties.value = [...properties.value, ...hotelsResponse.data]
      searchQuery.value.location = 'Near your location'
    }
  } catch (error) {
    console.error('Failed to search nearby:', error)
    alert('Unable to get your location or search nearby properties')
  } finally {
    isLoadingLocation.value = false
  }
}

const filterProperties = () => {
  // Properties are filtered via computed property
}

const clearFilters = () => {
  filters.value = {
    types: [],
    minPrice: null,
    maxPrice: null,
    minRating: null
  }
  searchQuery.value.location = ''
}

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value.location = (newQuery.location as string) || ''
    searchQuery.value.checkIn = (newQuery.checkIn as string) || ''
    searchQuery.value.checkOut = (newQuery.checkOut as string) || ''
    searchQuery.value.guests = (newQuery.guests as string) || '1'
  }
)
</script>

<style scoped>
.search-page {
  padding-top: 80px; /* Account for fixed navbar */
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