# FastRent (Lab 2)

## Mock API
- Все данные хранятся в `db.json` и обслуживаются через [json-server](https://github.com/typicode/json-server).
- Перед запуском фронтенда установите сервер (один раз):
  ```bash
  npm install -g json-server
  ```
- Запустите mock API из корня `labs/Lab2`:
  ```bash
  npx json-server --watch db.json --port 3001
  ```
- После запуска `http://localhost:3001` будет отдавать коллекции `/users` и `/properties`, которые использует фронтенд через Axios.

## Клиент
- Все HTML-страницы подключают Bootstrap 5, Axios CDN и общий скрипт `assets/js/main.js`.
- `main.js` общается с API через Axios-инстанс (`http://localhost:3001`), кеширует объявления и синхронизирует профиль пользователя через JSON-server.
- Авторизация остаётся на localStorage (`rental_currentUser`), но все CRUD-операции идут через mock API (вход, регистрация, обновление профиля, загрузка объявлений).

## Проверка
1. Запустите json-server, как описано выше.
2. Откройте нужную HTML-страницу (например, `index.html`) в Live Server или напрямую в браузере.
3. Интерфейс автоматически подтянет данные через API. Если сервер не запущен, появятся alert-сообщения c указанием ошибки.
