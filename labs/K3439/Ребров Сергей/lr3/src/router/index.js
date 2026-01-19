import { createRouter, createWebHistory } from 'vue-router'
import Search from '@/views/Search.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import Vacancy from '@/views/Vacancy.vue'
import { getToken } from '@/composables/useAuth'

const routes = [
  { path: '/', name: 'Home', component: Login },
  { path: '/search', name: 'Search', component: Search },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/vacancy/:id', name: 'Vacancy', component: Vacancy, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !getToken()) {
    return next({ name: 'Login' })
  }
  next()
})

export default router