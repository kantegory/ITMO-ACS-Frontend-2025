// Инициализация модальных окон bootstrap
const trainingDetailModal = new bootstrap.Modal(document.getElementById('trainingDetailModal'));
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

const API_URL = 'http://localhost:3000';
let currentUserId = localStorage.getItem('userId'); // Хранение ID пользователя для авторизации

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('d-none');
        section.classList.remove('d-block');
    });

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.remove('d-none');
        pageToShow.classList.add('d-block');

        if (pageId === 'dashboard-page' && currentUserId) {
            loadDashboardData(currentUserId);
        } else if (pageId === 'search-page') {
            loadWorkouts();
        } else if (pageId === 'home-page') {
             loadBlogPosts(); // Загрузка блога на главной странице
        }
    }

    // навигация
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    const activeLink = document.querySelector(`.navbar-nav [data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
    }
}

function showSuccess(message, pageIdToRedirect) {
    document.getElementById('successMessage').textContent = message;
    successModal.show();
    if (pageIdToRedirect) {
        document.getElementById('successModal').addEventListener('hidden.bs.modal', function onModalHidden() {
            showPage(pageIdToRedirect);
            document.getElementById('successModal').removeEventListener('hidden.bs.modal', onModalHidden);
        });
    }
}

function showError(title, message) {
    const modalHeader = document.querySelector('#successModal .modal-header');
    const modalButton = document.querySelector('#successModal .btn-success');
    const iconUse = document.querySelector('#successModal .icon use');
    const iconSvg = document.querySelector('#successModal .icon');
    
    // Заменяем заголовок и сообщение
    document.getElementById('successModalLabel').textContent = title;
    document.getElementById('successMessage').textContent = message;
    
    // Меняем цвета и иконку
    modalHeader.classList.replace('bg-success', 'bg-danger');
    modalButton.classList.replace('btn-success', 'btn-danger');
    
    // Меняем иконку
    if (iconUse) {
        iconUse.setAttribute('href', 'icons.svg#icon-x-circle-fill');
    }
    if (iconSvg) {
        iconSvg.classList.replace('text-success', 'text-danger');
    }
    
    successModal.show();

    // Восстанавливаем оригинальный вид после закрытия
    document.getElementById('successModal').addEventListener('hidden.bs.modal', function onModalHidden() {
        modalHeader.classList.replace('bg-danger', 'bg-success');
        modalButton.classList.replace('btn-danger', 'btn-success');
        
        if (iconUse) {
            iconUse.setAttribute('href', 'icons.svg#icon-check-circle-fill');
        }
        if (iconSvg) {
            iconSvg.classList.replace('text-danger', 'text-success');
        }
        
        document.getElementById('successModal').removeEventListener('hidden.bs.modal', onModalHidden);
    });
}

// Вход
async function handleLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log(`Попытка входа с: ${email}`);

    // Имитация авторизации с Api
    try {
        // Запрос к JSON-серверу для поиска пользователя по email
        const response = await fetch(`${API_URL}/users?email=${email}`);
        const users = await response.json();

        if (users.length === 1 && users[0].password === password) {
            const user = users[0];
            const userName = user.name;
            currentUserId = user.id; // Сохраняем ID для последующих запросов
            localStorage.setItem('userName', userName); 
            localStorage.setItem('userId', currentUserId);

            showSuccess(`Привет, ${userName}! Вы успешно вошли в систему.`, 'dashboard-page');
            document.getElementById('userNameDisplay').textContent = userName;
            
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            showError('Ошибка входа', 'Неверный email или пароль.');
        }
    } catch (error) {
        console.error('Ошибка при входе:', error);
        showError('Ошибка сети', 'Не удалось подключиться к API.');
    }
}

// Регистрация
async function handleRegistration(event) {
    event.preventDefault();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;

    if (password !== passwordConfirm) {
        showError('Ошибка Регистрации', 'Пароли не совпадают! Пожалуйста, проверьте ввод.');
        return;
    }

    console.log(`Попытка регистрации пользователя: ${name}`);
    
    // Имитация регистрации с Api
    const newUser = {
        name,
        email,
        password,
        progress: { weight: 80, weeklyWorkouts: 0, pushupGoal: 0 },
        trainingPlan: []
    };

    try {
        // Проверка, что пользователя с таким email еще нет
        const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
        const existingUsers = await checkResponse.json();
        
        if (existingUsers.length > 0) {
            showError('Ошибка Регистрации', 'Пользователь с таким email уже существует.');
            return;
        }

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (response.ok) {
            showSuccess(`Поздравляем, ${name}! Аккаунт создан. Выполните вход.`, 'login-page');
            document.getElementById('registrationForm').reset();
        } else {
            showError('Ошибка Регистрации', 'Не удалось создать аккаунт.');
        }

    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        showError('Ошибка сети', 'Не удалось подключиться к API.');
    }
}

// Загрузка данных для личного кабинета
async function loadDashboardData(userId) {
    if (!userId) {
        console.error('ID пользователя не найден.');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (!response.ok) throw new Error('Данные пользователя не найдены');
        
        const user = await response.json();
        const progress = user.progress;
        const plan = user.trainingPlan;
        
        document.getElementById('progressWeight').textContent = `${progress.weight} кг`;
        document.getElementById('progressWorkouts').textContent = `${progress.weeklyWorkouts}`;
        document.getElementById('progressGoal').textContent = `${progress.pushupGoal}`;

        const planAccordion = document.getElementById('trainingPlanAccordion');
        planAccordion.innerHTML = '';

        if (plan.length === 0) {
            planAccordion.innerHTML = '<p class="text-muted">План тренировок пока пуст.</p>';
        } else {
            plan.forEach((item, index) => {
                const isShow = index === 0 ? 'show' : '';
                const buttonClass = index === 0 ? 'accordion-button' : 'accordion-button collapsed';
                const html = `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${index}">
                            <button class="${buttonClass}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0}" aria-controls="collapse${index}">
                                ${item.day}: ${item.title}
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${isShow}" aria-labelledby="heading${index}" data-bs-parent="#trainingPlanAccordion">
                            <div class="accordion-body">${item.details}</div>
                        </div>
                    </div>
                `;
                planAccordion.insertAdjacentHTML('beforeend', html);
            });
        }
        
    } catch (error) {
        console.error('Ошибка загрузки личного кабинета:', error);
    }
}

// Шаблон для карточки тренировки
function renderWorkoutCard(workout) {
    const typeBadge = `<span class="badge bg-secondary me-2">${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>`;
    const levelBadge = `<span class="badge bg-secondary me-2">${workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}</span>`;
    const durationBadge = `<span class="badge bg-secondary">${workout.duration} мин</span>`;
    const imgText = workout.type.charAt(0).toUpperCase() + workout.type.slice(1);
    const imgColor = workout.type === 'силовые' ? '3498db' : (workout.type === 'кардио' ? '1abc9c' : '9b59b6');

    return `
        <div class="card mb-3 training-card" data-id="${workout.id}" role="article">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="https://placehold.co/400x250/${imgColor}/ffffff?text=${imgText}" class="img-fluid rounded-start h-100" alt="${workout.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-primary">${workout.title}</h5>
                        <p class="card-text">${workout.description}</p>
                        <p class="card-text">${typeBadge} ${levelBadge} ${durationBadge}</p>
                        <button class="btn btn-outline-brand btn-sm details-btn" data-id="${workout.id}">Подробнее</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Загрузка тренировок с API с фильтрацией
async function loadWorkoutsWithFilters(filters = {}) {
    const resultsContainer = document.getElementById('trainingResults');

    // Показываем состояние загрузки
    resultsContainer.setAttribute('aria-busy', 'true');
    resultsContainer.innerHTML = '<p class="text-center">Поиск тренировок...</p>';

    try {
        // Собираем query-параметры для фильтрации
        const queryParams = new URLSearchParams();

        if (filters.level) queryParams.append('level', filters.level);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.duration) queryParams.append('duration_lte', filters.duration);

        const queryString = queryParams.toString();
        const url = queryString ? `${API_URL}/workouts?${queryString}` : `${API_URL}/workouts`;

        console.log(`Запрос к API: ${url}`);

        const response = await fetch(url);

        if (!response.ok) throw new Error('Не удалось загрузить тренировки');
        
        const workouts = await response.json();

        // Очищаем и заполняем контейнер
        resultsContainer.innerHTML = '';
        
        if (workouts.length === 0) {
            resultsContainer.innerHTML = '<p class="text-center text-muted">По вашему запросу тренировок не найдено.</p>';
        } else {
            workouts.forEach(workout => {
                resultsContainer.insertAdjacentHTML('beforeend', renderWorkoutCard(workout));
            });

            document.querySelectorAll('.details-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const workoutId = e.currentTarget.getAttribute('data-id');
                    showTrainingDetails(workoutId);
                });
            });
        }

        resultsContainer.setAttribute('aria-busy', 'false');
        return workouts.length;

    } catch (error) {
        resultsContainer.setAttribute('aria-busy', 'false');
        console.error('Ошибка загрузки тренировок:', error);
        resultsContainer.innerHTML = '<p class="text-danger">Не удалось загрузить тренировки с сервера.</p>';
        return 0;
    }
}

// функция для загрузки всех тренировок (без фильтров)
async function loadWorkouts() {
    return loadWorkoutsWithFilters({}); // Пустые фильтры = все тренировки
}

// фильтрация на сервере
async function applyFilters(showAlert = true) {
    const level = document.getElementById('filterLevel').value;
    const type = document.getElementById('filterType').value;
    const duration = parseInt(document.getElementById('filterDuration').value);

    console.log(`Применяем фильтры на сервере: Уровень=${level}, Тип=${type}, Продолжительность<=${duration}`);

    // Собираем объект фильтров
    const filters = {};
    if (level) filters.level = level;
    if (type) filters.type = type;
    if (duration && !isNaN(duration)) filters.duration = duration;

    const foundCount = await loadWorkoutsWithFilters(filters);

    if (showAlert) {
        showSuccess(`Поиск завершен! Найдено ${foundCount} тренировок.`, null);
    }
}

// Тренировки
async function showTrainingDetails(workoutId) {
    try {
        const response = await fetch(`${API_URL}/workouts/${workoutId}`);
        if (!response.ok) throw new Error('Тренировка не найдена');
        
        const workout = await response.json();
        
        document.getElementById('modalTrainingTitle').textContent = workout.title;
        
        document.querySelector('#trainingDetailModal .ratio-16x9 iframe').src = workout.videoUrl;
        
        const instructionsList = document.querySelector('#trainingDetailModal .list-group-flush');
        instructionsList.innerHTML = '';
        
        workout.instructions.forEach(instruction => {
            instructionsList.insertAdjacentHTML('beforeend', `<li class="list-group-item">${instruction}</li>`);
        });

        document.querySelector('#trainingDetailModal .modal-body > p:nth-of-type(1)').innerHTML = `${workout.description} Сегодня мы выполним:`;
        
        trainingDetailModal.show();
        
        setTimeout(() => {
            const startButton = document.querySelector('#trainingDetailModal .btn-primary');
            if (startButton) startButton.focus();
        }, 100);

    } catch (error) {
        console.error(`Ошибка загрузки деталей тренировки ID ${workoutId}:`, error);
    }
}

// Загрузка блог-постов
async function loadBlogPosts() {
    try {
        const response = await fetch(`${API_URL}/blogPosts`);
        if (!response.ok) throw new Error('Не удалось загрузить блог-посты');
        
        const posts = await response.json();
        const blogContainer = document.querySelector('#home-page .row-cols-md-3');
        blogContainer.innerHTML = '';

        posts.forEach(post => {
            const html = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body">
                            <h3 class="card-title">${post.title}</h3>
                            <p class="card-text text-muted">${post.text}</p>
                            <a href="#" class="btn btn-sm btn-outline-brand">Читать</a>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.insertAdjacentHTML('beforeend', html);
        });

    } catch (error) {
        console.error('Ошибка загрузки блог-постов:', error);
        document.querySelector('#home-page .row-cols-md-3').innerHTML = '<p class="text-danger text-center">Не удалось загрузить блог с сервера.</p>';
    }
}

// Проверяет localStorage и устанавливает тему при загрузке страницы
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Если сохранена тема
    if (savedTheme === 'dark' || savedTheme === 'light') {
        // Используем сохраненную
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    } else {
        // Проверяем системную тему
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
    
    updateThemeToggleIcon();
}

// Переключает тему и сохраняет выбор в localStorage
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Сохраняем выбор в localStorage
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    
    updateThemeToggleIcon();
}

// Обновляет иконку на кнопке переключения
function updateThemeToggleIcon() {
    const isDark = document.body.classList.contains('dark-theme');
    const iconUse = document.querySelector('#themeToggleBtn .icon use'); 
    const button = document.getElementById('themeToggleBtn');
    
    if (iconUse) {
        // Меняем ссылку на соответствующую иконку в спрайте
        const iconId = isDark ? 'icon-sun-fill' : 'icon-moon-fill';
        iconUse.setAttribute('href', `icons.svg#${iconId}`);
    }
    if (button) {
         // Меняем класс кнопки для лучшего вида
        button.classList.remove('btn-outline-dark', 'btn-outline-light');
        button.classList.add(isDark ? 'btn-outline-light' : 'btn-outline-dark');
    }
}

// Инициализация и обработчики событий
window.onload = () => {
    // Инициализация темы должна быть первой операцией
    initializeTheme();

    // Скрываем все секции
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('d-none');
    });

    // Начальная загрузка главной страницы (запустит loadBlogPosts)
    showPage('home-page');
    
    // Проверка авторизации
    const storedName = localStorage.getItem('userName');
    if (storedName) {
         document.getElementById('userNameDisplay').textContent = storedName;
    }

    // Переключение страниц
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (!pageId) return;

            showPage(pageId);

            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse) {
                const instance = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                if (navbarCollapse.classList.contains('show')) {
                    instance.hide();
                }
            }
        });
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);

    document.getElementById('applyFiltersBtn').addEventListener('click', () => applyFilters(true));

    document.getElementById('filterDuration').addEventListener('input', function() {
        document.getElementById('durationValue').textContent = this.value;
        this.setAttribute('aria-valuenow', this.value);
    });
    document.getElementById('durationValue').textContent = document.getElementById('filterDuration').value;

    // Переключение темы
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
};