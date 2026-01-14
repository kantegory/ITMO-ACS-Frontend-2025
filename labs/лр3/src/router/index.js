import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: () => import('@/views/WorkoutsPage.vue')
    },
    {
      path: '/workouts/:id',
      name: 'workout-details',
      component: () => import('@/views/WorkoutDetailsPage.vue'),
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue')
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogPage.vue')
    }
  ]
})

export default router
