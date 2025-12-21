// API URL
const API_URL = 'http://localhost:3000/api';


// Глобальное состояние приложения
const AppState = {
    currentUser: JSON.parse(localStorage.getItem('current_user')) || null,
    workouts: [],
    completedWorkouts: JSON.parse(localStorage.getItem('completedWorkouts')) || []
};


// Вспомогательные функции для уведомлений
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldAlerts = document.querySelectorAll('.custom-alert');
    oldAlerts.forEach(alert => alert.remove());
   
    // Определяем иконку и цвет
    const icons = {
        success: '✓',
        danger: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
   
    const bgColors = {
        success: 'alert-success',
        danger: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
    };
   
    // Создаем новое уведомление
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert ${bgColors[type]} alert-dismissible fade show position-fixed`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.setAttribute('aria-live', 'assertive');
    alertDiv.setAttribute('aria-atomic', 'true');
    alertDiv.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    `;
   
    alertDiv.innerHTML = `
        <span class="visually-hidden">${type} notification: </span>
        <strong>${icons[type]} ${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close notification"></button>
    `;
   
    document.body.appendChild(alertDiv);
   
    // Анонсируем уведомление для скринридеров
    announceToScreenReader(message);
   
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}


// Анонсировать сообщение для скринридеров
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
   
    document.body.appendChild(announcement);
   
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.remove();
        }
    }, 1000);
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Улучшенная функция fetch с обработкой ошибок доступности
async function fetchWithAccessibility(url, options = {}) {
    try {
        const response = await fetch(url, options);
       
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
       
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
       
        // Анонсируем ошибку для скринридеров
        announceToScreenReader('Error loading data. Please try again.');
       
        throw error;
    }
}


async function fetchWorkouts(filters = {}) {
    try {
        const workouts = await fetchWithAccessibility(`${API_URL}/workouts`);
       
        // Применяем фильтры
        let filteredWorkouts = workouts;
        if (filters.type && filters.type !== 'all') {
            filteredWorkouts = filteredWorkouts.filter(w => w.type === filters.type);
        }
       
        if (filters.level && filters.level !== 'all') {
            filteredWorkouts = filteredWorkouts.filter(w => w.level === filters.level);
        }
       
        AppState.workouts = filteredWorkouts;
       
        // Обновляем aria-live область если существует
        updateWorkoutCountAnnouncement(filteredWorkouts.length);
       
        return filteredWorkouts;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        showNotification('Failed to load workouts', 'danger');
        return [];
    }
}


// Обновление объявления о количестве тренировок
function updateWorkoutCountAnnouncement(count) {
    const announcement = document.getElementById('workout-count-announcement');
    if (announcement) {
        announcement.textContent = `${count} workouts found`;
    }
}


// Регистрация пользователя с улучшенной доступностью
async function handleRegistration() {
    const firstName = document.getElementById('firstNameInput')?.value.trim();
    const lastName = document.getElementById('lastNameInput')?.value.trim();
    const email = document.getElementById('emailInput')?.value.trim();
    const password = document.getElementById('passwordInput')?.value.trim();
   
    // Установка aria-invalid при ошибках
    const firstNameInput = document.getElementById('firstNameInput');
    const lastNameInput = document.getElementById('lastNameInput');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
   
    // Сброс состояния ошибок
    [firstNameInput, lastNameInput, emailInput, passwordInput].forEach(input => {
        if (input) {
            input.setAttribute('aria-invalid', 'false');
        }
    });
   
    // Валидация
    let hasError = false;
   
    if (!firstName) {
        showNotification('First name is required!', 'danger');
        if (firstNameInput) {
            firstNameInput.setAttribute('aria-invalid', 'true');
            firstNameInput.focus();
        }
        hasError = true;
    }
   
    if (!lastName && !hasError) {
        showNotification('Last name is required!', 'danger');
        if (lastNameInput) {
            lastNameInput.setAttribute('aria-invalid', 'true');
            lastNameInput.focus();
        }
        hasError = true;
    }
   
    if (!email && !hasError) {
        showNotification('Email is required!', 'danger');
        if (emailInput) {
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.focus();
        }
        hasError = true;
    } else if (!isValidEmail(email) && !hasError) {
        showNotification('Please enter a valid email address!', 'danger');
        if (emailInput) {
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.focus();
        }
        hasError = true;
    }
   
    if (!password && !hasError) {
        showNotification('Password is required!', 'danger');
        if (passwordInput) {
            passwordInput.setAttribute('aria-invalid', 'true');
            passwordInput.focus();
        }
        hasError = true;
    } else if (password.length < 6 && !hasError) {
        showNotification('Password must be at least 6 characters long!', 'danger');
        if (passwordInput) {
            passwordInput.setAttribute('aria-invalid', 'true');
            passwordInput.focus();
        }
        hasError = true;
    }
   
    if (hasError) return;
   
    try {
        // Проверяем, не зарегистрирован ли уже пользователь
        const existingUsers = await fetchWithAccessibility(`${API_URL}/users?email=${encodeURIComponent(email)}`);
       
        if (existingUsers.length > 0) {
            showNotification('User with this email already exists!', 'danger');
            if (emailInput) {
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.focus();
            }
            return;
        }
       
        // Регистрируем нового пользователя
        const createdUser = await fetchWithAccessibility(`${API_URL}/users`, {
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
       
        // Автоматически входим
        AppState.currentUser = createdUser;
        localStorage.setItem('current_user', JSON.stringify(createdUser));
        updateAuthUI();
       
        showNotification('Registration successful! You are now logged in.', 'success');
       
        // Анонсируем успешную регистрацию для скринридеров
        announceToScreenReader(`Welcome ${firstName}! Your account has been created successfully.`);
       
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


// Вход пользователя с улучшенной доступностью
async function handleLogin() {
    const email = document.getElementById('loginEmailInput')?.value.trim();
    const password = document.getElementById('loginPasswordInput')?.value.trim();
   
    const emailInput = document.getElementById('loginEmailInput');
    const passwordInput = document.getElementById('loginPasswordInput');
   
    // Сброс состояния ошибок
    if (emailInput) emailInput.setAttribute('aria-invalid', 'false');
    if (passwordInput) passwordInput.setAttribute('aria-invalid', 'false');
   
    if (!email) {
        showNotification('Email is required!', 'danger');
        if (emailInput) {
            emailInput.setAttribute('aria-invalid', 'true');
            emailInput.focus();
        }
        return;
    }
   
    if (!password) {
        showNotification('Password is required!', 'danger');
        if (passwordInput) {
            passwordInput.setAttribute('aria-invalid', 'true');
            passwordInput.focus();
        }
        return;
    }
   
    try {
        const user = await fetchWithAccessibility(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
       
        // Сохраняем пользователя
        AppState.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        updateAuthUI();
       
        showNotification(`Welcome back, ${user.firstName}!`, 'success');
       
        // Анонсируем вход для скринридеров
        announceToScreenReader(`Successfully logged in as ${user.firstName} ${user.lastName}`);
       
        // Закрываем модальное окно если оно есть
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        if (modal) modal.hide();
       
        // Перенаправляем на профиль
        setTimeout(() => {
            window.location.href = 'pages/profile.html';
        }, 1000);
       
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Invalid email or password', 'danger');
       
        // Устанавливаем aria-invalid
        if (emailInput) emailInput.setAttribute('aria-invalid', 'true');
        if (passwordInput) passwordInput.setAttribute('aria-invalid', 'true');
       
        // Фокусируемся на поле email
        if (emailInput) {
            emailInput.focus();
        }
    }
}


// Выход с улучшенной доступностью
function handleLogout() {
    const userName = AppState.currentUser?.firstName || 'User';
    AppState.currentUser = null;
    localStorage.removeItem('current_user');
    updateAuthUI();
   
    showNotification('Logged out successfully!', 'success');
    announceToScreenReader(`${userName} has been logged out successfully.`);
   
    if (window.location.pathname.includes('profile.html')) {
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
    }
}


// Обновление UI в зависимости от авторизации
function updateAuthUI() {
    // Обновляем навигацию если она существует
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
            navProfileBtn.innerHTML = `<i class="fas fa-user" aria-hidden="true"></i> <span>${AppState.currentUser.firstName}</span>`;
            navProfileBtn.setAttribute('aria-label', `Go to ${AppState.currentUser.firstName}'s profile`);
        }
        if (navLogoutBtn) {
            navLogoutBtn.style.display = 'inline-block';
            navLogoutBtn.setAttribute('aria-label', 'Log out from your account');
        }
       
        // Обновляем главную кнопку
        if (mainRegisterBtn) {
            mainRegisterBtn.innerHTML = '<i class="fas fa-dumbbell me-2" aria-hidden="true"></i>Start Training';
            mainRegisterBtn.setAttribute('aria-label', 'Browse available workouts');
            mainRegisterBtn.onclick = function() {
                window.location.href = 'pages/workouts.html';
            };
        }
    } else {
        // Гость
        if (navLoginBtn) {
            navLoginBtn.style.display = 'inline-block';
            navLoginBtn.setAttribute('aria-label', 'Open login form');
        }
        if (navRegisterBtn) {
            navRegisterBtn.style.display = 'inline-block';
            navRegisterBtn.setAttribute('aria-label', 'Open registration form');
        }
        if (navProfileBtn) {
            navProfileBtn.style.display = 'inline-block';
            navProfileBtn.innerHTML = '<i class="fas fa-user" aria-hidden="true"></i> Profile';
            navProfileBtn.setAttribute('aria-label', 'Go to profile page (requires login)');
        }
        if (navLogoutBtn) navLogoutBtn.style.display = 'none';
       
        // Обновляем главную кнопку
        if (mainRegisterBtn) {
            mainRegisterBtn.innerHTML = '<i class="fas fa-user-plus me-2" aria-hidden="true"></i>Get Started - Register Now';
            mainRegisterBtn.setAttribute('aria-label', 'Open registration form to get started');
            mainRegisterBtn.onclick = function() {
                const modal = new bootstrap.Modal(document.getElementById('registerModal'));
                modal.show();
            };
        }
    }
}


// Инициализация модальных окон
function initModals() {
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


// Отображение тренировок с улучшенной доступностью и едиными шрифтами
function displayWorkouts(workouts, containerId = 'workoutContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
   
    container.innerHTML = '';
   
    if (workouts.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info" role="alert" aria-live="polite">
                    <i class="fas fa-info-circle me-2" aria-hidden="true"></i>
                    No workouts found. Try adjusting your filters.
                </div>
            </div>
        `;
        return;
    }
   
    // Обновляем скрытый элемент с количеством тренировок
    const workoutCountAnnouncement = document.getElementById('workout-count-announcement');
    if (workoutCountAnnouncement) {
        workoutCountAnnouncement.textContent = `${workouts.length} workouts found`;
    }
   
    // Используем grid для 3 карточек в ряд
    container.innerHTML = '<div class="workouts-grid" role="list"></div>';
    const grid = container.querySelector('.workouts-grid');
   
    workouts.forEach(workout => {
        const isCompleted = AppState.completedWorkouts.some(cw => cw.id === workout.id);
       
        // Определяем цвет бейджа уровня
        let levelBadgeClass = 'badge-secondary';
        let levelText = workout.level || 'intermediate';
       
        if (levelText === 'beginner') levelBadgeClass = 'badge-beginner';
        if (levelText === 'intermediate') levelBadgeClass = 'badge-intermediate';
        if (levelText === 'advanced') levelBadgeClass = 'badge-advanced';
       
        const durationText = workout.duration === 'short' ? '20 min' :
                            workout.duration === 'medium' ? '30 min' :
                            workout.duration === 'long' ? '45 min' : '30 min';
       
        const workoutCard = document.createElement('article');
        workoutCard.className = 'workout-card-uniform';
        workoutCard.setAttribute('role', 'listitem');
        workoutCard.setAttribute('aria-labelledby', `workout-title-${workout.id}`);
       
        workoutCard.innerHTML = `
            <!-- Изображение -->
            <div class="workout-image-container">
                <img src="${workout.image || 'http://localhost:3000/images/workout.jpg'}"
                     class="workout-image"
                     alt="${workout.name} - ${workout.type} workout"
                     onerror="this.onerror=null; this.src='http://localhost:3000/images/workout.jpg';"
                     loading="lazy"
                     width="400"
                     height="200">
            </div>
           
            <!-- Контент карточки -->
            <div class="workout-card-body">
                <!-- Заголовок и бейдж уровня -->
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h3 id="workout-title-${workout.id}" class="workout-title elegant-heading">${workout.name}</h3>
                    <span class="workout-badge ${levelBadgeClass}" aria-label="Difficulty level: ${levelText}">
                        ${levelText}
                    </span>
                </div>
               
                <!-- Описание с таким же шрифтом как заголовок -->
                <p class="workout-description elegant-text">${workout.description || 'A great workout for your fitness goals.'}</p>
               
                <!-- Бейджи -->
                <div class="workout-badges mb-2">
                    <span class="workout-badge badge-type" aria-label="Workout type: ${workout.type}">
                        ${workout.type || 'Workout'}
                    </span>
                    <span class="workout-badge badge-duration" aria-label="Duration: ${durationText}">
                        ${durationText}
                    </span>
                </div>
               
                <!-- Мета-информация -->
                <div class="workout-info mb-2">
                    <div class="workout-meta-item">
                        <i class="fas fa-fire" aria-hidden="true"></i>
                        <span><strong>Calories:</strong> ${workout.calories || '300-400'}</span>
                    </div>
                    <div class="workout-meta-item">
                        <i class="fas fa-dumbbell" aria-hidden="true"></i>
                        <span><strong>Equipment:</strong> ${workout.equipment || 'None required'}</span>
                    </div>
                </div>
               
                <!-- Кнопка отметки и деталей -->
                ${isCompleted ?
                    `<span class="badge bg-success mb-2" aria-label="This workout has been completed">
                        <i class="fas fa-check" aria-hidden="true"></i> Completed
                    </span>` :
                    `<button class="btn btn-outline-success btn-sm mb-2 mark-workout-btn"
                            data-id="${workout.id}"
                            data-name="${workout.name}"
                            data-level="${workout.level}"
                            aria-label="Mark '${workout.name}' as completed">
                        Mark as Completed
                    </button>`
                }
               
                <!-- Кнопка View Details (контрастная) -->
                <a href="workout-details.html?id=${workout.id}"
                   class="btn-view-details-uniform mt-auto"
                   aria-label="View details for ${workout.name}">
                    <i class="fas fa-info-circle me-1" aria-hidden="true"></i>View Details
                </a>
            </div>
        `;
       
        grid.appendChild(workoutCard);
    });
   
    // Добавляем обработчики для кнопок отметки
    document.querySelectorAll('.mark-workout-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const workoutId = this.getAttribute('data-id');
            const workoutName = this.getAttribute('data-name');
            const workoutLevel = this.getAttribute('data-level');
           
            const success = await markWorkoutCompleted(workoutId, workoutName, workoutLevel);
            if (success) {
                // Обновляем кнопку на бейдж
                this.outerHTML = `<span class="badge bg-success mb-2" aria-label="${workoutName} has been completed">
                    <i class="fas fa-check" aria-hidden="true"></i> Completed
                </span>`;
               
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


// Загрузка профиля с улучшенной доступностью
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
                userNameElement.setAttribute('aria-label', `User: ${AppState.currentUser.firstName} ${AppState.currentUser.lastName}`);
            }
            if (userEmailElement) {
                userEmailElement.textContent = AppState.currentUser.email;
            }
        } else {
            if (userNameElement) {
                userNameElement.textContent = 'Guest User';
                userNameElement.setAttribute('aria-label', 'Guest user profile');
            }
            if (userEmailElement) {
                userEmailElement.textContent = 'Not logged in';
            }
        }
       
        updateProfileProgress();
       
        // Анонсируем загрузку профиля
        announceToScreenReader('Profile data loaded successfully.');
       
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification('Failed to load profile data', 'danger');
    }
}


// Обновление прогресса в профиле
function updateProfileProgress() {
    const completedCount = AppState.completedWorkouts.length;
   
    // Обновляем элементы статистики
    const completedElement = document.getElementById('completedWorkoutsCount');
    const progressElement = document.getElementById('progressPercentage');
    const progressBar = document.getElementById('progressBar');
   
    if (completedElement) {
        completedElement.textContent = completedCount;
        completedElement.setAttribute('aria-label', `${completedCount} workouts completed`);
    }
   
    // Рассчитываем процент прогресса
    const goal = 10;
    const progressPercentage = Math.min(100, Math.round((completedCount / goal) * 100));
   
    if (progressElement) {
        progressElement.textContent = `${progressPercentage}%`;
        progressElement.setAttribute('aria-label', `${progressPercentage}% progress towards goal`);
    }
   
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.setAttribute('aria-label', `Progress: ${progressPercentage}%`);
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
            <div class="text-center" aria-live="polite">
                <p class="text-muted" role="status">No completed workouts yet.</p>
                <p class="elegant-text">Complete workouts to see them here!</p>
                <a href="workouts.html" class="btn btn-sm btn-form-primary" aria-label="Browse available workouts">
                    <i class="fas fa-dumbbell me-1" aria-hidden="true"></i>Browse Workouts
                </a>
            </div>
        `;
        return;
    }
   
    let html = '<div class="list-group" role="list" aria-label="Completed workouts">';
   
    // Сортируем по дате (новые сверху)
    const sortedWorkouts = [...AppState.completedWorkouts].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
    );
   
    sortedWorkouts.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
       
        // Определяем цвет бейджа уровня
        let levelBadgeClass = 'bg-secondary';
        let levelText = item.level || 'intermediate';
       
        if (levelText === 'beginner') levelBadgeClass = 'bg-success';
        if (levelText === 'intermediate') levelBadgeClass = 'bg-warning text-dark';
        if (levelText === 'advanced') levelBadgeClass = 'bg-danger';
       
        html += `
            <div class="list-group-item border-0 mb-2 p-3"
                 role="listitem"
                 aria-label="Workout: ${item.name}, Level: ${levelText}, Completed: ${formattedDate}"
                 style="background: rgba(44, 82, 130, 0.05);">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 elegant-heading">${item.name || 'Completed Workout'}</h6>
                        <div class="d-flex align-items-center">
                            <span class="badge ${levelBadgeClass} me-2" aria-label="Difficulty level: ${levelText}">
                                ${levelText}
                            </span>
                            <small class="text-muted elegant-text">
                                <i class="far fa-calendar me-1" aria-hidden="true"></i>
                                ${formattedDate} at ${formattedTime}
                            </small>
                        </div>
                    </div>
                    <div class="text-end ms-3">
                        <span class="badge bg-success" aria-label="Status: Completed">
                            <i class="fas fa-check-circle me-1" aria-hidden="true"></i>
                            Completed
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
   
    html += '</div>';
    container.innerHTML = html;
}


// Функция для загрузки выполненных тренировок
async function fetchCompletedWorkouts() {
    try {
        // В реальном приложении здесь был бы API запрос
        // Для демо используем localStorage
        const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
        AppState.completedWorkouts = completedWorkouts;
        return completedWorkouts;
    } catch (error) {
        console.error('Error fetching completed workouts:', error);
        return [];
    }
}


// Функция для отметки тренировки как выполненной
async function markWorkoutCompleted(workoutId, workoutName, workoutLevel) {
    try {
        const completedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts')) || [];
       
        const alreadyCompleted = completedWorkouts.find(item => item.id == workoutId);
       
        if (!alreadyCompleted) {
            const completedWorkout = {
                id: workoutId,
                name: workoutName,
                level: workoutLevel,
                date: new Date().toISOString(),
                completed: true
            };
           
            completedWorkouts.push(completedWorkout);
            localStorage.setItem('completedWorkouts', JSON.stringify(completedWorkouts));
           
            AppState.completedWorkouts = completedWorkouts;
           
            showNotification(`"${workoutName}" marked as completed!`, 'success');
            announceToScreenReader(`Workout "${workoutName}" has been marked as completed.`);
           
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


// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized, current user:', AppState.currentUser);
   
    // Обновляем UI авторизации
    updateAuthUI();
   
    // Определяем текущую страницу и загружаем соответствующие данные
    const path = window.location.pathname;
   
    if (path.includes('index.html') || path === '/') {
        // Главная страница
        initModals();
       
    } else if (path.includes('workouts.html')) {
        // Страница всех тренировок
        initWorkoutsPage();
       
    } else if (path.includes('profile.html')) {
        // Страница профиля
        loadProfile();
       
    } else if (path.includes('workout-details.html')) {
        // Страница деталей тренировки
        // Здесь загружается отдельный скрипт на странице
    }
   
    // Добавляем обработчик для кнопок с клавиатурной навигацией
    document.addEventListener('keydown', function(e) {
        // Обработка Enter и Space для кнопок
        if ((e.key === 'Enter' || e.key === ' ') && e.target.tagName === 'BUTTON') {
            e.preventDefault();
            e.target.click();
        }
    });
});


// Инициализация страницы тренировок
async function initWorkoutsPage() {
    try {
        // Добавляем скрытый элемент для объявления количества тренировок
        if (!document.getElementById('workout-count-announcement')) {
            const announcement = document.createElement('div');
            announcement.id = 'workout-count-announcement';
            announcement.className = 'visually-hidden';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcement);
        }
       
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
               
                // Анонсируем применение фильтров
                announceToScreenReader(`Filters applied. Showing ${filtered.length} workouts.`);
            });
        }
       
        if (resetBtn && levelFilter && typeFilter) {
            resetBtn.addEventListener('click', () => {
                if (levelFilter) levelFilter.value = 'all';
                if (typeFilter) typeFilter.value = 'all';
                if (durationFilter) durationFilter.value = 'all';
                displayWorkouts(workouts);
               
                announceToScreenReader('Filters reset. Showing all workouts.');
            });
        }
       
    } catch (error) {
        console.error('Error initializing workouts page:', error);
        showNotification('Failed to load workouts', 'danger');
    }
}


// Экспорт функций для использования в других файлах
window.handleRegistration = handleRegistration;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.updateAuthUI = updateAuthUI;
window.loadProfile = loadProfile;
window.announceToScreenReader = announceToScreenReader;
window.markWorkoutCompleted = markWorkoutCompleted;
window.fetchCompletedWorkouts = fetchCompletedWorkouts;

