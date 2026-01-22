import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("../views/MainPage.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginPage.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterPage.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchPage.vue"),
    },
    {
      path: "/recipes/create",
      name: "create-recipe",
      component: () => import("../views/CreateRecipe.vue"),
    },
    {
      path: "/recipes/:recipeId",
      name: "recipe",
      component: () => import("../views/RecipePage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfilePage.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchPage.vue"),
    },
  ],
})

export default router
