import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/RegisterView.vue') },
  { path: '/password-recovery', name: 'PasswordRecovery', component: () => import('@/views/PasswordRecoveryView.vue') },
  { path: '/restaurants', name: 'Restaurants', component: () => import('@/views/RestaurantsView.vue') },
  { path: '/restaurants/:id', name: 'SingleRestaurant', component: () => import('@/views/SingleRestaurantView.vue'), props: true},
  { path: '/profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
  { path: '/profile/edit', name: 'ProfileEdit', component: () => import('@/views/ProfileEditView.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
