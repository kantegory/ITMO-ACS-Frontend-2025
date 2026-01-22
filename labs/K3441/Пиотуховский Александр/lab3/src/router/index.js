import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue')
    },
    {
      path: '/recipe/:id',
      name: 'recipe-detail',
      component: () => import('@/views/RecipeDetailView.vue'),
      props: true
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: () => import('@/views/PostDetailView.vue'),
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: {guest: true}
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: {guest: true}
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.guest && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
