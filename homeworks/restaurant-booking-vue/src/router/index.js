import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RestaurantView from '../views/RestaurantView.vue'
import AccountView from '../views/AccountView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/restaurant/:id', component: RestaurantView },
  { path: '/account', component: AccountView },
  { path: '/history', component: HistoryView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
