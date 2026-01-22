import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogPage.vue')
    }
  ]
})

export default router
