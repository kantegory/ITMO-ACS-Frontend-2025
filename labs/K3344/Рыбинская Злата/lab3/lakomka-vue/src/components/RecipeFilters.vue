<script setup>
defineProps({
  search: String,
  type: String,
  difficulty: String
})

const emit = defineEmits(['submit', 'reset'])
</script>

<template>
  <section class="container filter-section my-4">
    <form class="row g-3" @submit.prevent="emit('submit')">

      <div class="col-md-4">
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          class="form-control"
          placeholder="Введите название рецепта..."
        />
      </div>

      <div class="col-md-3">
        <select
          :value="type"
          @change="$emit('update:type', $event.target.value)"
          class="form-select"
        >
          <option value="">Все типы</option>
          <option value="Выпечка">Выпечка</option>
          <option value="Торт">Торт</option>
          <option value="Пироженное">Пироженное</option>
        </select>
      </div>

      <div class="col-md-3">
        <select
          :value="difficulty"
          @change="$emit('update:difficulty', $event.target.value)"
          class="form-select"
        >
          <option value="">Все уровни</option>
          <option value="Легко">Легко</option>
          <option value="Средне">Средне</option>
          <option value="Сложно">Сложно</option>
        </select>
      </div>

      <div class="col-md-2 d-flex gap-2">
        <button type="submit" class="btn btn-primary w-100">
          Поиск
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="emit('reset')"
        >
          Сброс
        </button>
      </div>

    </form>
  </section>
</template>
