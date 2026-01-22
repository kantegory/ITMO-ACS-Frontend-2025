import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharacterPage.vue')
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('../views/SkillsPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfilePage.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
  ]
})

export default router