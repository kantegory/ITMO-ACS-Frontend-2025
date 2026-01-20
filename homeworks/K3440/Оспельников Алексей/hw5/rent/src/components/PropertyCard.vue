<template>
  <div class="card h-100 shadow-sm">
    <img :src="img" class="card-img-top" :alt="name" style="height: 200px; object-fit: cover;">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text text-muted small">{{ address }}</p>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <span class="badge bg-success">₽ {{ price }} / мес</span>
        <span class="text-muted small">⭐ {{ rating }}</span>
      </div>
      <a :href="link" class="btn btn-outline-primary mt-auto">Подробнее</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['name', 'address', 'price', 'rating', 'img', 'link']
};
</script>
