# JobFinder - Сайт для поиска работы

Приложение для поиска работы с личными кабинетами для соискателей и работодателей.

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите JSON-сервер:
```bash
npm run server
```

Сервер будет доступен по адресу: http://localhost:3000

3. Откройте приложение в браузере:
- Откройте файл `index.html` в браузере
- Или используйте локальный сервер (например, Live Server в VS Code)

## Тестовые аккаунты

### Соискатель:
- Email: `candidate@example.com`
- Пароль: `123456`

### Работодатель:
- Email: `employer@example.com`
- Пароль: `123456`

## API Endpoints

- `GET /jobs` - получить все вакансии
- `GET /jobs/:id` - получить вакансию по ID
- `POST /jobs` - создать вакансию (требует авторизации)
- `POST /login` - вход в систему
- `POST /register` - регистрация
- `GET /users` - получить всех пользователей
- `GET /resumes` - получить все резюме
- `GET /applications` - получить все отклики

## Структура проекта

- `index.html` - главная страница с поиском вакансий
- `login.html` - страница входа
- `register.html` - страница регистрации
- `user-dashboard.html` - личный кабинет соискателя
- `employer-dashboard.html` - личный кабинет работодателя
- `job-detail.html` - страница детали вакансии
- `js/api.js` - модуль для работы с API
- `js/main.js` - основной JavaScript файл
- `db.json` - база данных JSON-server
- `server-middleware.js` - middleware для авторизации

