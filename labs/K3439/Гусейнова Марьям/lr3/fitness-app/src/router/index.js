import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegistrationPage from '../views/RegistrationPage.vue'
import DashboardPage from '../views/DashboardPage.vue'
import SearchPage from '../views/SearchPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegistrationPage },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage },
  { path: '/search', name: 'search', component: SearchPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router