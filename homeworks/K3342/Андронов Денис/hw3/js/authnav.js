// скрипт для управления навигацией в зависимости от авторизации
document.addEventListener('DOMContentLoaded', () => {

    const user = JSON.parse(localStorage.getItem('restorator_user'));
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const profileLink = document.getElementById('profileLink');

    if (user) {
        // пользователь авторизован — скрываем вход и регистрацию
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
        profileLink.style.display = 'block';
    } else {
        // пользователь не авторизован — скрываем личный кабинет
        profileLink.style.display = 'none';
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';
    }
});
