<template>
  <div class="home">
    <section class="hero">
      <div class="container text-center">
        <h1><i class="bi bi-shop"></i> Добро пожаловать в РестоБронь</h1>
        <p class="lead">Бронируйте столики в лучших ресторанах вашего города</p>
        <router-link to="/restaurants" class="btn btn-primary btn-lg mt-3">
          Посмотреть рестораны <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>
    </section>

    <section class="popular-restaurants py-5">
      <div class="container">
        <h2 class="text-center mb-5">Популярные рестораны</h2>
        
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
        </div>

        <div v-else class="row g-4">
          <div v-for="restaurant in topRestaurants" :key="restaurant.id" class="col-md-4">
            <div class="card h-100 restaurant-card">
              <img :src="restaurant.image" class="card-img-top" :alt="restaurant.name">
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="text-muted">
                  <i class="bi bi-egg-fried"></i> {{ restaurant.cuisine }} • {{ restaurant.price }}
                </p>
                <p class="card-text">{{ restaurant.description }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-warning">
                    <i class="bi bi-star-fill"></i> {{ restaurant.rating }}
                  </span>
                  <router-link :to="`/restaurants/${restaurant.id}`" class="btn btn-primary btn-sm">
                    Подробнее
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-5">
          <router-link to="/restaurants" class="btn btn-outline-primary btn-lg">
            Посмотреть все рестораны <i class="bi bi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { restaurantService } from '../services/restaurantService'

const topRestaurants = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await restaurantService.getAll()
    topRestaurants.value = response.data
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3)
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.hero .lead {
  font-size: 1.25rem;
  opacity: 0.95;
}

.restaurant-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }
}
</style>
