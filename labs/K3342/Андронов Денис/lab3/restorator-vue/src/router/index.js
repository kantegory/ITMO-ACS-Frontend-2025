// настройка всех маршрутов приложения (spa)
import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Profile from '@/views/Profile.vue'
import RestaurantDetail from '@/views/RestaurantDetail.vue'

const routes = [
  { path: '/',           component: Home,              name: 'home' },
  { path: '/login',      component: Login,             name: 'login' },
  { path: '/register',   component: Register,          name: 'register' },
  { path: '/profile',    component: Profile,           name: 'profile' },
  { path: '/restaurant/:id', component: RestaurantDetail, name: 'restaurant' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router