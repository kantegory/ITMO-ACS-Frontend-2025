<template>
  <div class="filter card shadow-sm">
    <div class="card-body">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center gap-2">
          <svg class="icon" aria-hidden="true" focusable="false">
            <use href="/sprite.svg#icon-filter"></use>
          </svg>
          <h5 class="card-title mb-0">Фильтры</h5>
        </div>
        <button class="btn btn-link btn-sm p-0 filter__reset" type="button" @click="$emit('reset')">
          Сбросить
        </button>
      </div>
      <form class="filter__form" @input="$emit('change')" @change="$emit('change')">
        <div class="mb-3">
          <label class="form-label" for="industrySelect">Отрасль</label>
          <select id="industrySelect" class="form-select" v-model="filters.industry">
            <option value="">Любая</option>
            <option v-for="industry in industries" :key="industry.value" :value="industry.value">
              {{ industry.label }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label" for="salaryInput">Минимальная зарплата, ₽</label>
          <input
            id="salaryInput"
            type="number"
            class="form-control"
            placeholder="от 80000"
            v-model.number="filters.salary"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="experienceSelect">Опыт</label>
          <select id="experienceSelect" class="form-select" v-model="filters.experience">
            <option value="">Любой</option>
            <option value="no">Нет опыта</option>
            <option value="1-3">1–3 года</option>
            <option value="3-6">3–6 лет</option>
            <option value="6+">6+ лет</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label" for="formatSelect">Формат</label>
          <select id="formatSelect" class="form-select" v-model="filters.format">
            <option value="">Любой</option>
            <option value="office">Офис</option>
            <option value="hybrid">Гибрид</option>
            <option value="remote">Удалённо</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label" for="keywordInput">Поиск по тексту</label>
          <input
            id="keywordInput"
            type="text"
            class="form-control"
            placeholder="компания или стек"
            v-model.trim="filters.keyword"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FiltersPanel',
  props: {
    filters: {
      type: Object,
      required: true,
    },
    industries: {
      type: Array,
      required: true,
    },
  },
  emits: ['reset', 'change'],
}
</script>
