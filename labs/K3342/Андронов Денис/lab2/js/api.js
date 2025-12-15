// базовый URL
const API_BASE = 'http://localhost:3000';

/**
 * получить список всех ресторанов
 * GET http://localhost:3000/restaurants
 */
async function fetchRestaurants() {
    // отправляем HTTP-запрос на сервер
    const res = await fetch(`${API_BASE}/restaurants`);

    // с ошибкой 
    if (!res.ok) {
        throw new Error('Failed to load restaurants');
    }

    // ответ сервера из JSON в js-объект
    return res.json();
}

/**
 * получить данные одного ресторана по id
 * GET http://localhost:3000/restaurants/{id}
 */
async function fetchRestaurantById(id) {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);

    if (!res.ok) {
        throw new Error('Failed to load restaurant');
    }

    return res.json();
}

/**
 * Авторизация пользователя
 * мы просто ищем пользователя по email и password
 * GET /users?email=...&password=...
 */
async function loginUser(email, password) {
    // encodeURIComponent, чтобы корректно передать спецсимволы
    const res = await fetch(
        `${API_BASE}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );

    // массив пользователей
    const users = await res.json();

    // пользователь найден - возвращаем его, нет - null
    return users.length ? users[0] : null;
}

/**
 * регистрация нового пользователя
 */
async function registerUser(name, email, password) {
    // проверяем, существует ли пользователь с таким email
    const res = await fetch(
        `${API_BASE}/users?email=${encodeURIComponent(email)}`
    );

    const exists = await res.json();

    // пользователь уже есть — выбрасываем ошибку
    if (exists.length) {
        throw new Error('User exists');
    }

    // email свободен — создаём нового пользователя
    const create = await fetch(`${API_BASE}/users`, {
        method: 'POST', // POST - создание нового 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    // возвращаем созданного пользователя
    return create.json();
}

/**
 * получить все бронирования конкретного пользователя
 * GET /bookings?userId=...
 */
async function fetchBookingsForUser(userId) {
    const res = await fetch(
        `${API_BASE}/bookings?userId=${userId}`
    );

    return res.json();
}

/**
 * создать новое бронирование
 * POST /bookings
 */
async function createBooking(booking) {
    const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(booking)
    });

    return res.json();
}
