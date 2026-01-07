import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import SearchPage from "@/views/SearchPage.vue";

const routes = [
  { path: "/", redirect: "/search" },
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  {
    path: "/profile",
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  { path: "/search", component: SearchPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem("token")) {
    next("/login");
  } else {
    next();
  }
});

export default router;
