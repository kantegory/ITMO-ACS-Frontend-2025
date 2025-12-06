# Restaurant Booking - Lab 2

Приложение для бронирования столиков в ресторанах с подключением к моковому API через JSON Server.

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск JSON Server

```bash
npm run server
```

Сервер будет доступен по адресу: `http://localhost:3000`

### 3. Запуск приложения

Откройте файл `index.html` в браузере или используйте локальный сервер (например, Live Server в VS Code).

## Структура проекта

- `index.html` - главная страница с поиском ресторанов
- `restaurant.html` - страница деталей ресторана
- `profile.html` - личный кабинет пользователя
- `script.js` - основной JavaScript код
- `api.js` - модуль для работы с API
- `db.json` - база данных для JSON Server
- `middleware.js` - middleware для обработки авторизации
- `style.css` - стили приложения

## API Endpoints

### Рестораны
- `GET /restaurants` - получить все рестораны
- `GET /restaurants/:id` - получить ресторан по ID
- `GET /restaurants?cuisine=Итальянская&location=Центр&price=₽₽` - поиск ресторанов с фильтрами

### Авторизация
- `POST /login` - вход пользователя
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- `POST /register` - регистрация нового пользователя
  ```json
  {
    "username": "user",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Бронирования
- `GET /bookings?userId=1` - получить бронирования пользователя
- `POST /bookings` - создать новое бронирование
  ```json
  {
    "userId": 1,
    "restaurantId": "1",
    "restaurantName": "Итальянский Ресторан",
    "name": "Иван",
    "email": "ivan@example.com",
    "date": "2024-01-15",
    "time": "19:00"
  }
  ```
- `DELETE /bookings/:id` - удалить бронирование

## Технологии

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Bootstrap 5
- JSON Server
- Fetch API

## Особенности

- Авторизация через API с токенами
- Загрузка ресторанов через API
- Поиск и фильтрация ресторанов
- Бронирование столиков через API
- История бронирований в личном кабинете
- Удаление бронирований

