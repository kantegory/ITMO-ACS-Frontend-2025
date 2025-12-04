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
    });

    const activeLink = document.querySelector(`.navbar-nav [data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
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

// Вход
async function handleLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log(`Попытка входа с: ${email}`);

    // --- ИМИТАЦИЯ АВТОРИЗАЦИИ С API ---
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
            
            // Очистка формы
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

// Добавление новой функции для показа ошибки
function showError(title, message) {
    document.getElementById('successModalLabel').textContent = title;
    document.getElementById('successMessage').textContent = message;
    document.querySelector('#successModal .bg-success').classList.replace('bg-success', 'bg-danger');
    document.querySelector('#successModal .btn-success').classList.replace('btn-success', 'btn-danger');
    document.querySelector('#successModal .bi-check-circle-fill').classList.replace('bi-check-circle-fill', 'bi-x-circle-fill');
    document.querySelector('#successModal .text-success').classList.replace('text-success', 'text-danger');
    successModal.show();

    document.getElementById('successModal').addEventListener('hidden.bs.modal', function onModalHidden() {
        document.querySelector('#successModal .bg-danger').classList.replace('bg-danger', 'bg-success');
        document.querySelector('#successModal .btn-danger').classList.replace('btn-danger', 'btn-success');
        document.querySelector('#successModal .bi-x-circle-fill').classList.replace('bi-x-circle-fill', 'bi-check-circle-fill');
        document.querySelector('#successModal .text-danger').classList.replace('text-danger', 'text-success');
        document.getElementById('successModal').removeEventListener('hidden.bs.modal', onModalHidden);
    });
}

// Регистрация
async function handleRegistration(event) { // Добавляем async
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
    
    // --- ИМИТАЦИЯ РЕГИСТРАЦИИ С API ---
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
        
        // 1. Обновление Прогресса
        document.getElementById('progressWeight').textContent = `${progress.weight} кг`;
        document.getElementById('progressWorkouts').textContent = `${progress.weeklyWorkouts}`;
        document.getElementById('progressGoal').textContent = `${progress.pushupGoal}`;
        // (Нужно будет добавить/обновить span'ы в index.html)

        // 2. Обновление Плана Тренировок
        const planAccordion = document.getElementById('trainingPlanAccordion');
        planAccordion.innerHTML = ''; // Очистка старых данных

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
        // Не показываем ошибку пользователю, если он не на этой странице.
    }
}

// Шаблон для карточки тренировки
function renderWorkoutCard(workout) {
    const typeBadge = `<span class="badge bg-secondary me-2">${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}</span>`;
    const levelBadge = `<span class="badge bg-secondary me-2">${workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}</span>`;
    const durationBadge = `<span class="badge bg-secondary">${workout.duration} мин</span>`;
    const imgText = workout.type.charAt(0).toUpperCase() + workout.type.slice(1);
    const imgColor = workout.type === 'strength' ? '3498db' : (workout.type === 'cardio' ? '1abc9c' : '9b59b6');

    return `
        <div class="card mb-3 training-card" data-level="${workout.level}" data-type="${workout.type}" data-duration="${workout.duration}" data-id="${workout.id}" style="display: block;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="https://placehold.co/400x250/${imgColor}/ffffff?text=${imgText}" class="img-fluid rounded-start h-100" alt="${workout.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-primary">${workout.title}</h5>
                        <p class="card-text">${workout.description}</p>
                        <p class="card-text">${typeBadge} ${levelBadge} ${durationBadge}</p>
                        <button class="btn btn-outline-primary btn-sm details-btn" data-id="${workout.id}">Подробнее</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Загрузка тренировок с API (используется при первом посещении search-page)
async function loadWorkouts() {
    try {
        const response = await fetch(`${API_URL}/workouts`);
        if (!response.ok) throw new Error('Не удалось загрузить тренировки');
        
        const workouts = await response.json();
        const resultsContainer = document.getElementById('trainingResults');
        resultsContainer.innerHTML = ''; // Очистка существующих карточек
        
        workouts.forEach(workout => {
            resultsContainer.insertAdjacentHTML('beforeend', renderWorkoutCard(workout));
        });
        
        // Переназначаем обработчики событий для новых кнопок "Подробнее"
        document.querySelectorAll('.details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workoutId = e.currentTarget.getAttribute('data-id');
                showTrainingDetails(workoutId);
            });
        });

        // Теперь фильтрация будет работать с динамически созданными карточками
        applyFilters(false); // Применяем фильтры (скрываем ненужные, но без показа модалки успеха)

    } catch (error) {
        console.error('Ошибка загрузки тренировок:', error);
        document.getElementById('trainingResults').innerHTML = '<p class="text-danger">Не удалось загрузить тренировки с сервера.</p>';
    }
}

// Обновление applyFilters для работы с динамическими карточками
function applyFilters(showAlert = true) { // Добавляем аргумент showAlert
    const level = document.getElementById('filterLevel').value;
    const type = document.getElementById('filterType').value;
    const duration = parseInt(document.getElementById('filterDuration').value);

    console.log(`Применяем фильтры: Уровень=${level}, Тип=${type}, Продолжительность<=${duration}`);

    const cards = document.querySelectorAll('.training-card');
    let foundCount = 0;

    cards.forEach(card => {
        const cardLevel = card.getAttribute('data-level');
        const cardType = card.getAttribute('data-type');
        const cardDuration = parseInt(card.getAttribute('data-duration'));

        const levelMatch = (level === '' || cardLevel === level);
        const typeMatch = (type === '' || cardType === type);
        const durationMatch = (cardDuration <= duration);

        if (levelMatch && typeMatch && durationMatch) {
            card.style.display = 'block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (showAlert) {
        showSuccess(`Поиск завершен! Найдено ${foundCount} тренировок.`, null);
    }
}

// Тренировки (Обновленная функция, принимает ID)
async function showTrainingDetails(workoutId) {
    try {
        const response = await fetch(`${API_URL}/workouts/${workoutId}`);
        if (!response.ok) throw new Error('Тренировка не найдена');
        
        const workout = await response.json();
        
        document.getElementById('modalTrainingTitle').textContent = workout.title;
        
        // Обновление iframe
        document.querySelector('#trainingDetailModal .ratio-16x9 iframe').src = workout.videoUrl;
        
        // Обновление инструкций
        const instructionsList = document.querySelector('#trainingDetailModal .list-group-flush');
        instructionsList.innerHTML = '';
        
        workout.instructions.forEach(instruction => {
            instructionsList.insertAdjacentHTML('beforeend', `<li class="list-group-item">${instruction}</li>`);
        });

        // Обновление описания (Предполагаем, что второе <p> под видео - это описание)
        document.querySelector('#trainingDetailModal .modal-body > p:nth-of-type(1)').innerHTML = `${workout.description} Сегодня мы выполним:`;
        
        trainingDetailModal.show();

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
        blogContainer.innerHTML = ''; // Очистка старых постов

        posts.forEach(post => {
            const html = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text text-muted">${post.text}</p>
                            <a href="#" class="btn btn-sm btn-outline-success">Читать</a>
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

// Инициализация и обработчики событий
window.onload = () => {
    // Начальная загрузка главной страницы (запустит loadBlogPosts)
    showPage('home-page');
    
    // Проверка авторизации (Остается)
    const storedName = localStorage.getItem('userName');
    if (storedName) {
         document.getElementById('userNameDisplay').textContent = storedName;
    }

    // Переключение страниц
    document.querySelectorAll('.navbar-nav .nav-link, .navbar-brand, .btn[data-page]').forEach(link => {
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

    document.getElementById('applyFiltersBtn').addEventListener('click', () => applyFilters(true)); // Передаем true для показа модалки

    document.getElementById('filterDuration').addEventListener('input', function() {
        document.getElementById('durationValue').textContent = this.value;
    });

    // document.querySelectorAll('.details-btn').forEach(btn => {
    //     btn.addEventListener('click', (e) => {
    //         const title = e.currentTarget.getAttribute('data-title');
    //         showTrainingDetails(title);
    //     });
    // });

    document.getElementById('durationValue').textContent = document.getElementById('filterDuration').value;
};