import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'rentals',
    component: () => import('@/views/RentalsPage.vue')
  }
]


export default createRouter({
  history: createWebHistory(),
  routes
})
