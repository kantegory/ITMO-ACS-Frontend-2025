// Проверяем, не объявлена ли уже переменная API_URL
var API_URL = (typeof API_URL !== 'undefined') ? API_URL : 'http://localhost:3000/api';

// Глобальное состояние приложения
const AppState = {
    currentUser: JSON.parse(localStorage.getItem('current_user')) || null,
    workouts: [],
    completedWorkouts: []
};

// === ФУНКЦИИ ДЛЯ УВЕДОМЛЕНИЙ О СМЕНЕ ТЕМЫ ===

// Показать уведомление о смене темы
function showThemeNotification(themeName) {
    // Удаляем старые уведомления о смене темы
    const oldNotifications = document.querySelectorAll('.theme-notification');
    oldNotifications.forEach(notification => notification.remove());
    
    const themeNames = {
        'light': { name: 'Light Theme', icon: 'fa-sun', color: '#fbbf24' },
        'dark': { name: 'Dark Theme', icon: 'fa-moon', color: '#60a5fa' },
        'pink': { name: 'Pink Theme', icon: 'fa-heart', color: '#ec4899' }
    };
    
    const themeInfo = themeNames[themeName] || themeNames.light;
    
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 25px;
        z-index: 9998;
        min-width: 250px;
        background: var(--theme-card-bg);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        animation: themeNotificationSlideDown 0.3s ease-out;
        border: 1px solid var(--theme-border);
    `;
    
    notification.innerHTML = `
        <div class="notification-content" style="
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--theme-text);
            background: var(--theme-card-bg);
        ">
            <div class="notification-icon" style="
                font-size: 1.5rem;
                color: ${themeInfo.color};
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(var(--theme-primary), 0.1);
                border-radius: 50%;
            ">
                <i class="fas ${themeInfo.icon}"></i>
            </div>
            <div class="notification-text" style="
                flex: 1;
                font-weight: 600;
                font-size: 0.95rem;
            ">
                Changed to <strong style="color: ${themeInfo.color};">${themeInfo.name}</strong>
            </div>
            <button class="notification-close" aria-label="Close notification" style="
                background: none;
                border: none;
                color: var(--theme-text-light);
                font-size: 1rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.2s ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Добавляем CSS для анимации и стилей темной темы
    if (!document.querySelector('#theme-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'theme-notification-styles';
        style.textContent = `
            @keyframes themeNotificationSlideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes themeNotificationSlideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }
            
            /* Стили для кнопки темной темы - акцентные и заметные */
            .theme-switcher {
                z-index: 10000;
            }
            
            /* Акцентная кнопка темной темы */
            .theme-switcher .theme-btn[data-theme="dark"] {
                background: linear-gradient(135deg, #1e293b, #334155) !important;
                color: #e2e8f0 !important;
                border: 1px solid #475569 !important;
                font-weight: 700 !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            
            .theme-switcher .theme-btn[data-theme="dark"]:not(.active) {
                background: linear-gradient(135deg, #334155, #475569) !important;
                color: #cbd5e1 !important;
                opacity: 0.9 !important;
                box-shadow: 0 2px 8px rgba(30, 41, 59, 0.3) !important;
            }
            
            .theme-switcher .theme-btn[data-theme="dark"].active {
                background: linear-gradient(135deg, #0f172a, #1e293b) !important;
                color: #f1f5f9 !important;
                border-color: #60a5fa !important;
                box-shadow: 0 4px 12px rgba(30, 41, 59, 0.5), 0 0 0 1px rgba(96, 165, 250, 0.3) !important;
                transform: scale(1.05);
            }
            
            .theme-switcher .theme-btn[data-theme="dark"]:hover:not(.active) {
                background: linear-gradient(135deg, #475569, #64748b) !important;
                color: #ffffff !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(30, 41, 59, 0.4) !important;
            }
            
            /* Иконка луны для темной темы */
            .theme-switcher .theme-btn[data-theme="dark"] i {
                color: #93c5fd !important;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
            }
            
            .theme-switcher .theme-btn[data-theme="dark"].active i {
                color: #60a5fa !important;
                filter: drop-shadow(0 0 5px rgba(96, 165, 250, 0.5));
            }
            
            .theme-switcher .theme-btn[data-theme="dark"]:hover:not(.active) i {
                color: #dbeafe !important;
            }
            
            /* Кнопка светлой темы */
            .theme-switcher .theme-btn[data-theme="light"] {
                background: linear-gradient(135deg, #fef3c7, #fde68a) !important;
                color: #92400e !important;
                border: 1px solid #fbbf24 !important;
            }
            
            .theme-switcher .theme-btn[data-theme="light"].active {
                background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
                color: #78350f !important;
                border-color: #d97706 !important;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3) !important;
            }
            
            .theme-switcher .theme-btn[data-theme="light"] i {
                color: #f59e0b !important;
            }
            
            .theme-switcher .theme-btn[data-theme="light"].active i {
                color: #d97706 !important;
            }
            
            /* Кнопка розовой темы */
            .theme-switcher .theme-btn[data-theme="pink"] {
                background: linear-gradient(135deg, #fce7f3, #fbcfe8) !important;
                color: #831843 !important;
                border: 1px solid #f472b6 !important;
            }
            
            .theme-switcher .theme-btn[data-theme="pink"].active {
                background: linear-gradient(135deg, #f472b6, #ec4899) !important;
                color: #500724 !important;
                border-color: #db2777 !important;
                box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3) !important;
            }
            
            .theme-switcher .theme-btn[data-theme="pink"] i {
                color: #ec4899 !important;
            }
            
            .theme-switcher .theme-btn[data-theme="pink"].active i {
                color: #db2777 !important;
            }
            
            /* Общие стили для всех кнопок */
            .theme-switcher .theme-btn {
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 0.85rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 6px;
                min-width: 90px;
                justify-content: center;
                font-weight: 600;
                letter-spacing: 0.3px;
            }
            
            .theme-switcher .theme-btn.active {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
            }
            
            .theme-switcher .theme-btn:hover:not(.active) {
                transform: translateY(-2px);
            }
            
            .theme-switcher .theme-btn i {
                font-size: 1rem;
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Обработчик закрытия уведомления
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'themeNotificationSlideUp 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'themeNotificationSlideUp 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Сохранение выбранной темы в localStorage
function saveTheme(themeName) {
    localStorage.setItem('theme', themeName);  // ИСПРАВЛЕНО: было 'preferredTheme'
}

// Загрузка сохраненной темы из localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');  // ИСПРАВЛЕНО: было 'preferredTheme'
    if (savedTheme) {
        applyTheme(savedTheme);
        updateThemeButtons(savedTheme);
        return savedTheme;
    }
    
    // Если тема не сохранена, проверяем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
        return 'dark';
    }
    
    applyTheme('light');
    return 'light';
}

// Применение темы к документу
function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);
    saveTheme(themeName);
}

// Обновление активной кнопки темы
function updateThemeButtons(activeTheme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        if (theme === activeTheme) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            // Обновляем иконки
            const icon = btn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-moon me-1';
                    icon.style.color = '#60a5fa';
                }
            }
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// Инициализация переключателя тем
function initThemeSwitcher() {
    // Загружаем сохраненную тему
    const currentTheme = loadTheme();
    
    // Обработчики для кнопок переключения тем
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            updateThemeButtons(theme);
            
            // Показываем уведомление о смене темы
            showThemeNotification(theme);
        });
    });
    
    // Слушаем изменения системной темы
    if (window.matchMedia) {
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', (e) => {
            // Меняем тему только если пользователь не выбрал ее вручную
            const savedTheme = localStorage.getItem('theme');  // ИСПРАВЛЕНО: было 'preferredTheme'
            if (!savedTheme) {
                const theme = e.matches ? 'dark' : 'light';
                applyTheme(theme);
                updateThemeButtons(theme);
                showThemeNotification(theme);
            }
        });
    }
    
    return currentTheme;
}

// === ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ ===

// Вспомогательные функции для уведомлений
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldAlerts = document.querySelectorAll('.custom-alert');
    oldAlerts.forEach(alert => alert.remove());
    
    // Создаем новое уведомление
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;
    
    const icon = type === 'success' ? '✓' : type === 'danger' ? '✗' : 'ℹ';
    alertDiv.innerHTML = `
        <strong>${icon} ${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Загрузка тренировок
async function fetchWorkouts(filters = {}) {
    try {
        const response = await fetch(`${API_URL}/workouts`);
        if (!response.ok) throw new Error('Failed to fetch workouts');
        
        let workouts = await response.json();
        
        // Применяем фильтры
        if (filters.type && filters.type !== 'all') {
            workouts = workouts.filter(w => w.type === filters.type);
        }
        
        if (filters.level && filters.level !== 'all') {
            workouts = workouts.filter(w => w.level === filters.level);
        }
        
        AppState.workouts = workouts;
        return workouts;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        showNotification('Failed to load workouts', 'danger');
        return [];
    }
}

// Регистрация пользователя
async function handleRegistration() {
    const firstName = document.getElementById('firstNameInput')?.value.trim();
    const lastName = document.getElementById('lastNameInput')?.value.trim();
    const email = document.getElementById('emailInput')?.value.trim();
    const password = document.getElementById('passwordInput')?.value.trim();

    if (!firstName || !lastName || !email || !password) {
        return showNotification('Fill out all fields!', 'danger');
    }

    if (!isValidEmail(email)) {
        return showNotification('Please enter a valid email address!', 'danger');
    }

    if (password.length < 6) {
        return showNotification('Password must be at least 6 characters long!', 'danger');
    }

    try {
        // Проверяем, не зарегистрирован ли уже пользователь
        const checkResponse = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
        const existingUsers = await checkResponse.json();
        
        if (existingUsers.length > 0) {
            return showNotification('User with this email already exists!', 'danger');
        }

        // Регистрируем нового пользователя
        const registerResponse = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });

        if (!registerResponse.ok) {
            throw new Error('Failed to register user');
        }

        const createdUser = await registerResponse.json();
        
        // Автоматически входим
        AppState.currentUser = createdUser;
        localStorage.setItem('current_user', JSON.stringify(createdUser));
        updateAuthUI();
        
        showNotification('Registration successful!', 'success');
        
        // Закрываем модальное окно если оно есть
        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        if (modal) modal.hide();
        
        // Перенаправляем на профиль
        setTimeout(() => {
            window.location.href = 'pages/profile.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.', 'danger');
    }
}

// Вход пользователя
async function handleLogin() {
    const emailInput = document.getElementById('loginEmailInput') || document.getElementById('emailInput');
    const passwordInput = document.getElementById('loginPasswordInput') || document.getElementById('passwordInput');
    
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!email || !password) {
        return showNotification('Enter your credentials!', 'danger');
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const user = await response.json();
        
        // Сохраняем пользователя
        AppState.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        updateAuthUI();
        
        showNotification('Login successful!', 'success');
        
        // Закрываем модальное окно если оно есть
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
        
        // Перенаправляем на профиль
        setTimeout(() => {
            const isInPagesFolder = window.location.pathname.includes('/pages/');
            const profilePath = isInPagesFolder ? 'profile.html' : 'pages/profile.html';
            window.location.href = profilePath;
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        showNotification('Invalid email or password', 'danger');
    }
}

// Выход
function handleLogout() {
    AppState.currentUser = null;
    localStorage.removeItem('current_user');
    updateAuthUI();
    showNotification('Logged out successfully!', 'success');
    
    if (window.location.pathname.includes('profile.html')) {
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}

// Получение выполненных тренировок
async function fetchCompletedWorkouts() {
    try {
        // Для всех пользователей используем localStorage
        const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
        AppState.completedWorkouts = completedWorkouts;
        return completedWorkouts;
    } catch (error) {
        console.error('Error fetching completed workouts:', error);
        return [];
    }
}

// Отметка тренировки как выполненной
async function markWorkoutCompleted(workoutId, workoutName = '', workoutLevel = 'intermediate') {
    try {
        const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
        
        // Проверяем, не была ли уже отмечена эта тренировка
        const alreadyCompleted = completedWorkouts.find(item => item.id == workoutId);
        
        if (!alreadyCompleted) {
            // Добавляем тренировку
            completedWorkouts.push({
                id: workoutId,
                name: workoutName,
                level: workoutLevel,
                date: new Date().toISOString(),
                completedDate: new Date().toISOString()
            });
            
            // Сохраняем в localStorage
            localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
            AppState.completedWorkouts = completedWorkouts;
            
            showNotification('Workout marked as completed!', 'success');
            return true;
        } else {
            showNotification('You have already completed this workout!', 'info');
            return false;
        }
    } catch (error) {
        console.error('Error marking workout as completed:', error);
        showNotification('Failed to mark workout as completed', 'danger');
        return false;
    }
}

// Обновление UI в зависимости от авторизации
function updateAuthUI() {
    // Обновляем навигацию
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navRegisterBtn = document.getElementById('navRegisterBtn');
    const navProfileBtn = document.getElementById('navProfileBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');
    const mainRegisterBtn = document.getElementById('mainRegisterBtn');
    
    if (AppState.currentUser) {
        // Пользователь авторизован
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navRegisterBtn) navRegisterBtn.style.display = 'none';
        if (navProfileBtn) {
            navProfileBtn.style.display = 'inline-block';
            navProfileBtn.innerHTML = `<i class="fas fa-user"></i> ${AppState.currentUser.firstName}`;
        }
        if (navLogoutBtn) navLogoutBtn.style.display = 'inline-block';
        
        // Обновляем главную кнопку
        if (mainRegisterBtn) {
            mainRegisterBtn.innerHTML = '<i class="fas fa-dumbbell me-2"></i>Start Training';
            mainRegisterBtn.onclick = function() {
                window.location.href = 'pages/workouts.html';
            };
        }
    } else {
        // Гость
        if (navLoginBtn) navLoginBtn.style.display = 'inline-block';
        if (navRegisterBtn) navRegisterBtn.style.display = 'inline-block';
        if (navProfileBtn) {
            navProfileBtn.style.display = 'inline-block';
            navProfileBtn.innerHTML = '<i class="fas fa-user"></i> Profile';
        }
        if (navLogoutBtn) navLogoutBtn.style.display = 'none';
        
        // Обновляем главную кнопку
        if (mainRegisterBtn) {
            mainRegisterBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Get Started - Register Now';
            mainRegisterBtn.onclick = function() {
                const modal = new bootstrap.Modal(document.getElementById('registerModal'));
                modal.show();
            };
        }
    }
}

function initModals() {
    // Регистрация обработчиков для кнопок в навигации
    const loginBtn = document.getElementById('navLoginBtn');
    const registerBtn = document.getElementById('navRegisterBtn');
    const profileBtn = document.getElementById('navProfileBtn');
    const logoutBtn = document.getElementById('navLogoutBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('registerModal'));
            modal.show();
        });
    }
    
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            if (!AppState.currentUser) {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById('loginModal'));
                modal.show();
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Загрузка всех тренировок
async function loadAllWorkouts() {
    try {
        const workouts = await fetchWorkouts();
        await fetchCompletedWorkouts();
        return workouts;
    } catch (error) {
        console.error('Error loading workouts:', error);
        return [];
    }
}

// Отображение тренировок
function displayWorkouts(workouts, containerId = 'workoutContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (workouts.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No workouts found</div></div>';
        return;
    }
    
    workouts.forEach(workout => {
        const isCompleted = AppState.completedWorkouts.some(cw => cw.id == workout.id);
        
        const workoutCard = document.createElement('div');
        workoutCard.className = 'col-md-4 mb-4';
        workoutCard.innerHTML = `
            <div class="card glass-card h-100">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${workout.name}</h5>
                    <p class="card-text flex-grow-1">${workout.description}</p>
                    <div class="mb-2">
                        <span class="badge bg-light-blue">${workout.type}</span>
                        <span class="badge bg-info">${workout.level}</span>
                        <span class="badge bg-secondary">${workout.duration}</span>
                    </div>
                    <div class="workout-info mb-2">
                        <p class="mb-1"><strong>Calories:</strong> ${workout.calories}</p>
                        <p class="mb-3"><strong>Equipment:</strong> ${workout.equipment}</p>
                    </div>
                    ${isCompleted ? 
                        '<span class="badge bg-success mb-3">✓ Completed</span>' : 
                        `<button class="btn btn-outline-success btn-sm mb-3 mark-workout-btn" data-id="${workout.id}" data-name="${workout.name}" data-level="${workout.level}">
                            Mark as Completed
                        </button>`
                    }
                    <a href="workout-details.html?id=${workout.id}" class="btn btn-form-primary mt-auto">View Details</a>
                </div>
            </div>
        `;
        container.appendChild(workoutCard);
    });
    
    // Добавляем обработчики для кнопок отметки
    document.querySelectorAll('.mark-workout-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const workoutId = this.getAttribute('data-id');
            const workoutName = this.getAttribute('data-name');
            const workoutLevel = this.getAttribute('data-level');
            
            const success = await markWorkoutCompleted(workoutId, workoutName, workoutLevel);
            if (success) {
                this.outerHTML = '<span class="badge bg-success mb-3">✓ Completed</span>';
                
                // Обновляем прогресс если на странице профиля
                if (window.location.pathname.includes('profile.html')) {
                    loadProfile();
                }
            }
        });
    });
}

// Фильтрация тренировок
function filterWorkouts(workouts, filters) {
    let filtered = workouts;
    
    if (filters.level && filters.level !== 'all') {
        filtered = filtered.filter(w => w.level === filters.level);
    }
    
    if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(w => w.type === filters.type);
    }
    
    if (filters.duration && filters.duration !== 'all') {
        filtered = filtered.filter(w => w.duration === filters.duration);
    }
    
    return filtered;
}

// Загрузка профиля
async function loadProfile() {
    try {
        await fetchWorkouts();
        await fetchCompletedWorkouts();
        
        // Обновляем информацию о пользователе
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (AppState.currentUser) {
            if (userNameElement) {
                userNameElement.textContent = `${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`;
            }
            if (userEmailElement) {
                userEmailElement.textContent = AppState.currentUser.email;
            }
        } else {
            if (userNameElement) userNameElement.textContent = 'Guest User';
            if (userEmailElement) userEmailElement.textContent = 'Not logged in';
        }
        
        updateProfileProgress();
        
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Обновление прогресса в профиле
function updateProfileProgress() {
    const completedCount = AppState.completedWorkouts.length;
    
    // Обновляем элементы статистики
    const completedElement = document.getElementById('completedWorkoutsCount') || document.getElementById('workoutsCount');
    const progressElement = document.getElementById('progressPercentage') || document.getElementById('consistencyRate');
    const progressBar = document.getElementById('progressBar') || document.getElementById('workoutsProgressBar');
    
    if (completedElement) completedElement.textContent = completedCount;
    
    // Рассчитываем процент прогресса (предполагаем цель 10 тренировок)
    const goal = 10;
    const progressPercentage = Math.min(100, Math.round((completedCount / goal) * 100));
    
    if (progressElement) progressElement.textContent = `${progressPercentage}%`;
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        progressBar.textContent = `${completedCount}/${goal}`;
    }
    
    // Отображаем список выполненных тренировок
    displayCompletedWorkoutsList();
}

// Отображение списка выполненных тренировок
function displayCompletedWorkoutsList() {
    const container = document.getElementById('completedWorkoutsList');
    if (!container) return;
    
    if (AppState.completedWorkouts.length === 0) {
        container.innerHTML = `
            <div id="emptyCompletedWorkouts">
                <i class="fas fa-dumbbell"></i>
                <p class="text-muted">No completed workouts yet.</p>
                <p>Complete workouts to see them here!</p>
                <a href="workouts.html" class="btn btn-sm btn-form-primary">Browse Workouts</a>
            </div>
        `;
        return;
    }
    
    let html = '<div class="list-group">';
    
    // Сортируем по дате (новые сверху)
    const sortedWorkouts = [...AppState.completedWorkouts].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    sortedWorkouts.forEach(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Определяем класс для бейджа уровня
        let levelBadgeClass = 'level-beginner';
        if (item.level === 'intermediate') levelBadgeClass = 'level-intermediate';
        if (item.level === 'advanced') levelBadgeClass = 'level-advanced';
        
        html += `
            <div class="completed-workout-item">
                <h6>${item.name || 'Workout'}</h6>
                <div class="d-flex align-items-center">
                    <span class="level-badge ${levelBadgeClass} me-2">${item.level || 'intermediate'}</span>
                    <small>${formattedDate} at ${formattedTime}</small>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Инициализация страницы тренировок
async function initWorkoutsPage() {
    try {
        const workouts = await loadAllWorkouts();
        displayWorkouts(workouts);
        
        // Инициализируем фильтры если они есть
        const levelFilter = document.getElementById('levelFilter');
        const typeFilter = document.getElementById('typeFilter');
        const durationFilter = document.getElementById('durationFilter');
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn && levelFilter && typeFilter) {
            applyBtn.addEventListener('click', async () => {
                const filters = {
                    level: levelFilter.value || 'all',
                    type: typeFilter.value || 'all',
                    duration: durationFilter ? durationFilter.value : 'all'
                };
                
                const filtered = filterWorkouts(workouts, filters);
                displayWorkouts(filtered);
            });
        }
        
        if (resetBtn && levelFilter && typeFilter) {
            resetBtn.addEventListener('click', () => {
                if (levelFilter) levelFilter.value = 'all';
                if (typeFilter) typeFilter.value = 'all';
                if (durationFilter) durationFilter.value = 'all';
                displayWorkouts(workouts);
            });
        }
        
    } catch (error) {
        console.error('Error initializing workouts page:', error);
        showNotification('Failed to load workouts', 'danger');
    }
}

// === ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized, current user:', AppState.currentUser);
    
    // Обновляем UI авторизации
    updateAuthUI();
    
    // Инициализируем переключатель тем (ДОБАВЛЕНО)
    initThemeSwitcher();
    
    // Определяем текущую страницу и загружаем соответствующие данные
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        // Главная страница
        initModals();
        
    } else if (path.includes('workouts.html') && !path.includes('workout-details')) {
        // Страница всех тренировок - не инициализируем здесь, т.к. есть свой скрипт
        
    } else if (path.includes('profile.html')) {
        // Страница профиля
        loadProfile();
        
    } else if (path.includes('workout-details.html')) {
        // Страница деталей тренировки - не инициализируем здесь
    }
});

// Экспортируем функции для глобального использования
window.handleRegistration = handleRegistration;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.markWorkoutCompleted = markWorkoutCompleted;
window.updateAuthUI = updateAuthUI;
window.loadProfile = loadProfile;
window.showNotification = showNotification;