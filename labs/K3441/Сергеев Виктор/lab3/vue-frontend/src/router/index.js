import { createRouter, createWebHistory } from 'vue-router'
import { TOKEN_KEY } from '@/composables/useApi'

function isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
}

const routes = [
  {
    path: "/",
    name: "Index Page",
    component: () => import("@/views/IndexView.vue"),
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { requiresGuest: true }
  },
  {
    path: "/profile",
    name: "User Profile",
    component: () => import("@/views/ProfileView.vue"),
    props: (route) => ({ query: route.query }),
  },
  {
    path: "/recipe/:id",
    name: "Recipe Card",
    component: () => import("@/views/RecipeCardView.vue"),
    props: true,
  },
  {
    path: "/edit-recipe/:id",
    name: "Edit Recipe",
    component: () => import("@/views/RecipeFormView.vue"),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/create-recipe',
    name: 'Create New Recipe',
    component: () => import('@/views/RecipeFormView.vue'),
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

router.beforeEach((to, from, next) => {
    const authenticated = isAuthenticated();

    if (to.meta.requiresAuth && !authenticated) {
        next({ name: 'Login', query: { redirect: to.fullPath } });
        return;
    }

    if (to.meta.requiresGuest && authenticated) {
        next({ name: 'Search' });
        return;
    }

    next();
});

export default router
