// src/stores/index.js
import { persist } from 'pinia-persists'  // Плагин для сохранения
import { createPinia } from 'pinia'       // Импортируем Pinia

const pinia = createPinia()               // Создаём экземпляр Pinia

pinia.use(persist())                      // Подключаем плагин

export default pinia                      // Экспортируем настроенный Pinia
