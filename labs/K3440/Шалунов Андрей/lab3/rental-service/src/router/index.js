import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", redirect: "/search" },

        { path: "/signin", name: "signin", component: () => import("@/views/SignInPage.vue") },
        { path: "/register", name: "register", component: () => import("@/views/RegisterPage.vue") },

        { path: "/search", name: "search", component: () => import("@/views/SearchPage.vue"), meta: { requiresAuth: true } },
        { path: "/my-properties", name: "my-properties", component: () => import("@/views/MyPropertiesPage.vue"), meta: { requiresAuth: true } },

        { path: "/profile", name: "profile", component: () => import("@/views/ProfilePage.vue"), meta: { requiresAuth: true } },
        { path: "/profile/edit", name: "profile-edit", component: () => import("@/views/ProfileEditPage.vue"), meta: { requiresAuth: true } },

        { path: "/property/:id", name: "property-details", component: () => import("@/views/PropertyDetailsPage.vue"), meta: { requiresAuth: true } },

        { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundPage.vue") }
    ]
});

router.beforeEach(async (to) => {
    const auth = useAuthStore();

    if (to.meta?.requiresAuth && !auth.isAuthed) {
        return { path: "/signin" };
    }

    if ((to.path === "/signin" || to.path === "/register") && auth.isAuthed) {
        return { path: "/search" };
    }

    if (auth.isAuthed && !auth.user) {
        await auth.fetchMe();
    }

    return true;
});

export default router;