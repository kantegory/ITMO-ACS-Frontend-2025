<template>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <a class="nav-link"
        @click="showAll">
        Все рецепты
      </a>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">{{ selectedType || 'Тип блюда' }}</a>
      <ul class="dropdown-menu">
        <li v-for="type in types" :key="type">
          <a class="dropdown-item" @click="showType(type)">{{ type }}</a>
        </li>
      </ul>
    </li>

    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">{{ selectedDif || 'Сложность' }}</a>
      <ul class="dropdown-menu">
        <li v-for="(name, key) in difficulties" :key="key">
          <a class="dropdown-item" @click="showDif(key)">{{ name }}</a>
        </li>
      </ul>
    </li>

    <li class="nav-item ms-auto">
      <form class="d-flex" @submit.prevent="searchR()">
        <input v-model="search" class="form-control me-2" placeholder="Поиск..."/>
        <button class="btn btn-outline-success">Найти</button>
      </form>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'RecipesFilters',
  emits: ['all', 'type', 'difficulty', 'search'],

  data() {
    return {
      search: '',
      selectedType: null,
      selectedDif: null,

      types: ['Завтрак', 'Суп', 'Основное блюдо', 'Салат', 'Десерт', 'Напиток'],
      difficulties: {
        '★': 'Низкая',
        '★★': 'Средняя',
        '★★★': 'Высокая'
      }
    }
  },

  methods: {
    showAll() {
      this.selectedType = null
      this.selectedDifficulty = null
      this.$emit('all')
    },

    showType(type) {
      this.selectedType = type
      this.$emit('type', type)
    },

    showDif(diff) {
      this.selectedDif = this.difficulties[diff]
      this.$emit('difficulty', diff)
    },
    searchR() {
      const q = this.search.trim()
      if (!q) return
      this.$emit('search', q)
    }
  }
}
</script>
