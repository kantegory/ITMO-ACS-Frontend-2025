<script setup>
  defineProps({ item: { type: Object, required: true } })
</script>

<template>
  <router-link class="card link" :to="`/restaurant/${item.id}`">
  <div class="card-body">
    <h3>{{ item.name }}</h3>
    <div class="muted">{{ item.city }} • {{ item.address }}</div>
    <div class="row">
      <div>Кухня: {{ item.cuisine }}</div>
      <div>Цена: {{ item.price }}</div>
      <div>Рейтинг: {{ item.rating }}</div>
    </div>
  </div>
</router-link>
</template>

<style scoped>
  .link { color: inherit; text-decoration: none; display: block; }
  .row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
  .muted { opacity: 0.75; margin-top: 6px; }
</style>
