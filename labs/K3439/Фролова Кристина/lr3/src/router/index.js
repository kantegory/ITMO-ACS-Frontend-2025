import {createRouter, createWebHistory} from "vue-router";
import AdvertisementPage from "@/views/AdvertisementPage.vue";
import AdvertisementsPage from "@/views/AdvertisementsPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/", name: "home", component: AdvertisementsPage
    },
    {
      path: "/advertisements/:id", name: "advertisement", component: AdvertisementPage, props: true
    },
    {
      path: "/login",
      component: () => import("@/views/LoginPage.vue"),
    },
    {
      path: "/register",
      component: () => import("@/views/RegisterPage.vue"),
    },
    {
      path: "/profile",
      component: () => import("@/views/ProfilePage.vue"),
    }

  ],
  scrollBehavior() {
    return {top: 0};
  },
});

export default router;
