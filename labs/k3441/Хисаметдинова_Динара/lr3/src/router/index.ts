import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Search from '@/views/SearchView.vue'
import Property from '@/views/PropertyView.vue'
import Profile from '@/views/ProfileView.vue'
import Messages from '@/views/MessagesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/property/:id',
      name: 'property',
      component: Property,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to) => {
  const isAuthenticated = localStorage.getItem('authToken')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
})

export default router