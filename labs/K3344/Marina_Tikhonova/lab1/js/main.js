// Данные рецептов для главной страницы
const recipes = [
    {
        id: 1,
        title: "Тирамису",
        description: "Итальянский десерт с кофейным вкусом",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Десерты",
        difficulty: "Средняя",
        time: "40 мин",
        author: "Мария Иванова",
        likes: 245,
        saved: false,
        liked: false
    },
    {
        id: 2,
        title: "Суп из тыквы",
        description: "Овощной суп с пряностями",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Супы",
        difficulty: "Легкая",
        time: "30 мин",
        author: "Алексей Петров",
        likes: 189,
        saved: false,
        liked: false
    },
    {
        id: 3,
        title: "Лосось с овощами",
        description: "Рыбное блюдо",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Рыбные блюда",
        difficulty: "Средняя",
        time: "25 мин",
        author: "Елена Сидорова",
        likes: 312,
        saved: false,
        liked: false
    },
    {
        id: 4,
        title: "Пицца Маргарита",
        description: "Итальянская пицца",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Основные блюда",
        difficulty: "Легкая",
        time: "50 мин",
        author: "Иван Кузнецов",
        likes: 421,
        saved: false,
        liked: false
    }
];

// Функция для генерации карточек рецептов
function generateRecipeCards() {
    const container = document.getElementById('recipeGrid');
    if (!container) return;

    container.innerHTML = recipes.map(recipe => `
        <div class="col-lg-3 col-md-6">
            <div class="recipe-card card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-secondary">${recipe.category}</span>
                        <span class="badge bg-light text-dark border">${recipe.difficulty}</span>
                    </div>
                    <h5 class="card-title h6">${recipe.title}</h5>
                    <p class="card-text text-muted small flex-grow-1">${recipe.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <div class="small text-muted">
                            <i class="bi bi-clock"></i> ${recipe.time}
                        </div>
                        <div class="d-flex gap-3">
                            <span class="action-icon like-btn" data-id="${recipe.id}">
                                <i class="bi bi-heart"></i>
                                <span class="like-count small ms-1">${recipe.likes}</span>
                            </span>
                            <span class="action-icon save-btn" data-id="${recipe.id}">
                                <i class="bi bi-bookmark"></i>
                            </span>
                        </div>
                    </div>
                    <div class="mt-3 pt-3 border-top">
                        <small class="text-muted">
                            <i class="bi bi-person"></i> ${recipe.author}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики событий после генерации
    addEventListeners();
}

// Добавление обработчиков событий
function addEventListeners() {
    // Обработчики лайков
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const counter = this.querySelector('.like-count');
            let count = parseInt(counter.textContent);
            
            if (icon.classList.contains('bi-heart')) {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#dc3545';
                counter.textContent = count + 1;
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = '';
                counter.textContent = count - 1;
            }
        });
    });
    
    // Обработчики сохранения
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('bi-bookmark')) {
                icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                icon.style.color = '#0d6efd';
                alert('Рецепт сохранен');
            } else {
                icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                icon.style.color = '';
                alert('Рецепт удален из сохраненных');
            }
        });
    });
}

// Обработчик отправки форм
document.addEventListener('DOMContentLoaded', function() {
    generateRecipeCards();
    
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Вход выполнен успешно');
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        });
    }

    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirm').value;
            
            if (password !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            
            alert('Регистрация завершена');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        });
    }
});