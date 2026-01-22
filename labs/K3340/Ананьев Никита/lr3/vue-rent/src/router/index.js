import { createRouter, createWebHistory } from 'vue-router'
import instance from '@/api/instance'
import { PropertiesApi } from '@/api/properties'

export const propertiesApi = new PropertiesApi(instance)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/Main.vue')
    }
      
  ],
})

export default router
