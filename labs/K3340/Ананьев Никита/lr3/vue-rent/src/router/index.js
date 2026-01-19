import { createRouter, createWebHistory } from 'vue-router'
import instance from '@/api/instance'
import { PropertiesApi } from '@/api/properties'
import { UserApi } from '@/api/users'

export const propertiesApi = new PropertiesApi(instance)
export const userApi = new UserApi(instance)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/Main.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/property/:propertyId',
      name: 'property',
      component: () => import('../views/Property.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue')
    },
  ],
})

export default router
