# RentAparts Vue.js Migration

Миграция проекта RentAparts с vanilla HTML/CSS/JS на Vue.js с TypeScript.

## Технологический стек

- **Vue.js 3** - основной фреймворк
- **TypeScript** - типизация
- **Vue Router** - маршрутизация
- **Pinia** - управление состоянием
- **Vite** - сборщик
- **Bootstrap 5** - UI фреймворк
- **Font Awesome** - иконки

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── icons/          # SVG иконки
│   ├── AppNavbar.vue   # Навигация
│   ├── AppFooter.vue   # Футер
│   ├── PropertyCard.vue # Карточка недвижимости
│   ├── PropertyList.vue # Список недвижимости
│   ├── SearchForm.vue  # Форма поиска
│   └── TravelBenefits.vue # Секция преимуществ
├── composables/         # Composable функции
│   └── useApiService.ts # API сервис
├── stores/             # Pinia хранилища
│   └── auth.ts        # Аутентификация
├── views/             # Страницы
│   ├── HomeView.vue   # Главная
│   ├── LoginView.vue  # Авторизация
│   ├── RegisterView.vue # Регистрация
│   ├── SearchView.vue # Поиск
│   ├── PropertyView.vue # Недвижимость
│   ├── ProfileView.vue # Профиль
│   └── MessagesView.vue # Сообщения
├── router/            # Маршрутизация
│   └── index.ts
├── App.vue            # Корневой компонент
└── main.ts           # Точка входа
```

## Ключевые возможности

### ✅ Роутер (Vue Router)
- Маршрутизация между страницами
- Защищенные маршруты (требующие авторизации)
- Программная навигация

### ✅ Работа с внешним API
- HTTP клиент на основе Axios
- Интерсепторы для авторизации
- Интеграция с внешними API (геолокация)
- Моковые данные для демонстрации

### ✅ Разумное деление на компоненты
- **Layout компоненты**: AppNavbar, AppFooter
- **UI компоненты**: PropertyCard, PropertyList, SearchForm
- **Страницы**: HomeView, SearchView, LoginView и др.
- **Иконки**: Переиспользуемые SVG компоненты

### ✅ Использование Composables
- `useApiService` - работа с API
- `useAuthStore` - управление состоянием аутентификации

## Архитектурные решения

### Управление состоянием (Pinia)
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  // ...
})
```

### Composables
```typescript
// composables/useApiService.ts
export const useApiService = () => {
  const apiService = {
    async login(email: string, password: string) {
      // Реализация авторизации
    }
    // ...
  }
  return { apiService }
}
```

### Типизация
- Интерфейсы для всех сущностей (User, Property, etc.)
- Типизированные API ответы
- Props и события компонентов типизированы

### Маршрутизация
```typescript
// router/index.ts
const routes = [
  { path: '/', component: Home },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]
```

## Запуск проекта

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для production
```bash
npm run build
```

### Предпросмотр production сборки
```bash
npm run preview
```

## Демо функции

### Аутентификация
- **Логин**: test@example.com / password123
- **Регистрация**: создание новых пользователей
- Сохранение состояния в localStorage

### Поиск недвижимости
- Фильтрация по типу, цене, рейтингу
- Геолокация пользователя
- Интеграция с внешними API

### Бронирование
- Выбор дат и количества гостей
- Расчет стоимости

## Миграционные изменения

### Было (vanilla JS):
- Отдельные HTML файлы
- jQuery/vanilla JS
- Глобальные переменные
- Прямая манипуляция DOM

### Стало (Vue.js):
- SPA с Vue Router
- Компонентная архитектура
- Реактивные данные
- Типизация TypeScript
- Централизованное управление состоянием

## Соответствие требованиям

✅ **Роутер подключён** - Vue Router настроен с 7 маршрутами
✅ **Работа с внешним API** - Axios + геолокация + внешние сервисы
✅ **Разумное деление на компоненты** - 15+ переиспользуемых компонентов
✅ **Использование composable** - useApiService для работы с API

## Автор

Хисаметдинова Динара, группа K3441

## Лицензия

Учебный проект для ИТМО