import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/auth', name: 'auth', component: () => import('@/views/AuthView.vue') },
  { path: '/jobs', name: 'jobs', component: () => import('@/views/JobsView.vue') },
  { path: '/vacancies/:id', name: 'vacancy', component: () => import('@/views/VacancyView.vue'), props: true },
  { path: '/candidate', name: 'candidate', component: () => import('@/views/CandidateView.vue') },
  { path: '/employer', name: 'employer', component: () => import('@/views/EmployerView.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
