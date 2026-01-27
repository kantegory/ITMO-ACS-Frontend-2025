import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: () => import('@/views/JobDetail.vue')
  },
  {
    path: '/dashboard/user',
    name: 'UserDashboard',
    component: () => import('@/views/UserDashboard.vue'),
    meta: { requiresAuth: true, requiresRole: 'candidate' }
  },
  {
    path: '/dashboard/employer',
    name: 'EmployerDashboard',
    component: () => import('@/views/EmployerDashboard.vue'),
    meta: { requiresAuth: true, requiresRole: 'employer' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, isCandidate, isEmployer } = useAuth()

  // Если маршрут требует авторизации
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Если маршрут требует роль соискателя
  if (to.meta.requiresRole === 'candidate' && !isCandidate.value) {
    next({ name: 'Home' })
    return
  }

  // Если маршрут требует роль работодателя
  if (to.meta.requiresRole === 'employer' && !isEmployer.value) {
    next({ name: 'Home' })
    return
  }

  // Если пользователь авторизован и пытается зайти на страницы для гостей
  if (to.meta.requiresGuest && isAuthenticated.value) {
    if (isCandidate.value) {
      next({ name: 'UserDashboard' })
    } else if (isEmployer.value) {
      next({ name: 'EmployerDashboard' })
    } else {
      next({ name: 'Home' })
    }
    return
  }

  next()
})

export default router

