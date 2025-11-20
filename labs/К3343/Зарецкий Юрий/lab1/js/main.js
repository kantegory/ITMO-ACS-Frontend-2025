const Storage = {
    keys: {
        currentUser: 'currentUser',
        users: 'users',
        apartments: 'apartments',
        rentedApartments: 'rentedApartments'
    },

    set: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
        }
    },

    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Ошибка чтения из localStorage:', e);
            return null;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Ошибка удаления из localStorage:', e);
        }
    },

    clear: function() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Ошибка очистки localStorage:', e);
        }
    }
};


const UserService = {
    loadUsers: async function() {
        try {
            const response = await fetch('data/users.json');
            const users = await response.json();
            // Сохраняем в localStorage
            Storage.set(Storage.keys.users, users);
            return users;
        } catch (e) {
            console.error('Ошибка загрузки пользователей:', e);
            // Пытаемся загрузить из localStorage
            return Storage.get(Storage.keys.users) || [];
        }
    },

    /**
     * Получает всех пользователей
     * @returns {Array}
     */
    getUsers: function() {
        return Storage.get(Storage.keys.users) || [];
    },

    /**
     * Получает текущего авторизованного пользователя
     * @returns {Object|null}
     */
    getCurrentUser: function() {
        return Storage.get(Storage.keys.currentUser);
    },

    /**
     * Устанавливает текущего пользователя
     * @param {Object} user - Пользователь
     */
    setCurrentUser: function(user) {
        Storage.set(Storage.keys.currentUser, user);
    },

    /**
     * Выход из системы
     */
    logout: function() {
        Storage.remove(Storage.keys.currentUser);
    },

    /**
     * Проверяет, авторизован ли пользователь
     * @returns {boolean}
     */
    isAuthenticated: function() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Авторизация пользователя
     * @param {string} email - Email или имя пользователя
     * @param {string} password - Пароль
     * @returns {Object|null} - Пользователь или null
     */
    login: function(email, password) {
        const users = this.getUsers();
        const user = users.find(u => 
            (u.email === email || u.fullName === email) && u.password === password
        );
        
        if (user) {
            // Не сохраняем пароль в сессии
            const { password: _, ...userWithoutPassword } = user;
            this.setCurrentUser(userWithoutPassword);
            return userWithoutPassword;
        }
        
        return null;
    },

    /**
     * Регистрация нового пользователя
     * @param {Object} userData - Данные пользователя
     * @returns {Object} - Новый пользователь
     */
    register: function(userData) {
        const users = this.getUsers();
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password
        };
        
        users.push(newUser);
        Storage.set(Storage.keys.users, users);
        
        // Автоматически авторизуем нового пользователя
        const { password: _, ...userWithoutPassword } = newUser;
        this.setCurrentUser(userWithoutPassword);
        
        return userWithoutPassword;
    }
};

// Утилиты для работы с недвижимостью
const ApartmentService = {
    /**
     * Загружает недвижимость из JSON файла
     * @returns {Promise<Array>}
     */
    loadApartments: async function() {
        try {
            const response = await fetch('data/apartments.json');
            const apartments = await response.json();
            // Сохраняем в localStorage
            Storage.set(Storage.keys.apartments, apartments);
            return apartments;
        } catch (e) {
            console.error('Ошибка загрузки недвижимости:', e);
            // Пытаемся загрузить из localStorage
            return Storage.get(Storage.keys.apartments) || [];
        }
    },

    /**
     * Получает всю недвижимость
     * @returns {Array}
     */
    getApartments: function() {
        return Storage.get(Storage.keys.apartments) || [];
    },

    /**
     * Получает недвижимость по ID
     * @param {number} id - ID недвижимости
     * @returns {Object|null}
     */
    getApartmentById: function(id) {
        const apartments = this.getApartments();
        return apartments.find(apt => apt.id === parseInt(id)) || null;
    },

    /**
     * Получает недвижимость пользователя (которую он сдает)
     * @param {number} userId - ID пользователя
     * @returns {Array}
     */
    getUserApartments: function(userId) {
        const apartments = this.getApartments();
        return apartments.filter(apt => apt.ownerId === userId);
    },

    /**
     * Получает арендованную недвижимость пользователя
     * @param {number} userId - ID пользователя
     * @returns {Array}
     */
    getRentedApartments: function(userId) {
        const rented = Storage.get(Storage.keys.rentedApartments) || [];
        return rented.filter(rent => rent.tenantId === userId);
    },

    /**
     * Арендовать недвижимость
     * @param {number} apartmentId - ID недвижимости
     * @param {number} userId - ID пользователя
     * @param {Object} rentData - Данные об аренде
     */
    rentApartment: function(apartmentId, userId, rentData) {
        const rented = Storage.get(Storage.keys.rentedApartments) || [];
        rented.push({
            apartmentId: apartmentId,
            tenantId: userId,
            startDate: rentData.startDate,
            endDate: rentData.endDate,
            guests: rentData.guests
        });
        Storage.set(Storage.keys.rentedApartments, rented);
    }
};

const ModalUtils = {
    /**
     * Показывает модальное окно
     * @param {string} modalId - ID модального окна
     */
    show: function(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    },

    /**
     * Скрывает модальное окно
     * @param {string} modalId - ID модального окна
     */
    hide: function(modalId) {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
    },

    /**
     * Показывает уведомление об успехе
     * @param {string} message - Сообщение
     */
    showSuccess: function(message) {
        alert(message); // В будущем можно заменить на toast-уведомления
    },

    /**
     * Показывает уведомление об ошибке
     * @param {string} message - Сообщение об ошибке
     */
    showError: function(message) {
        alert('Ошибка: ' + message);
    }
};

// Утилиты для валидации форм
const FormValidation = {
    /**
     * Проверяет совпадение паролей
     * @param {string} password - Пароль
     * @param {string} confirmPassword - Подтверждение пароля
     * @returns {boolean} - true если пароли совпадают
     */
    validatePasswordMatch: function(password, confirmPassword) {
        return password === confirmPassword;
    },

    /**
     * Проверяет минимальную длину пароля
     * @param {string} password - Пароль
     * @param {number} minLength - Минимальная длина (по умолчанию 8)
     * @returns {boolean} - true если пароль соответствует требованиям
     */
    validatePasswordLength: function(password, minLength = 8) {
        return password.length >= minLength;
    },

    /**
     * Проверяет валидность email
     * @param {string} email - Email адрес
     * @returns {boolean} - true если email валиден
     */
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Проверяет валидность телефона (российский формат)
     * @param {string} phone - Номер телефона
     * @returns {boolean} - true если телефон валиден
     */
    validatePhone: function(phone) {
        const phoneRegex = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
};

// Утилиты для работы с фильтрами поиска
const SearchFilters = {
    /**
     * Применяет фильтры к списку недвижимости
     * @param {Array} properties - Массив объектов недвижимости
     * @param {Object} filters - Объект с фильтрами
     * @returns {Array} - Отфильтрованный массив
     */
    apply: function(properties, filters) {
        return properties.filter(property => {
            // Фильтр по текстовому поиску
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                const matchesSearch = 
                    property.title.toLowerCase().includes(searchLower) ||
                    property.location.toLowerCase().includes(searchLower) ||
                    (property.description && property.description.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }

            // Фильтр по типу
            if (filters.propertyType && property.type !== filters.propertyType) {
                return false;
            }

            // Фильтр по локации
            if (filters.location) {
                const locationLower = filters.location.toLowerCase();
                if (!property.location.toLowerCase().includes(locationLower)) {
                    return false;
                }
            }

            // Фильтр по цене
            const minPrice = filters.minPrice || 0;
            const maxPrice = filters.maxPrice || Infinity;
            if (property.price < minPrice || property.price > maxPrice) {
                return false;
            }

            // Фильтр по количеству комнат
            if (filters.rooms && property.rooms.toString() !== filters.rooms) {
                return false;
            }

            return true;
        });
    },

    /**
     * Сбрасывает все фильтры
     * @param {Object} filterElements - Объект с элементами фильтров
     */
    reset: function(filterElements) {
        if (filterElements.searchInput) filterElements.searchInput.value = '';
        if (filterElements.propertyType) filterElements.propertyType.value = '';
        if (filterElements.location) filterElements.location.value = '';
        if (filterElements.minPrice) filterElements.minPrice.value = '';
        if (filterElements.maxPrice) filterElements.maxPrice.value = '';
        if (filterElements.rooms) filterElements.rooms.value = '';
    }
};

// Утилиты для работы с данными недвижимости
const PropertyData = {
    /**
     * Форматирует цену для отображения
     * @param {number} price - Цена
     * @returns {string} - Отформатированная цена
     */
    formatPrice: function(price) {
        return price.toLocaleString('ru-RU') + ' ₽/мес';
    },

    /**
     * Получает название типа недвижимости
     * @param {string} type - Тип недвижимости
     * @returns {string} - Название типа
     */
    getTypeName: function(type) {
        const typeNames = {
            apartment: 'Квартира',
            house: 'Дом',
            office: 'Офис',
            studio: 'Студия'
        };
        return typeNames[type] || type;
    },

    /**
     * Создает HTML карточки недвижимости
     * @param {Object} property - Объект недвижимости
     * @returns {string} - HTML код карточки
     */
    createCardHTML: function(property) {
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 property-card">
                    <img src="${property.image}" class="card-img-top" alt="${property.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${property.title}</h5>
                        <p class="card-text text-muted">${property.location}</p>
                        ${property.description ? `<p class="card-text">${property.description}</p>` : ''}
                        <p class="card-text"><strong class="text-primary">${this.formatPrice(property.price)}</strong></p>
                        <a href="property.html?id=${property.id}" class="btn btn-primary btn-sm">Подробнее</a>
                    </div>
                </div>
            </div>
        `;
    }
};

// Обработчики для страницы регистрации
function initRegistrationForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('passwordError');
        
        // Валидация пароля
        if (!FormValidation.validatePasswordLength(password)) {
            if (errorDiv) {
                errorDiv.textContent = 'Пароль должен содержать минимум 8 символов';
                errorDiv.classList.remove('d-none');
            }
            return;
        }

        // Проверка совпадения паролей
        if (!FormValidation.validatePasswordMatch(password, confirmPassword)) {
            if (errorDiv) {
                errorDiv.textContent = 'Пароли не совпадают';
                errorDiv.classList.remove('d-none');
            }
            return;
        }

        // Валидация email
        if (!FormValidation.validateEmail(email)) {
            if (errorDiv) {
                errorDiv.textContent = 'Введите корректный email адрес';
                errorDiv.classList.remove('d-none');
            }
            return;
        }

        // Проверка, не существует ли уже пользователь с таким email
        const users = UserService.getUsers();
        if (users.some(u => u.email === email)) {
            if (errorDiv) {
                errorDiv.textContent = 'Пользователь с таким email уже существует';
                errorDiv.classList.remove('d-none');
            }
            return;
        }

        // Скрываем ошибку если все валидно
        if (errorDiv) {
            errorDiv.classList.add('d-none');
        }

        // Регистрация пользователя
        const newUser = UserService.register({
            fullName,
            email,
            phone,
            password
        });

        ModalUtils.showSuccess('Регистрация успешно завершена!');
        
        // Перенаправление на личный кабинет
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    });
}

// Обработчики для страницы входа
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Базовая валидация
        if (!email || !password) {
            ModalUtils.showError('Заполните все поля');
            return;
        }

        // Авторизация
        const user = UserService.login(email, password);
        
        if (user) {
            ModalUtils.showSuccess('Вход выполнен успешно!');
            // Перенаправление на личный кабинет
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            ModalUtils.showError('Неверный email или пароль');
        }
    });
}


function updateNavigation() {
    const navContainer = document.getElementById('navbarNav');
    if (!navContainer) return;

    const currentUser = UserService.getCurrentUser();
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    let navHTML = '<ul class="navbar-nav ms-auto">';
    
    // Всегда показываем поиск
    navHTML += `<li class="nav-item">
        <a class="nav-link ${currentPage === 'search.html' ? 'active' : ''}" href="search.html">Поиск</a>
    </li>`;

    // Всегда показываем личный кабинет (проверка авторизации будет на странице profile.html)
    navHTML += `<li class="nav-item">
        <a class="nav-link ${currentPage === 'profile.html' ? 'active' : ''}" href="profile.html">Личный кабинет</a>
    </li>`;

    // Если не авторизован, показываем кнопки входа и регистрации только на страницах входа/регистрации
    if (!currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
        if (currentPage === 'login.html') {
            navHTML += `<li class="nav-item">
                <a class="nav-link active" href="login.html">Вход</a>
            </li>`;
            navHTML += `<li class="nav-item">
                <a class="nav-link" href="register.html">Регистрация</a>
            </li>`;
        } else {
            navHTML += `<li class="nav-item">
                <a class="nav-link" href="login.html">Вход</a>
            </li>`;
            navHTML += `<li class="nav-item">
                <a class="nav-link active" href="register.html">Регистрация</a>
            </li>`;
        }
    }
    
    navHTML += '</ul>';
    navContainer.innerHTML = navHTML;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем данные из JSON файлов
    await UserService.loadUsers();
    await ApartmentService.loadApartments();
    
    // Обновляем навигацию
    updateNavigation();
    
    // Инициализируем формы
    initRegistrationForm();
    initLoginForm();
});

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Storage,
        UserService,
        ApartmentService,
        ModalUtils,
        FormValidation,
        SearchFilters,
        PropertyData
    };
}

