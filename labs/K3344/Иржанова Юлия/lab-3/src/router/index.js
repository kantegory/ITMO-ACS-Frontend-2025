import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/authStorage";

import HomeView from "../views/HomeView.vue";
import CatalogView from "../views/CatalogView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ProfileView from "../views/ProfileView.vue";
import AlbumDetailsView from "../views/AlbumDetailsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/catalog", name: "catalog", component: CatalogView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },
    { path: "/profile", name: "profile", component: ProfileView },
    { path: "/albums/:id", name: "album", component: AlbumDetailsView },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    return { path: "/catalog" };
  }
});

export default router;
