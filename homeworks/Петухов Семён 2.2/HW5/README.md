# HW5

Приложение для управления заметками на Vue 3 с использованием Pinia и json-server.

## Требования

- Node.js версии ^20.19.0 || >=22.12.0
- npm или yarn

## Установка зависимостей

```sh
npm install
```

## Запуск проекта

### 1. Запуск backend сервера (json-server)

Для работы приложения необходим backend сервер на порту 3000. Создайте файл `db.json` в корне проекта:

```json
{
  "notes": [
    {
      "id": 1,
      "name": "Пример заметки",
      "text": "Текст заметки",
      "userId": 1
    }
  ]
}
```

Запустите json-server:

```sh
npx json-server --watch db.json --port 3000
```

Или если json-server установлен глобально:

```sh
json-server --watch db.json --port 3000
```

Сервер будет доступен по адресу: `http://localhost:3000`

### 2. Запуск frontend приложения

В новом терминале запустите:

```sh
npm run dev
```

Или для запуска на порту 8080:

```sh
npm start
```

Приложение будет доступно по адресу: `http://localhost:5173` (или `http://localhost:8080` при использовании `npm start`)

## Использование

1. Откройте приложение в браузере
2. Заполните форму создания заметки (название и текст)
3. Нажмите кнопку "Отправить"
4. Заметка будет создана и отобразится в списке

## Структура проекта

- `src/api/` - API клиент для работы с backend
- `src/stores/` - Pinia stores для управления состоянием
- `src/views/` - Страницы приложения
- `src/components/` - Vue компоненты
- `db.json` - База данных для json-server (создайте вручную)

## Дополнительные команды

### Сборка для production

```sh
npm run build
```

### Предпросмотр production сборки

```sh
npm run preview
```

### Линтинг кода

```sh
npm run lint
```

## Рекомендуемые инструменты

- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (и отключите Vetur)
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) для отладки
