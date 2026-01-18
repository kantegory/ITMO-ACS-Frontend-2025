import { createRouter, createWebHistory } from "vue-router"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: () => import("@/views/LoginPage.vue") },
    { path: "/register", name: "register", component: () => import("@/views/RegisterPage.vue") },

    { path: "/", name: "home", component: () => import("@/views/HomePage.vue"), meta: { requiresAuth: true } },
    { path: "/profile", name: "profile", component: () => import("@/views/ProfilePage.vue"), meta: { requiresAuth: true } },
    { path: "/recipe/:id", name: "recipe", component: () => import("@/views/RecipePage.vue"), meta: { requiresAuth: true } },

    { path: "/:pathMatch(.*)*", redirect: "/" }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthed) return { name: "login" }
  if ((to.name === "login" || to.name === "register") && auth.isAuthed) return { name: "home" }
  return true
})

export default router
