import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import RestaurantView from '../views/RestaurantView.vue'
import BookingsView from '../views/BookingsView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'restaurant/:id', name: 'restaurant', component: RestaurantView, props: true },
        { path: 'bookings', name: 'bookings', component: BookingsView },
      ],
    },
  ],
})
