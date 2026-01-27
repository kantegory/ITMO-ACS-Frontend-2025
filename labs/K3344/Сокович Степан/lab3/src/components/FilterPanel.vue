<template>
  <aside class="col-lg-3">
    <div class="card p-3 filter-panel">
      <h5>
        <svg class="icon icon-filter" aria-hidden="true"><use href="#icon-filter"></use></svg>
        Фильтры
      </h5>
      <form @submit.prevent="applyFilters">
        <div class="mb-2">
          <label for="typeFilter" class="form-label">Тип недвижимости</label>
          <select id="typeFilter" v-model="filters.type" class="form-select">
            <option value="any">Любой</option>
            <option value="apartment">Квартира</option>
            <option value="house">Дом</option>
            <option value="studio">Студия</option>
          </select>
        </div>
        <div class="mb-2">
          <label for="priceFilter" class="form-label">Макс. цена, ₽</label>
          <input 
            id="priceFilter" 
            v-model.number="filters.maxPrice" 
            type="number" 
            class="form-control" 
            placeholder="Например 50000"
            min="0"
          >
        </div>
        <div class="mb-2">
          <label for="locationFilter" class="form-label">Район</label>
          <input 
            id="locationFilter" 
            v-model="filters.location" 
            class="form-control" 
            placeholder="Поиск по городу/району"
          >
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-2">
          <svg class="icon" aria-hidden="true"><use href="#icon-filter"></use></svg>
          Применить
        </button>
        <button type="button" @click="clearFilters" class="btn btn-outline-secondary w-100 mt-2">
          Сбросить
        </button>
      </form>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['filter'])

const filters = ref({
  type: 'any',
  maxPrice: null,
  location: ''
})

const applyFilters = () => {
  emit('filter', { ...filters.value })
}

const clearFilters = () => {
  filters.value = {
    type: 'any',
    maxPrice: null,
    location: ''
  }
  emit('filter', { ...filters.value })
}
</script>

<style scoped>
.filter-panel {
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  position: sticky;
  top: 20px;
}

.icon {
  width: 1.2em;
  height: 1.2em;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.3em;
}

.icon-filter {
  vertical-align: text-bottom;
}
</style>

