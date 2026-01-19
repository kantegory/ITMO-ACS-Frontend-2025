import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@/assets/css/index.css'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

if (prefersDark) {
  import('@/assets/css/dark.css')
} else {
  import('@/assets/css/light.css')
}

createApp(App)
  .use(router)
  .mount('#app')
