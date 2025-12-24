import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {createPinia} from "pinia";
import {useAuthStore} from "@/stores/auth.js";
import {isTokenExpired} from "@/utils/jwt.js";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const auth = useAuthStore();

if (auth.accessToken && isTokenExpired(auth.accessToken)) {
  auth.logout();
}

app.use(router);
app.mount("#app");
