<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h2 class="h5 card-title mb-3">Фильтры</h2>
      <form aria-label="Форма фильтров поиска вакансий">
        <div class="mb-3">
          <label for="filterIndustry" class="form-label">Отрасль</label>
          <select
            id="filterIndustry"
            v-model="filters.industry"
            class="form-select"
            aria-label="Выберите отрасль"
          >
            <option value="">Все</option>
            <option value="it">IT</option>
            <option value="marketing">Маркетинг</option>
            <option value="finance">Финансы</option>
            <option value="sales">Продажи</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="filterExperience" class="form-label">Опыт</label>
          <select
            id="filterExperience"
            v-model="filters.experience"
            class="form-select"
            aria-label="Выберите требуемый опыт работы"
          >
            <option value="">Любой</option>
            <option value="junior">0–1 год</option>
            <option value="middle">1–3 года</option>
            <option value="senior">3+ года</option>
          </select>
        </div>
        <div class="mb-3">
          <label for="filterSalary" class="form-label">Зарплата от, ₽</label>
          <input
            type="number"
            id="filterSalary"
            v-model.number="filters.salary"
            class="form-control"
            min="0"
            step="1000"
            placeholder="50000"
            aria-label="Минимальная зарплата в рублях"
          >
        </div>
        <button
          type="button"
          class="btn btn-outline-secondary w-100 btn-sm"
          aria-label="Сбросить все фильтры"
          @click="resetFilters"
        >
          Сбросить
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ industry: '', experience: '', salary: 0 })
  }
})

const emit = defineEmits(['update:modelValue'])

const filters = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const resetFilters = () => {
  emit('update:modelValue', { industry: '', experience: '', salary: 0 })
}
</script>

