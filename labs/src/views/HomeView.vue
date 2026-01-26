<template>
  <AppNavbar />

  <div class="container mt-4">
    <h1>Популярные рецепты</h1>

    <div class="row">
      <!-- Тестовые карточки -->
      <RecipeCard v-for="i in 3" :key="i" :recipe="testRecipes[i-1]" />
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import RecipeCard from '@/components/RecipeCard.vue'

// проверка
const testRecipes = [
  {
    id: '1',
    title: 'Паста Карбонара',
    short: 'Классическая итальянская паста с беконом, яйцом и сыром.',
    time: 20,
    difficulty: 'Легко',
    image: '/assets/img/pasta.jpg'  // если картинки нет — будет example.jpg
  },
  {
    id: '2',
    title: 'Салат Цезарь',
    short: 'Хрустящий салат с курицей, сухариками и пармезаном.',
    time: 15,
    difficulty: 'Легко',
    image: '/assets/img/salad.jpg'
  },
  {
    id: '3',
    title: 'Банановые панкейки',
    short: 'Нежные панкейки с бананом — отличный завтрак.',
    time: 25,
    difficulty: 'Средне',
    image: '/assets/img/pancakes.jpg'
  }
]
</script>