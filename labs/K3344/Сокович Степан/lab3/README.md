# Лабораторная работа 3: SPA на Vue.js

## Описание

Миграция приложения для аренды недвижимости на Vue.js с использованием:
- Vue Router для навигации
- Axios для работы с API
- Компонентный подход
- Composable для переиспользуемой логики

## Требования

- Node.js 18+
- npm или yarn

## Установка

```bash
npm install
```

## Запуск

### 1. Запуск JSON-сервера (бэкенд)

В одном терминале:

```bash
npm run server
```

Сервер запустится на `http://localhost:3000`

### 2. Запуск Vue.js приложения (фронтенд)

В другом терминале:

```bash
npm run dev
```

Приложение откроется на `http://localhost:5173`

## Структура проекта

```
lab3/
├── src/
│   ├── components/       # Vue компоненты
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── ListingCard.vue
│   │   ├── FilterPanel.vue
│   │   ├── BookingModal.vue
│   │   └── DetailsModal.vue
│   ├── views/            # Страницы
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   └── Profile.vue
│   ├── composables/      # Переиспользуемая логика
│   │   ├── useApi.js
│   │   ├── useAuth.js
│   │   ├── useListings.js
│   │   └── useBookings.js
│   ├── router/           # Vue Router
│   │   └── index.js
│   ├── assets/          # Статические ресурсы
│   │   └── css/
│   ├── App.vue
│   └── main.js
├── public/              # Публичные файлы
│   └── img/
├── db.json              # База данных для JSON-server
├── middleware.js        # Middleware для JSON-server
└── package.json
```

## Функционал

### Реализовано:

1. **Роутинг** - Vue Router с защищенными маршрутами
2. **API** - Работа с внешним API через Axios
3. **Компоненты**:
   - Navbar - навигация
   - Footer - подвал
   - ListingCard - карточка объявления
   - FilterPanel - панель фильтров
   - BookingModal - модальное окно аренды
   - DetailsModal - модальное окно деталей
4. **Composables**:
   - useApi - базовый API клиент
   - useAuth - авторизация
   - useListings - работа с объявлениями
   - useBookings - работа с бронированиями
5. **Логика аренды** - создание и отмена бронирований
6. **Фильтрация** - фильтрация объявлений на бэкенде через query параметры
7. **Стили** - улучшенный дизайн с градиентами и анимациями

## Тестовые данные

### Пользователи:
- Email: `user@example.com`, Пароль: `password123`
- Email: `test@test.com`, Пароль: `test123`

## Сборка для production

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

