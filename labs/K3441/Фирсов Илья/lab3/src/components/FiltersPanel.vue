<template>
  <div class="glass-panel p-4 h-100">
    <form @submit.prevent="$emit('filter')" class="vstack gap-3">
      <div>
        <label class="form-label" for="searchQuery">Ключевые слова</label>
          <input
            type="text"
            id="searchQuery"
            class="form-control"
            placeholder="дизайн, аналитик..."
            v-model.trim="filtersStore.keyword"
            @input="filtersStore.save"
          />
      </div>
      <div>
        <label class="form-label">Отрасль</label>
        <select id="industryFilter" class="form-select" v-model="filtersStore.industry" @change="handleFilterChange">
          <option value="">Любая</option>
          <option value="it">IT</option>
          <option value="finance">Финансы</option>
          <option value="healthcare">Здравоохранение</option>
          <option value="education">Образование</option>
          <option value="manufacturing">Производство</option>
          <option value="retail">Ритейл</option>
        </select>
      </div>
      <div>
        <label class="form-label">Опыт</label>
        <select id="experienceFilter" class="form-select" v-model="filtersStore.experience" @change="handleFilterChange">
          <option value="">Любой</option>
          <option value="intern">Стажировка</option>
          <option value="junior">Junior</option>
          <option value="middle">Middle</option>
          <option value="senior">Senior</option>
        </select>
      </div>
      <div>
        <label class="form-label d-flex justify-content-between">
          <span>Минимальная зарплата</span>
          <span class="text-muted">{{ filtersStore.salary }} тыс</span>
        </label>
        <input
          type="range"
          class="form-range"
          id="salaryFilter"
          min="0"
          max="400"
          step="10"
          v-model.number="filtersStore.salary"
          @input="filtersStore.save"
        />
      </div>
      <button class="btn btn-primary" type="submit">Применить фильтры</button>
      <button class="btn btn-outline-light" type="button" @click="filtersStore.reset">Сбросить</button>
    </form>
  </div>
</template>

<script setup>
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()

const emit = defineEmits(['filter'])

const handleFilterChange = () => {
  filtersStore.save()
  emit('filter')
}
</script>
