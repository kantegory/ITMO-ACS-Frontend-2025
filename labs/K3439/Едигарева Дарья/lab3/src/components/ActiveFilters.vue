<template>
  <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
    <span v-if="!items.length" class="text-muted small">Фильтры не выбраны</span>
    <span v-for="item in items" :key="item" class="pill pill--muted">{{ item }}</span>
  </div>
</template>

<script>
export default {
  name: 'ActiveFilters',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
}
</script>
