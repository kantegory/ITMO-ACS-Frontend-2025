import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WorkoutsView from '../views/WorkoutsView.vue';
import WorkoutDetailView from '../views/WorkoutDetailView.vue';
import BlogView from '../views/BlogView.vue';
import BlogPostView from '../views/BlogPostView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/workouts',
        name: 'workouts',
        component: WorkoutsView
    },
    {
        path: '/workouts/:id',
        name: 'workout-detail',
        component: WorkoutDetailView
    },
    {
        path: '/blog',
        name: 'blog',
        component: BlogView
    },
    {
        path: '/blog/:id',
        name: 'blog-post',
        component: BlogPostView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
