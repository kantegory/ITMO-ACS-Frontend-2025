import {createRouter, createWebHistory} from 'vue-router'


const Home = () => import('./views/HomeView.vue')
const Search = () => import('./views/SearchView.vue')
const Login = () => import('./views/LoginView.vue')
const Register = () => import('./views/RegisterView.vue')
const Dashboard = () => import('./views/DashboardView.vue')


const routes = [
    {path: '/', component: Home},
    {path: '/search', component: Search},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/dashboard', component: Dashboard, meta: {requiresAuth: true}},
]


export const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) return {path: '/login'}
})