import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/HomeView.vue"),
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
        },
        {
            path: "/register",
            name: "register",
            component: () => import("../views/RegisterView.vue"),
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import("../views/DashboardView.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/workout/:id",
            name: "workout",
            component: () => import("../views/WorkoutView.vue"),
        },
        {
            path: "/blog",
            name: "blog",
            component: () => import("../views/BlogView.vue"),
        },
        {
            path: "/blog/:id",
            name: "blogpost",
            component: () => import("../views/BlogPostView.vue"),
        },
        {
            path: "/create-blog",
            name: "createblog",
            component: () => import("../views/CreateBlogPostView.vue"),
        },
    ],
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    if (to.meta.requiresAuth && !authStore.user) {
        next('/login')
    } else {
        next()
    }
})

export default router;
