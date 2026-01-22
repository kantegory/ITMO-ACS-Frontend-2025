<template>
  <div class="card h-100 menu-item-card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0">{{ item.name }}</h5>
        <span class="badge bg-success">{{ item.price }}</span>
      </div>
      <p class="card-text text-muted small mb-0">{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.menu-item-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
}

.card-text {
  line-height: 1.5;
}
</style>