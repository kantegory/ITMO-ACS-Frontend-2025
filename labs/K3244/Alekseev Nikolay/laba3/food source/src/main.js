import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import pinia from "./stores"
import { useAuthStore } from "@/stores/auth"
import { useRecipesStore } from "@/stores/recipes"
import { applyTheme } from "@/theme"

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "./assets/main.css"

const app = createApp(App)

app.use(pinia)

const auth = useAuthStore()
await auth.init()

const recipesStore = useRecipesStore()
await recipesStore.load()

app.use(router)
await router.isReady()

auth.restoreSession().finally(() => {
  const t = auth.user?.theme
  applyTheme(t === "light" || t === "dark" ? t : null)
  app.mount("#app")
})
