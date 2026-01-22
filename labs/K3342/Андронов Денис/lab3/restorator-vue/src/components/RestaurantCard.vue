<template>
  <div class="col-md-4 mb-4">
    <div class="card h-100">
      <img :src="restaurant.image" class="card-img-top" :alt="restaurant.name">

      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ restaurant.name }}</h5>

        <p class="card-text">
          {{ restaurant.type }} • {{ restaurant.price }} • {{ restaurant.location }} район
        </p>

        <div class="mt-auto">
          <router-link
            :to="{ name: 'restaurant', params: { id: restaurant.id } }"
            class="btn btn-primary"
          >
            Подробнее
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// карточка одного ресторана в списке поиска
defineProps({
  restaurant: Object
})
</script>