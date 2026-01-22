import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import WorkoutsView from '@/views/WorkoutsView.vue'
import WorkoutView from '@/views/WorkoutView.vue'
import BlogView from '@/views/BlogView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/workouts', component: WorkoutsView },
    {
      path: '/workouts/:id',
      component: WorkoutView,
      props: true
    },
    { path: '/blog', component: BlogView },
    { path: '/profile', component: ProfileView }
  ]
})

export default router