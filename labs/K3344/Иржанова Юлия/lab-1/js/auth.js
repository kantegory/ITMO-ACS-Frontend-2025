// albumrate - логика авторизации

// инициализация и утилиты

/**
 * Получить текущего авторизованного пользователя
 * @returns {Object|null} Данные пользователя или null если не авторизован
 */
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Проверить, авторизован ли пользователь
 * @returns {boolean}
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Получить всех зарегистрированных пользователей
 * @returns {Array}
 */
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

/**
 * Сохранить пользователей в localStorage
 * @param {Array} users
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * Найти пользователя по email
 * @param {string} email
 * @returns {Object|null}
 */
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email === email) || null;
}

// валидация

/**
 * Валидировать email
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Валидировать пароль
 * @param {string} password
 * @returns {Object} { valid: boolean, message: string }
 */
function validatePassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Пароль должен содержать минимум 6 символов' };
    }
    return { valid: true, message: '' };
}

/**
 * Валидировать имя
 * @param {string} name
 * @returns {boolean}
 */
function validateName(name) {
    return name.trim().length >= 2;
}

/**
 * Показать ошибку в поле
 * @param {HTMLElement} inputElement
 * @param {HTMLElement} errorElement
 * @param {string} message
 */
function showError(inputElement, errorElement, message) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
}

/**
 * Очистить ошибку в поле
 * @param {HTMLElement} inputElement
 * @param {HTMLElement} errorElement
 */
function clearError(inputElement, errorElement) {
    inputElement.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.add('d-none');
}

// логика входа

/**
 * Обработка формы входа
 */
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');

        // очищаем предыдущие ошибки
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        let hasError = false;

        // валидация email
        if (!email) {
            showError(emailInput, emailError, 'Пожалуйста, введите email');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Некорректный формат email');
            hasError = true;
        }

        // валидация пароля
        if (!password) {
            showError(passwordInput, passwordError, 'Пожалуйста, введите пароль');
            hasError = true;
        }

        if (hasError) return;

        // поиск пользователя
        const user = findUserByEmail(email);

        if (!user) {
            showError(emailInput, emailError, 'Пользователь с таким email не найден');
            return;
        }

        // проверка пароля
        if (user.password !== password) {
            showError(passwordInput, passwordError, 'Неправильный пароль');
            return;
        }

        // успешный вход
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email
        }));

        console.log('✅ Вы вошли как:', user.name);
        alert('Добро пожаловать, ' + user.name + '!');
        window.location.href = 'catalog.html';
    });
}

// логика регистрации

/**
 * Обработка формы регистрации
 */
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('regName');
        const emailInput = document.getElementById('regEmail');
        const passwordInput = document.getElementById('regPassword');
        const confirmInput = document.getElementById('regPasswordConfirm');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('regEmailError');
        const passwordError = document.getElementById('regPasswordError');
        const confirmError = document.getElementById('confirmError');

        // очищаем предыдущие ошибки
        clearError(nameInput, nameError);
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);
        clearError(confirmInput, confirmError);

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmInput.value;

        let hasError = false;

        // валидация имени
        if (!name) {
            showError(nameInput, nameError, 'Пожалуйста, введите имя');
            hasError = true;
        } else if (!validateName(name)) {
            showError(nameInput, nameError, 'Имя должно содержать минимум 2 символа');
            hasError = true;
        }

        // валидация email
        if (!email) {
            showError(emailInput, emailError, 'Пожалуйста, введите email');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, 'Некорректный формат email');
            hasError = true;
        } else if (findUserByEmail(email)) {
            showError(emailInput, emailError, 'Пользователь с таким email уже зарегистрирован');
            hasError = true;
        }

        // валидация пароля
        if (!password) {
            showError(passwordInput, passwordError, 'Пожалуйста, введите пароль');
            hasError = true;
        } else {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.valid) {
                showError(passwordInput, passwordError, passwordValidation.message);
                hasError = true;
            }
        }

        // валидация подтверждения пароля
        if (!confirmPassword) {
            showError(confirmInput, confirmError, 'Пожалуйста, повторите пароль');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError(confirmInput, confirmError, 'Пароли не совпадают');
            hasError = true;
        }

        if (hasError) return;

        // создание нового пользователя
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toLocaleDateString('ru-RU'),
            favorites: [],
            reviews: []
        };

        // сохранение пользователя
        const users = getAllUsers();
        users.push(newUser);
        saveUsers(users);

        // автоматический вход
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }));

        console.log('Аккаунт создан и вы вошли как:', newUser.name);
        alert('Добро пожаловать, ' + newUser.name + '! Аккаунт успешно создан.');
        window.location.href = 'catalog.html';
    });
}

// логика выхода

/**
 * Обработка кнопки выхода
 */
document.querySelectorAll('#logoutBtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const currentUser = getCurrentUser();
        if (currentUser) {
            console.log('Вы вышли как:', currentUser.name);
            alert('До свидания, ' + currentUser.name + '!');
        }
        
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});

// защита страниц

/**
 * Проверить защиту страницы
 * Если пользователь не авторизован, редирект на login
 */
function protectPage() {
    // список защищённых страниц (исключаем login и register)
    const protectedPages = ['catalog.html', 'profile.html', 'album-detail.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        console.warn('Доступ запрещён. Зайдите в аккаунт.');
        window.location.href = 'login.html';
    }
}

// защитить страницу при загрузке
document.addEventListener('DOMContentLoaded', protectPage);

// инициализация профиля

/**
 * Заполнить данные профиля
 */
function initializeProfile() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    // заполнить информацию пользователя
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');

    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;

    // заполнить форму редактирования профиля
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');

    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
}

/**
 * Обработка формы редактирования профиля
 */
if (document.getElementById('editProfile
