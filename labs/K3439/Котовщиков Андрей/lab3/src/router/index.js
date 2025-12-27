import useAuthStore from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "restaurant-list",
      component: () => import("../pages/RestaurantListPage.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/restaurant/:id",
      name: "restaurant",
      component: () => import("../pages/RestaurantPage.vue"),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("../pages/SignInPage.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("../pages/SignUpPage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../pages/ProfilePage.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "sign-in" });
  }

  next();
});

export default router;
