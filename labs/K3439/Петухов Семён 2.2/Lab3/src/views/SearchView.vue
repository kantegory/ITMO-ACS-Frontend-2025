<template>
  <main class="container py-4" role="main">
    <section class="row align-items-center mb-4" aria-labelledby="searchHeading">
      <div class="col-md-8">
        <h1 id="searchHeading" class="mb-1">Найдите жильё для аренды</h1>
        <p class="text-muted mb-0">Просматривайте, фильтруйте и бронируйте актуальные объявления в один клик.</p>
      </div>
      <div class="col-md-4 text-md-end mt-3 mt-md-0">
        <RouterLink to="/messages" class="btn btn-outline-secondary me-2">Сообщения</RouterLink>
        <RouterLink to="/dashboard" class="btn btn-primary">Мои объявления</RouterLink>
      </div>
    </section>

    <section class="card card-custom mb-4" aria-label="Фильтры поиска объявлений">
      <div class="card-body">
        <form class="row g-2 align-items-center" role="search" aria-describedby="filtersHint">
          <div class="col-12 visually-hidden" id="filtersHint">Используйте поля ниже, чтобы сузить выдачу.</div>
          <div class="col-md-6">
            <label id="searchInputLabel" for="searchInput" class="form-label visually-hidden">Поиск по названию, месту или описанию</label>
            <input 
              id="searchInput" 
              v-model="filters.q"
              class="form-control" 
              placeholder="Поиск по названию, месту или описанию" 
              aria-labelledby="searchInputLabel"
            >
          </div>
          <div class="col-md-2">
            <label id="filterTypeLabel" for="filterType" class="form-label visually-hidden">Тип жилья</label>
            <select id="filterType" v-model="filters.type" class="form-select" aria-labelledby="filterTypeLabel">
              <option value="">Все типы</option>
              <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label id="filterLocationLabel" for="filterLocation" class="form-label visually-hidden">Локация</label>
            <select id="filterLocation" v-model="filters.location" class="form-select" aria-labelledby="filterLocationLabel">
              <option value="">Все локации</option>
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>
          <div class="col-md-2 text-md-end">
            <label id="filterPriceLabel" for="filterPrice" class="form-label small text-muted">
              Максимальная цена: <span id="priceLabel" aria-live="polite">₽{{ filters.price_lte || maxPrice }}</span>
            </label>
            <input 
              id="filterPrice" 
              v-model.number="filters.price_lte"
              type="range" 
              class="form-range" 
              :min="0" 
              :max="maxPrice" 
              :value="filters.price_lte || maxPrice" 
              aria-labelledby="filterPriceLabel priceLabel"
            >
          </div>
        </form>
      </div>
    </section>

    <section aria-labelledby="resultsTitle">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 id="resultsTitle" class="h5 mb-0">Результаты поиска</h2>
        <output class="text-muted small" id="resultCount" role="status" aria-live="polite" aria-label="Количество найденных объявлений">
          Найдено: {{ totalItems }}
        </output>
      </div>
      <div class="row" role="list">
        <PropertyCard
          v-for="property in properties"
          :key="property.id"
          :property="property"
          @book="handleBook"
        />
      </div>
      <nav 
        v-if="totalPages > 1"
        class="d-flex justify-content-between align-items-center mt-3" 
        aria-label="Навигация по страницам"
      >
        <button 
          class="btn btn-outline-secondary btn-sm" 
          type="button"
          :disabled="currentPage <= 1"
          @click="loadPage(currentPage - 1)"
        >
          Назад
        </button>
        <span class="text-muted small">Страница {{ currentPage }} из {{ totalPages }}</span>
        <button 
          class="btn btn-outline-secondary btn-sm" 
          type="button"
          :disabled="currentPage >= totalPages"
          @click="loadPage(currentPage + 1)"
        >
          Вперёд
        </button>
      </nav>
    </section>
  </main>

  <!-- Booking Modal -->
  <BookingModal 
    v-model="showBookingModal"
    :property="selectedProperty"
    @booked="handleBooked"
  />
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import PropertyCard from '@/components/PropertyCard.vue'
import BookingModal from '@/components/BookingModal.vue'
import { useDataService } from '@/composables/useDataService'

const { fetchAdvertisement } = useDataService()

const properties = ref([])
const types = ref([])
const locations = ref([])
const maxPrice = ref(400000)
const currentPage = ref(1)
const totalItems = ref(0)
const PAGE_SIZE = 6

const filters = reactive({
  q: '',
  type: '',
  location: '',
  price_lte: 3000
})

const showBookingModal = ref(false)
const selectedProperty = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)))

async function loadPage(page = 1) {
  const filterParams = {}
  if (filters.q) filterParams.q = filters.q
  if (filters.type) filterParams.type = filters.type
  if (filters.location) filterParams.location = filters.location
  if (filters.price_lte) filterParams.price_lte = filters.price_lte

  const result = await fetchAdvertisement({
    page,
    limit: PAGE_SIZE,
    filters: filterParams,
    withMeta: true
  })

  properties.value = result.items || []
  totalItems.value = result.total || 0
  currentPage.value = page
}

async function populateFilters() {
  const raw = await fetchAdvertisement()
  const dataset = Array.isArray(raw) ? raw : (Array.isArray(raw?.items) ? raw.items : [])
  
  types.value = Array.from(new Set(dataset.map(p => p.type).filter(Boolean))).sort()
  locations.value = Array.from(new Set(dataset.map(p => p.location).filter(Boolean))).sort()
  
  const maxPriceValue = dataset.reduce((acc, p) => Math.max(acc, Number(p.price) || 0), 0) || 5000
  maxPrice.value = Math.max(maxPriceValue, 1000)
  if (!filters.price_lte || filters.price_lte > maxPrice.value) {
    filters.price_lte = Math.min(3000, maxPrice.value)
  }
}

function handleBook(property) {
  selectedProperty.value = property
  showBookingModal.value = true
}

function handleBooked() {
  showBookingModal.value = false
  // Optionally reload data
}

watch(filters, () => {
  loadPage(1)
}, { deep: true })

onMounted(async () => {
  await populateFilters()
  await loadPage(1)
})
</script>


