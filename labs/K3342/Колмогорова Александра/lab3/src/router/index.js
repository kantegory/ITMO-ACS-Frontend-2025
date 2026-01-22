import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexPage.vue')
    },
        {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainPage.vue')
    },
    {
      path: '/recipe/:id',
      name: 'recipe',
      component: () => import('@/views/RecipePage.vue'),
      props: true
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      component: () => import('@/views/RegisterPage.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/login',
      component: () => import('@/views/LoginPage.vue'),
      meta: { guestOnly: true }
    }
  ]
})

export default router
