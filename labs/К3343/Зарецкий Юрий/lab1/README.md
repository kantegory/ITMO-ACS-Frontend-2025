# Лабораторная работа 1 - Аренда недвижимости

Приложение для аренды недвижимости на Vue.js 3 с использованием Vite, Vue Router, Composition API и JSON Server.

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск JSON Server

В одном терминале:

```bash
npm run server
```

Сервер будет запущен на порту 3001: `http://localhost:3001`

### 3. Запуск Vue приложения

В другом терминале:

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### 4. Сборка для production

```bash
npm run build
```

Собранные файлы будут в директории `dist/`

## Структура проекта

```
lab1/
├── src/
│   ├── main.js              # Точка входа Vue приложения
│   ├── App.vue              # Корневой компонент
│   ├── router/
│   │   └── index.js         # Конфигурация Vue Router
│   ├── views/               # Страницы (роуты)
│   │   ├── Home.vue         # Главная страница
│   │   ├── Login.vue        # Страница входа
│   │   ├── Register.vue     # Страница регистрации
│   │   ├── Search.vue       # Страница поиска
│   │   ├── Property.vue     # Детали недвижимости
│   │   └── Profile.vue      # Личный кабинет
│   ├── components/          # Переиспользуемые компоненты
│   │   ├── common/
│   │   │   ├── Navbar.vue   # Навигационная панель
│   │   │   ├── ThemeToggle.vue # Переключатель темы
│   │   │   └── Icon.vue     # Компонент иконки
│   │   ├── property/
│   │   │   ├── PropertyCard.vue # Карточка недвижимости
│   │   │   ├── PropertyFilters.vue # Фильтры поиска
│   │   │   └── PropertyGallery.vue # Галерея изображений
│   │   └── forms/
│   │       ├── LoginForm.vue
│   │       ├── RegisterForm.vue
│   │       └── RentForm.vue
│   ├── composables/         # Composition API функции
│   │   ├── useAuth.js       # Авторизация
│   │   ├── useTheme.js      # Темизация
│   │   ├── useApi.js        # API клиент
│   │   ├── useProperties.js # Работа с недвижимостью
│   │   └── useStorage.js    # Работа с localStorage
│   ├── services/            # Сервисы
│   │   └── api.js           # Axios конфигурация и API методы
│   ├── utils/               # Утилиты
│   │   ├── dateFormatter.js # Форматирование дат
│   │   └── validators.js    # Валидация форм
│   ├── assets/             # Статические ресурсы
│   │   └── icons.svg        # SVG спрайт
│   └── styles/
│       └── main.css         # Основные стили
├── public/                  # Публичные файлы
│   └── assets/
│       └── icons.svg        # SVG спрайт (для production)
├── index.html               # HTML шаблон
├── vite.config.js           # Конфигурация Vite
├── package.json
└── server.js                # Бэкенд (JSON Server)
```

## Компонентный подход

Приложение построено на принципах компонентной архитектуры Vue.js с использованием Composition API.

### Принципы разделения:

1. **Views (Страницы)** - контейнеры для роутов, содержат основную логику страницы
   - `Home.vue` - главная страница с приветствием
   - `Login.vue`, `Register.vue` - страницы аутентификации
   - `Search.vue` - страница поиска с фильтрами
   - `Property.vue` - детальная информация о недвижимости
   - `Profile.vue` - личный кабинет пользователя

2. **Components** - переиспользуемые UI компоненты:
   - `common/` - общие компоненты (Navbar, Icon, ThemeToggle)
   - `property/` - компоненты связанные с недвижимостью (PropertyCard, PropertyFilters, PropertyGallery)
   - `forms/` - формы ввода (LoginForm, RegisterForm, RentForm)

3. **Composables** - переиспользуемая бизнес-логика:
   - `useAuth` - управление авторизацией (login, register, logout, текущий пользователь)
   - `useProperties` - работа с недвижимостью (загрузка, фильтрация, аренда)
   - `useTheme` - управление темой (переключение, сохранение в localStorage)
   - `useApi` - конфигурация API клиента (axios с interceptors)
   - `useStorage` - работа с localStorage (get, set, remove)

4. **Services** - слой взаимодействия с API:
   - `api.js` - методы для работы с пользователями и недвижимостью

5. **Utils** - чистые функции-утилиты:
   - `dateFormatter.js` - форматирование дат в читаемый формат
   - `validators.js` - валидация форм (email, пароль, телефон, даты)

### Преимущества такого подхода:

- **Переиспользование**: компоненты и composables можно использовать в разных местах приложения
- **Тестируемость**: каждый модуль можно тестировать отдельно
- **Поддерживаемость**: четкое разделение ответственности упрощает поддержку кода
- **Масштабируемость**: легко добавлять новые функции и компоненты
- **Реактивность**: использование Composition API обеспечивает реактивное состояние

### Примеры использования:

**Composable в компоненте:**
```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { currentUser, isAuthenticated, login } = useAuth()
</script>
```

**Переиспользование компонента:**
```vue
<template>
  <PropertyCard 
    v-for="property in properties" 
    :key="property.id" 
    :property="property" 
  />
</template>
```

## API Endpoints

### Публичные эндпоинты (не требуют авторизации)

- `GET /apartments` - Получить весь список недвижимости (с поддержкой фильтров)
- `GET /apartments/:id` - Получить недвижимость по ID
- `POST /login` - Авторизация пользователя
- `POST /register` - Регистрация нового пользователя

### Защищенные эндпоинты (требуют токен авторизации)

- `GET /users` - Получить всех пользователей
- `GET /users/:id` - Получить пользователя по ID
- `GET /apartments?ownerId=:id` - Получить недвижимость пользователя
- `GET /rentedApartments?tenantId=:id` - Получить арендованную недвижимость
- `POST /rentedApartments` - Создать запись об аренде

### Фильтрация недвижимости

Эндпоинт `GET /apartments` поддерживает следующие query-параметры:
- `search` - текстовый поиск (название, адрес, описание)
- `type` - тип недвижимости (apartment, house, office, studio)
- `location` - город/локация
- `minPrice` - минимальная цена
- `maxPrice` - максимальная цена
- `rooms` - количество комнат (или "4+" для 4 и более)

Пример: `GET /apartments?type=apartment&minPrice=30000&maxPrice=50000&rooms=2`

## Авторизация

Приложение использует токен-базированную авторизацию. После успешного входа или регистрации токен сохраняется в localStorage и автоматически добавляется к каждому запросу через Axios interceptor.

Формат токена: `Bearer <base64-encoded-token>`

### Защита роутов

Приватные страницы (например, `/profile`) защищены через route guards в Vue Router. При попытке доступа неавторизованным пользователем происходит редирект на страницу входа.

## Тестовые пользователи

В базе данных уже есть тестовые пользователи:

1. Email: `ivan@example.com`, Пароль: `password123`
2. Email: `maria@example.com`, Пароль: `password123`
3. Email: `alex@example.com`, Пароль: `password123`

## Особенности реализации

- **Vue 3** с Composition API и `<script setup>`
- **Vue Router** для навигации с защитой приватных страниц
- **Vite** для быстрой разработки и сборки
- **Axios** для HTTP запросов с автоматическим добавлением токена
- **Composables** для переиспользования логики
- **Компонентный подход** с четким разделением ответственности
- Обработка ошибок авторизации (401) с автоматическим перенаправлением
- Кэширование данных в localStorage для офлайн-доступа
- Middleware на сервере для проверки авторизации
- Темизация через CSS-переменные (светлая/тёмная тема) с учётом системной настройки
- SVG-спрайт для иконок

## Темизация

- На всех страницах доступен переключатель темы (кнопка в правой части навбара)
- По умолчанию тема выбирается из сохранённых настроек пользователя или системного предпочтения (`prefers-color-scheme`)
- Выбранная тема сохраняется в `localStorage` и применяется при следующем открытии
- Тема применяется через composable `useTheme`

## Технологии

- Vue 3 (Composition API)
- Vue Router 4
- Vite
- Axios
- Bootstrap 5
- JSON Server
