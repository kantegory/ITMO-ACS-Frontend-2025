import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import pinia from "./stores"
import { useAuthStore } from "@/stores/auth"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "./assets/main.css"

const app = createApp(App)

app.use(pinia)

const auth = useAuthStore()
await auth.init()

app.use(router)
await router.isReady()

app.mount('#app')
