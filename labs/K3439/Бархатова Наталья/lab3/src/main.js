import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'

import 'bootstrap/dist/css/bootstrap.min.css'
import store from '@/stores'
import { useThemeStore } from '@/stores/themeStore.js'

const app = createApp(App)

app.use(store)
app.use(router)

const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
