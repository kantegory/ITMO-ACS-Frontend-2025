// URL пользователей
const USERS_API = 'http://localhost:3000/users';

/**
 * обработка формы входа
 */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorBox = document.getElementById('loginError');

        try {
            // получаем пользователя по email
            const res = await fetch(`${USERS_API}?email=${email}`);
            const users = await res.json();

            // проверка существования пользователя
            if (users.length === 0 || users[0].password !== password) {
                errorBox.textContent = 'Неверный email или пароль';
                return;
            }

            // сохраняем пользователя в localStorage
            localStorage.setItem('restorator_user', JSON.stringify(users[0]));

            // перенаправляем в профиль
            window.location.href = 'profile.html';

        } catch (err) {
            errorBox.textContent = 'Ошибка сервера';
        }
    });
}

/**
 * обработка формы регистрации
 */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const errorBox = document.getElementById('registerError');

        try {
            // создание нового пользователя
            const res = await fetch(USERS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (!res.ok) {
                errorBox.textContent = 'Ошибка регистрации';
                return;
            }

            // после регистрации отправляем на страницу входа
            window.location.href = 'login.html';

        } catch (err) {
            errorBox.textContent = 'Ошибка сервера';
        }
    });
}
