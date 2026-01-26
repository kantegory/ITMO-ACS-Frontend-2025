import { createRouter, createWebHistory } from 'vue-router'

// импорт views
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import ProfileView from '../views/ProfileView.vue'
import RecipeView from '../views/RecipeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/recipe/:id', name: 'recipe', component: RecipeView },
  ]
})

export default router