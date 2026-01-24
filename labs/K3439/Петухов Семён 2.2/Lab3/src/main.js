import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'

import SearchView from './views/SearchView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import DashboardView from './views/DashboardView.vue'
import ProfileView from './views/ProfileView.vue'
import PropertyView from './views/PropertyView.vue'
import MessagesView from './views/MessagesView.vue'

import { useAuth } from './composables/useAuth'

const routes = [
  { path: '/', name: 'search', component: SearchView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/property/:id', name: 'property', component: PropertyView },
  { path: '/messages', name: 'messages', component: MessagesView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { getCurrentUser } = useAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !getCurrentUser()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

window.bootstrap = bootstrap

const app = createApp(App)
app.use(router)
app.mount('#app')
