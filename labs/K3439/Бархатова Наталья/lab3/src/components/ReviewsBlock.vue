<template>
  <section aria-labelledby="reviews-title" class="mt-4">
    <h2 id="reviews-title" class="section-title">Отзывы посетителей</h2>

    <div v-if="!reviews.length" class="text-muted">
      Отзывов пока нет
    </div>

    <div
      v-for="(review, index) in reviews"
      :key="index"
      class="review mb-3 p-3 rounded"
    >
      <span aria-hidden="true">
        {{ '⭐'.repeat(review.rating) }}
      </span>
      <p>
        <strong>{{ review.author }}:</strong> {{ review.text }}
      </p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  reviews: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.review {
  background-color: #f8f8f8;
  border-radius: 16px;
  padding: 20px;
}
</style>
