<template>
  <div>
    <Navbar />
    <main id="main-content" class="container mt-4">
      <div class="row">
        <!-- Фильтры -->
        <div class="col-md-3 mb-4">
          <PropertyFilters @apply="handleApplyFilters" @reset="handleResetFilters" />
        </div>

        <!-- Результаты поиска -->
        <div class="col-md-9">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h2">Результаты поиска</h1>
            <span class="text-muted" aria-live="polite">
              Найдено: {{ properties.length }}
            </span>
          </div>
          <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>
          <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div v-else-if="properties.length === 0" class="row">
            <div class="col-12">
              <div class="alert alert-info">Ничего не найдено</div>
            </div>
          </div>
          <div v-else class="row">
            <PropertyCard 
              v-for="property in properties" 
              :key="property.id" 
              :property="property" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import PropertyFilters from '@/components/property/PropertyFilters.vue'
import PropertyCard from '@/components/property/PropertyCard.vue'
import { useProperties } from '@/composables/useProperties'

const { apartments, loading, error, loadApartments } = useProperties()
const properties = ref([])

onMounted(async () => {
  await loadApartments()
  properties.value = apartments.value
})

const handleApplyFilters = async (filters) => {
  await loadApartments(filters)
  properties.value = apartments.value
}

const handleResetFilters = async () => {
  await loadApartments()
  properties.value = apartments.value
}
</script>
