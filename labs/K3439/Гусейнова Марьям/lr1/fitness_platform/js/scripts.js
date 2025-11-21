// Инициализация модальных окон bootstrap
const trainingDetailModal = new bootstrap.Modal(document.getElementById('trainingDetailModal'));
const successModal = new bootstrap.Modal(document.getElementById('successModal'));

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('d-none');
        section.classList.remove('d-block');
    });

    const pageToShow = document.getElementById(pageId);
    if (pageToShow) {
        pageToShow.classList.remove('d-none');
        pageToShow.classList.add('d-block');
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

// Вход и регистрация
function handleLogin(event) {
    event.preventDefault(); 
    const email = document.getElementById('loginEmail').value;
    
    console.log(`Попытка входа с: ${email}`);
    
    const userName = email.split('@')[0];
    localStorage.setItem('userName', userName); 
    
    showSuccess(`Привет, ${userName}! Вы успешно вошли в систему.`, 'dashboard-page');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    document.getElementById('userNameDisplay').textContent = userName;
}

function handleRegistration(event) {
    event.preventDefault();
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    const name = document.getElementById('regName').value;

    if (password !== passwordConfirm) {
        // В случае несовпадения паролей показываем модальное окно с ошибкой (вместо alert)
        document.getElementById('successModalLabel').textContent = 'Ошибка Регистрации';
        document.getElementById('successMessage').textContent = 'Пароли не совпадают! Пожалуйста, проверьте ввод.';
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
        return;
    }

    console.log(`Попытка регистрации пользователя: ${name}`);
    
    localStorage.setItem('userName', name);
    showSuccess(`Поздравляем, ${name}! Аккаунт создан. Выполните вход.`, 'login-page');
    
    document.getElementById('registrationForm').reset();
}

// Поиск и фильтрация
function applyFilters() {
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

        // Проверка по уровню
        const levelMatch = (level === '' || cardLevel === level);
        // Проверка по типу
        const typeMatch = (type === '' || cardType === type);
        // Проверка по продолжительности
        const durationMatch = (cardDuration <= duration);

        if (levelMatch && typeMatch && durationMatch) {
            card.style.display = 'block';
            foundCount++;
        } else {
            card.style.display = 'none';
        }
    });

    showSuccess(`Поиск завершен! Найдено ${foundCount} тренировок.`, null);
}

// Тренировки
function showTrainingDetails(title) {
    document.getElementById('modalTrainingTitle').textContent = title;
    trainingDetailModal.show();
}

// Инициализация и обработчики событий
window.onload = () => {
    // Скрываем все секции
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.add('d-none');
    });

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

    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);

    document.getElementById('filterDuration').addEventListener('input', function() {
        document.getElementById('durationValue').textContent = this.value;
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const title = e.currentTarget.getAttribute('data-title');
            showTrainingDetails(title);
        });
    });

    document.getElementById('durationValue').textContent = document.getElementById('filterDuration').value;
};