# Подключение к JSON-Server и работа запросов в `assets/js/main.js`

## 1. Запуск и конфигурация mock-api
- Источник данных — файл `db.json` в корне лабораторной.
- Сервер поднимается командой `json-server --watch db.json --port 3001` из каталога `labs/Lab2`.
- Клиентская часть ожидает, что сервер доступен по `http://localhost:3001`; адрес хардкожен в `API_BASE_URL`.

```javascript
const API_BASE_URL = 'http://localhost:3001';
const api = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });
```
- Все запросы идут через экземпляр `axios`, поэтому изменение порта или таймаута делается в одном месте.

## 2. Нормализация данных
Чтобы сгладить различия между строковыми и числовыми ID в JSON-Server, в начале файла объявлены утилиты `normalizeId`, `withStringId`, `normalizeProperty`, `normalizeConversation`, `normalizeTransaction` и `removePropertyFromCache`. Они:
1. Приводят все идентификаторы к строке.
2. Гарантируют целостность данных в кэше.
3. Обновляют локальные массивы после создания/удаления записей.

## 3. Запросы по сущностям
### Объявления (`advertisement`)
| Функция | HTTP-метод/endpoint | Назначение |
|---------|---------------------|------------|
| `fetchProperties(forceRefresh)` | `GET /advertisement` | Загружает список объявлений. Результат кэшируется в `propertiesCache`. |
| `getPropertyById(id)` | `GET /advertisement/:id` | Возвращает одно объявление. Обновляет/переиспользует кэш. |
| `deleteProperty(id)` | `DELETE /advertisement/:id` | Удаляет объявление и синхронно вычищает кэш. Используется на дашборде. |

### Пользователи (users)
| Функция | HTTP-метод/endpoint | Заметки |
|---------|---------------------|---------|
| `queryUserByCredentials(email, password)` | `GET /users?email=&password=` | Используется в форме логина. Возвращает первого совпавшего пользователя. |
| `findUserByEmail(email)` | `GET /users?email=` | Проверка уникальности email при регистрации. |
| `createUser(payload)` | `POST /users` | Создание пользователя на регистрации. |
| `updateUser(id, payload)` | `PATCH /users/:id` | Обновление профиля. |
| `getUserById(id)` | `GET /users/:id` (с fallback `/users?id=`) | Обновляет локально сохранённого пользователя и валидирует сессию. |

Все успешные ответы прогоняются через `withStringId`, чтобы сохранить строковый `id` в `localStorage` и кэше.

### Сообщения (`conversations`) и транзакции (`transactions`)
| Функция | Endpoint | Особенности |
|---------|----------|-------------|
| `fetchConversations(userId, forceRefresh)` | `GET /conversations?userId=` | Результат кэшируется в `conversationsCache`. |
| `fetchTransactions(userId, forceRefresh)` | `GET /transactions?userId=` | Аналогично, кэшируется в `transactionsCache`. |

## 4. Использование запросов на страницах
- **Навбар и авторизация**: `renderNavbar`, `handleLoginForm`, `handleRegisterForm`, `initProfile` используют функции раздела «Пользователи» и сохраняют текущего пользователя в `localStorage` под ключом `rental_currentUser`.
- **Поиск (index.html)**: `initSearchPage` вызывает `fetchProperties`, применяет фильтры и рисует карточки через `renderProperties` из коллекции `advertisement`.
- **Бронирование**: `initBooking` достаёт `propertyId` из модального окна, проверяет авторизацию и запрашивает подробности через `getPropertyById`.
- **Дашборд**: `initDashboard` грузит список всех объявлений, фильтрует по `ownerId`/`tenantId`, а при нажатии «Удалить» вызывает `deleteProperty` с подтверждением и потом обновляет локальный список.
- **Карточка объявления (property.html)**: `initPropertyPage` читает `id` из query string и запрашивает данные через `getPropertyById`.
- **Сообщения/Транзакции**: `initMessages` одновременно получает переписки и платежи через `fetchConversations`/`fetchTransactions` и мапит их к `fetchProperties` (данные `advertisement`) для отображения заголовков.
- **Профиль**: `initProfile` переиспользует `getUserById` для свежих данных и `updateUser` для отправки формы.

## 5. Обработка ошибок
Все API функции оборачиваются в `try/catch`. В случае ошибки вызывается `handleApiError`, который логирует сообщение в консоль и показывает alert с подсказкой («Проверьте JSON-server»). Так пользователь сразу видит причину проблемы (сервер не запущен, сеть недоступна и т.п.).

## 6. Что важно помнить
1. **JSON-Server должен работать** до открытия страниц, иначе любые запросы вернут ошибку и приложение покажет alert.
2. **ID всегда строки**: если добавляете новые запросы, прогоняйте ответы через `normalizeId`/`withStringId`, чтобы избежать несовпадений при сравнении.
3. **Не забывайте обновлять кэш**: при добавлении новых мутаций (POST/DELETE/PATCH) нужно либо сбрасывать связанные кэши (`propertiesCache`, `conversationsCache`, `transactionsCache`), либо вручную обновлять их по аналогии с существующим кодом.
