import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'properties',
            component: () => import('../views/PropertiesPage.vue')
        }
    ]
})

export default router