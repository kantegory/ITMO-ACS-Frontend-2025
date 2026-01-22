document.addEventListener('DOMContentLoaded', async () => {

    // получаем параметры из URL
    const params = new URLSearchParams(window.location.search);

    // достаём id ресторана из адресной строки
    const id = params.get('id');

    // id нет в URL - страница открыта неправильно
    if (!id) {
        // показываем сообщение об ошибке
        document.getElementById('restName').textContent =
            'Ресторан не найден';
        return; // останавливаем выполнение скрипта
    }

    try {
        // запрашиваем данные ресторана по id из API
        const r = await fetchRestaurantById(id);

        // заполняем страницу данными ресторана
        document.getElementById('restName').textContent = r.name;
        document.getElementById('restImg').src = r.image;
        document.getElementById('restType').textContent = r.type;
        document.getElementById('restPrice').textContent = r.price;
        document.getElementById('restDesc').textContent = r.description;

    } catch (err) {
        // если произошла ошибка при загрузке ресторана
        console.error(err);
    }

    // получаем форму бронирования
    const form = document.getElementById('bookingForm');

    // обрабатываем отправку формы бронирования
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // отменяем стандартную отправку формы

        // получаем текущего пользователя из localStorage
        const user = JSON.parse(localStorage.getItem('restorator_user'));

        // если пользователь не авторизован
        if (!user) {
            alert('Сначала войдите в аккаунт');
            window.location.href = 'login.html';
            return;
        }

        // формируем объект бронирования
        const booking = {
            userId: user.id,                // id пользователя
            restaurantId: Number(id),       // id ресторана
            date: document.getElementById('bookDate').value,
            time: document.getElementById('bookTime').value,
            guests: document.getElementById('bookGuests').value
        };

        try {
            // отправляем бронирование в API
            await createBooking(booking); // функция из api.js

            // уведомляем пользователя об успехе
            alert('Бронирование создано');

            // переходим в личный кабинет
            window.location.href = 'profile.html';

        } catch (err) {
            // если API вернул ошибку
            alert('Ошибка бронирования');
        }
    });
});
