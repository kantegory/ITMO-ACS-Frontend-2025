<template>
  <BaseLayout>
    <div class="mb-3"><router-link to="/" class="btn btn-back light-blue-text">← Back to Home</router-link></div>
    <h1 class="form-title">Fitness Blog</h1>
    <article class="card glass-card mb-4">
      <div class="card-body">
        <h2 class="card-title light-blue-text">10 Tips for Better Workouts</h2>
        <p>Maximizing your exercise routine requires more than just showing up.</p>
        <h4 class="light-blue-text mt-4">1. Proper Warm-Up</h4>
        <p>Always start with 5-10 minutes of dynamic stretching.</p>
        <h4 class="light-blue-text">2. Stay Hydrated</h4>
        <p>Drink water before, during, and after your workout.</p>
      </div>
    </article>
    <article class="card glass-card">
      <div class="card-body">
        <h2 class="card-title light-blue-text">Nutrition for Athletes</h2>
        <p>Proper nutrition is essential for optimal performance.</p>
        <h4 class="light-blue-text mt-4">Macronutrient Balance</h4>
        <p>Athletes need carbs, proteins, and healthy fats.</p>
      </div>
    </article>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
export default { name: 'BlogPage', components: { BaseLayout } }
</script>
