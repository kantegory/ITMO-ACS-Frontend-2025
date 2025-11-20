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

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('email').value;
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

        // Скрываем ошибку если все валидно
        if (errorDiv) {
            errorDiv.classList.add('d-none');
        }

        // Здесь будет логика отправки данных на сервер
        ModalUtils.showSuccess('Регистрация успешно завершена!');
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

        // Здесь будет логика отправки данных на сервер
        ModalUtils.showSuccess('Вход выполнен успешно!');
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initRegistrationForm();
    initLoginForm();
});

// Экспорт для использования в других скриптах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ModalUtils,
        FormValidation,
        SearchFilters,
        PropertyData
    };
}

