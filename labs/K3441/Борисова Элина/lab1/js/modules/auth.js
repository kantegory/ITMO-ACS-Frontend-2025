const AUTH_STORAGE_KEY = 'rentestate_auth';

const authManager = {
    getCurrentUser: () => {
        try {
            const authData = localStorage.getItem(AUTH_STORAGE_KEY);
            return authData ? JSON.parse(authData) : null;
        } catch (error) {
            console.log('Ошибка получения пользователя:', error);
            return null;
        }
    },

    setCurrentUser: (user) => {
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            console.log('Пользователь установлен:', user.username);
        } catch (error) {
            console.log('Ошибка сохранения пользователя:', error);
        }
    },

    logout: () => {
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            console.log('Пользователь вышел');
            window.location.href = 'index.html';
        } catch (error) {
            console.log('Ошибка выхода:', error);
        }
    },

    isAuthenticated: () => {
        return !!authManager.getCurrentUser();
    }
};

function findUser(email, password) {
    if (!window.MOCK_USERS) {
        console.error('MOCK_USERS не загружены');
        return null;
    }

    return window.MOCK_USERS.find(user =>
        user.email === email && user.password === password
    );
}

function userExists(email) {
    if (!window.MOCK_USERS) {
        console.error('MOCK_USERS не загружены');
        return false;
    }

    return window.MOCK_USERS.some(user => user.email === email);
}

function createUser(username, email, password) {
    if (!window.MOCK_USERS) {
        console.error('MOCK_USERS не загружены');
        return null;
    }

    const maxId = Math.max(...window.MOCK_USERS.map(user => user.id), 0);

    const newUser = {
        id: maxId + 1,
        username: username,
        email: email,
        password: password,
        role: 'user',
        phone: '',
        createdAt: new Date().toISOString()
    };

    window.MOCK_USERS.push(newUser);

    try {
        localStorage.setItem('rentestate_users', JSON.stringify(window.MOCK_USERS));
    } catch (error) {
        console.error('Ошибка сохранения пользователей:', error);
    }

    console.log('Новый пользователь создан:', newUser);
    return newUser;
}

function loadUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('rentestate_users');
        if (storedUsers) {
            const parsedUsers = JSON.parse(storedUsers);
            parsedUsers.forEach(storedUser => {
                const exists = window.MOCK_USERS.some(mockUser => mockUser.id === storedUser.id);
                if (!exists) {
                    window.MOCK_USERS.push(storedUser);
                }
            });
            console.log('Пользователи загружены из localStorage');
        }
    } catch (error) {
        console.error('Ошибка загрузки пользователей из localStorage:', error);
    }
}

function login(email, password) {
    console.log('Попытка входа:', email);

    const user = findUser(email, password);
    if (user) {
        authManager.setCurrentUser(user);

        setTimeout(() => {
            if (window.handlePostLoginRental) {
                handlePostLoginRental();
            }
            if (window.handlePostLoginChat) {
                handlePostLoginChat();
            }
        }, 100);

        return { success: true, user: user };
    } else {
        return { success: false, error: 'Неверный email или пароль' };
    }
}

function register(username, email, password) {
    console.log('Попытка регистрации:', username, email);

    if (userExists(email)) {
        return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const newUser = createUser(username, email, password);
    if (!newUser) {
        return { success: false, error: 'Ошибка создания пользователя' };
    }

    authManager.setCurrentUser(newUser);

    setTimeout(() => {
        if (window.handlePostLoginRental) {
            handlePostLoginRental();
        }
        if (window.handlePostLoginChat) {
            handlePostLoginChat();
        }
    }, 100);

    return { success: true, user: newUser };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(element, message, type) {
    if (!element) {
        console.log('сообщение:', message);
        return;
    }

    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.classList.remove('d-none');
}

function updateNavigation() {
    const navLinks = document.querySelector('.navbar-nav');
    if (!navLinks) {
        console.log('Навигация не найдена');
        return;
    }

    const isAuth = authManager.isAuthenticated();
    const user = authManager.getCurrentUser();

    console.log('Обновление навигации. Авторизован:', isAuth);

    if (isAuth && user) {
        navLinks.innerHTML = `
            <li class="nav-item">
                <span class="nav-link text-light">Привет, ${user.username}!</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="chats.html">
                    Чаты
                    <span id="navUnreadBadge" class="badge bg-danger d-none">0</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="profile.html">Личный кабинет</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="authManager.logout()">Выйти</a>
            </li>
        `;

        updateUnreadBadge();
    } else {
        navLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Вход</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="register.html">Регистрация</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="chats.html">Чаты</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="profile.html">Личный кабинет</a>
            </li>
        `;
    }
}

function updateUnreadBadge() {
    if (!isAuthenticated()) return;

    const user = authManager.getCurrentUser();
    const unreadCount = getUnreadMessagesCount(user.id);
    const badge = document.getElementById('navUnreadBadge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    }
}

function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        const messageEl = document.getElementById('registerMessage');

        if (username.length < 3) {
            showMessage(messageEl, 'Имя пользователя должно содержать минимум 3 символа', 'danger');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage(messageEl, 'Пожалуйста, введите корректный email', 'danger');
            return;
        }

        if (password.length < 6) {
            showMessage(messageEl, 'Пароль должен содержать минимум 6 символов', 'danger');
            return;
        }

        showMessage(messageEl, 'Регистрация...', 'info');

        setTimeout(() => {
            const result = register(username, email, password);

            if (result.success) {
                showMessage(messageEl, 'Регистрация успешна!', 'success');

                setTimeout(() => {
                    const returnUrl = localStorage.getItem('return_url') || 'index.html';
                    localStorage.removeItem('return_url');
                    window.location.href = returnUrl;
                }, 1000);
            } else {
                showMessage(messageEl, result.error, 'danger');
            }
        }, 500);
    });
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const messageEl = document.getElementById('loginMessage');

        if (!isValidEmail(email)) {
            showMessage(messageEl, 'Пожалуйста, введите корректный email', 'danger');
            return;
        }

        if (password.length < 6) {
            showMessage(messageEl, 'Пароль должен содержать минимум 6 символов', 'danger');
            return;
        }

        showMessage(messageEl, 'Вход...', 'info');

        setTimeout(() => {
            const result = login(email, password);

            if (result.success) {
                showMessage(messageEl, 'Вход успешен!', 'success');

                setTimeout(() => {
                    const returnUrl = localStorage.getItem('return_url') || 'index.html';
                    localStorage.removeItem('return_url');
                    window.location.href = returnUrl;
                }, 1000);
            } else {
                showMessage(messageEl, result.error, 'danger');
            }
        }, 500);
    });
}

function initializeAuth() {
    console.log('Инициализация авторизации');

    if (window.MOCK_USERS) {
        loadUsersFromStorage();
    } else {
        console.warn('MOCK_USERS не доступны, данные из data.js не загружены');
    }

    updateNavigation();
    setupRegisterForm();
    setupLoginForm();

    console.log('Авторизация инициализирована');
    console.log('Текущий пользователь:', authManager.getCurrentUser());
}

window.isAuthenticated = authManager.isAuthenticated;
window.authManager = authManager;
window.login = login;
window.register = register;
