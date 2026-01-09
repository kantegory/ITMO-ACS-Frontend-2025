// src/main.js
import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/stores'  // Импортируем нашу настройку Pinia

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '@/assets/main.css'

const app = createApp(App)

app.use(store)    // Подключаем Pinia
app.use(router)   // Подключаем роутер

app.mount('#app')