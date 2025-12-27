import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "restaurant-list",
      component: () => import("../pages/RestaurantListPage.vue"),
    },
    {
      path: "/sign-in",
      name: "sign-in",
      component: () => import("../pages/SIgnInPage.vue"),
    },
  ],
});

export default router;
