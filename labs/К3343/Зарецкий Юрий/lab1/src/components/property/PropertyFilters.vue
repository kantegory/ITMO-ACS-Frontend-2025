<template>
  <div class="card">
    <div class="card-header d-flex align-items-center gap-2">
      <Icon name="filter" size="md" />
      <h2 class="h5 mb-0">Фильтры</h2>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label for="searchInput" class="form-label">Поиск</label>
        <input 
          type="text" 
          class="form-control" 
          id="searchInput" 
          v-model="filters.search"
          placeholder="Название, адрес..."
        >
      </div>
      <div class="mb-3">
        <label for="propertyType" class="form-label">Тип недвижимости</label>
        <select class="form-select" id="propertyType" v-model="filters.type">
          <option value="">Все типы</option>
          <option value="apartment">Квартира</option>
          <option value="house">Дом</option>
          <option value="office">Офис</option>
          <option value="studio">Студия</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="location" class="form-label">Город</label>
        <input 
          type="text" 
          class="form-control" 
          id="location" 
          v-model="filters.location"
          placeholder="Москва, СПб..."
        >
      </div>
      <div class="mb-3">
        <label for="minPrice" class="form-label">Цена от (₽/мес)</label>
        <input 
          type="number" 
          class="form-control" 
          id="minPrice" 
          v-model.number="filters.minPrice"
          placeholder="0"
        >
      </div>
      <div class="mb-3">
        <label for="maxPrice" class="form-label">Цена до (₽/мес)</label>
        <input 
          type="number" 
          class="form-control" 
          id="maxPrice" 
          v-model.number="filters.maxPrice"
          placeholder="100000"
        >
      </div>
      <div class="mb-3">
        <label for="rooms" class="form-label">Количество комнат</label>
        <select class="form-select" id="rooms" v-model="filters.rooms">
          <option value="">Любое</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4+">4+</option>
        </select>
      </div>
      <button 
        class="btn btn-primary w-100" 
        @click="applyFilters"
        aria-label="Применить выбранные фильтры поиска"
      >
        Применить фильтры
      </button>
      <button 
        class="btn btn-outline-secondary w-100 mt-2" 
        @click="resetFilters"
        aria-label="Сбросить все фильтры поиска"
      >
        Сбросить
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Icon from '@/components/common/Icon.vue'

const emit = defineEmits(['apply', 'reset'])

const filters = reactive({
  search: '',
  type: '',
  location: '',
  minPrice: null,
  maxPrice: null,
  rooms: ''
})

const applyFilters = () => {
  // Очищаем пустые значения
  const cleanFilters = {}
  Object.keys(filters).forEach(key => {
    if (filters[key] !== '' && filters[key] !== null) {
      cleanFilters[key] = filters[key]
    }
  })
  emit('apply', cleanFilters)
}

const resetFilters = () => {
  filters.search = ''
  filters.type = ''
  filters.location = ''
  filters.minPrice = null
  filters.maxPrice = null
  filters.rooms = ''
  emit('reset')
}
</script>
