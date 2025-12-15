document.addEventListener('DOMContentLoaded', async () => {

    // достаём данные пользователя из localStorage
    const user = JSON.parse(localStorage.getItem('restorator_user'));

    // пользователя нет - он не авторизован, его на страницу входа
    if (!user) {
        window.location.href = 'login.html';
        return; // останавливаем выполнение скрипта
    }

    // заполняем данные пользователя в личном кабинете
    // имени нет - подставляем "-"
    document.getElementById('profileName').textContent =
        `Имя: ${user.name || '-'}`;

    // выводим email пользователя
    document.getElementById('profileEmail').textContent =
        `Email: ${user.email}`;

    // элемент списка бронирований
    const bookingsList = document.getElementById('bookingsList');

    try {
        // получаем список бронирований пользователя
        const bookings = await fetchBookingsForUser(user.id);

        // бронирований нет - показываем сообщение
        if (bookings.length === 0) {
            bookingsList.innerHTML =
                '<li class="list-group-item">Нет бронирований</li>';
        } else {
            // бронирования есть - для каждого
            // дополнительно загружаем информацию о ресторане
            const rows = await Promise.all(
                bookings.map(async b => {

                    // получаем ресторан по id
                    const r = await fetchRestaurantById(b.restaurantId);

                    // формируем html для одного бронирования
                    return `
                        <li class="list-group-item">
                            ${r.name} — ${b.date} в ${b.time} —
                            ${b.guests} чел.
                        </li>
                    `;
                })
            );

            // вставляем список бронирований в DOM
            bookingsList.innerHTML = rows.join('');
        }

    } catch (err) {
        // если произошла ошибка при запросе к API
        bookingsList.innerHTML =
            '<li class="list-group-item text-danger">Ошибка загрузки</li>';
    }

    // кнопка выхода из аккаунта
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // удаляем пользователя из localStorage
        localStorage.removeItem('restorator_user');

        // возвращаем на главную страницу
        window.location.href = 'index.html';
    });
});
