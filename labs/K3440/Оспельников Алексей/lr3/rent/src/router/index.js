import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';
import Register from '../views/RegisterView.vue';
import Profile from '../views/ProfileView.vue';
import PropertyDetail from "../views/PropertyDetail.vue";

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: "/property/:id", component: PropertyDetail }
];


export default createRouter({
  history: createWebHistory(),
  routes
});
