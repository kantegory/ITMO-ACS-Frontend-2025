<template>
  <div>
    <div class="jumbotron bg-primary text-white p-5 rounded mb-4">
      <h1 class="display-4">Добро пожаловать!</h1>
      <p class="lead">Откройте для себя тысячи кулинарных рецептов от профессионалов и любителей</p>
      <hr class="my-4">
      <router-link class="btn btn-warning btn-lg" to="/recipes">Исследовать рецепты</router-link>
    </div>
    
    <div class="row">
      <div class="col-md-4 mb-4">
        <RecipeCard :recipe="sampleRecipe1" />
      </div>
      <div class="col-md-4 mb-4">
        <RecipeCard :recipe="sampleRecipe2" />
      </div>
      <div class="col-md-4 mb-4">
        <RecipeCard :recipe="sampleRecipe3" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from '../components/RecipeCard.vue'

export default {
  name: 'HomeView',
  components: {
    RecipeCard
  },
  setup() {
    const sampleRecipe1 = {
      id: 1,
      title: 'Паста Карбонара',
      description: 'Классическое итальянское блюдо с беконом и яйцами',
      difficulty: 'Средняя'
    }
    
    const sampleRecipe2 = {
      id: 2,
      title: 'Тирамису',
      description: 'Итальянский десерт с кофе и маскарпоне',
      difficulty: 'Средняя'
    }
    
    const sampleRecipe3 = {
      id: 3,
      title: 'Гаспачо',
      description: 'Холодный испанский суп из свежих овощей',
      difficulty: 'Легкая'
    }
    
    return {
      sampleRecipe1,
      sampleRecipe2,
      sampleRecipe3
    }
  }
}
</script>