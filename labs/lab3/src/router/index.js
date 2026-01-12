import { createRouter, createWebHistory } from 'vue-router';
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Home from "@/views/Home.vue";
import Profile from "@/views/Profile.vue";
import AddProperty from "@/views/AddProperty.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/add-property',
            name: 'add property',
            component: AddProperty
        }
    ]
});