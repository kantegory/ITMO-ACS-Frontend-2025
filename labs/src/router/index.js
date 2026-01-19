import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import SearchPage from '@/pages/SearchPage.vue'
import RecipePage from '@/pages/RecipePage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(), // SPA //
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage
    },
    {
      path: '/recipe/:id', // id - параметр, понадобится для страницы рецепта //
      name: 'recipe',
      component: RecipePage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    }
  ]
})

export default router
