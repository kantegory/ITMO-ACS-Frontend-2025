// Данные рецептов
const allRecipes = [
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
    },
    {
        id: 5,
        title: "Паста Карбонара",
        description: "Классическая итальянская паста",
        image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Основные блюда",
        difficulty: "Легкая",
        time: "25 мин",
        author: "Сергей Волков",
        likes: 312,
        saved: false,
        liked: false
    },
    {
        id: 6,
        title: "Брауни",
        description: "Шоколадное пирожное",
        image: "https://images.unsplash.com/photo-1606313564200-75f2d4fa383b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Десерты",
        difficulty: "Средняя",
        time: "45 мин",
        author: "Ольга Смирнова",
        likes: 178,
        saved: false,
        liked: false
    }
];

// Генерация карточек рецептов для главной
function generateRecipeCards() {
    const container = document.getElementById('recipeGrid');
    if (!container) return;

    const recipes = allRecipes.slice(0, 4);
    
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
    
    addEventListeners();
}

// Генерация результатов поиска
function generateSearchResults() {
    const container = document.getElementById('searchResults');
    if (!container) return;

    container.innerHTML = allRecipes.map(recipe => `
        <div class="col-lg-4 col-md-6">
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
    
    addEventListeners();
}

// Обработчики событий
function addEventListeners() {
    // Лайки на карточках
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
    
    // Сохранение на карточках
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('bi-bookmark')) {
                icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                icon.style.color = '#0d6efd';
            } else {
                icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                icon.style.color = '';
            }
        });
    });
}

// Функции для страницы рецепта
function initRecipePage() {
    const likeBtn = document.querySelector('.like-btn-recipe');
    const saveBtn = document.querySelector('.save-btn-recipe');
    const addCommentBtn = document.getElementById('addComment');
    const commentText = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');
    
    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
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
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('bi-bookmark')) {
                icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                icon.style.color = '#0d6efd';
            } else {
                icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                icon.style.color = '';
            }
        });
    }
    
    if (addCommentBtn && commentText) {
        addCommentBtn.addEventListener('click', function() {
            const text = commentText.value.trim();
            if (!text) {
                alert('Введите комментарий');
                return;
            }
            
            const newComment = document.createElement('div');
            newComment.className = 'border-bottom pb-3 mb-3';
            newComment.innerHTML = `
                <div class="d-flex justify-content-between">
                    <strong>Вы</strong>
                    <small class="text-muted">только что</small>
                </div>
                <p class="mb-0 mt-1">${text}</p>
            `;
            
            commentsList.prepend(newComment);
            commentText.value = '';
        });
    }
}

// Функции для страницы поиска
function initSearchPage() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const radios = document.querySelectorAll('input[type="radio"]');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.toLowerCase();
            if (!query) return;
            
            const filtered = allRecipes.filter(recipe => 
                recipe.title.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query) ||
                recipe.category.toLowerCase().includes(query)
            );
            
            updateSearchResults(filtered);
        });
    }
    
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            const selectedCategories = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            const selectedDifficulty = Array.from(radios)
                .find(r => r.checked)?.value;
            
            let filtered = allRecipes;
            
            if (selectedCategories.length > 0) {
                filtered = filtered.filter(recipe => 
                    selectedCategories.some(cat => 
                        recipe.category.toLowerCase().includes(cat)
                    )
                );
            }
            
            if (selectedDifficulty) {
                filtered = filtered.filter(recipe => 
                    recipe.difficulty.toLowerCase() === selectedDifficulty
                );
            }
            
            updateSearchResults(filtered);
        });
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            checkboxes.forEach(cb => cb.checked = false);
            radios.forEach(r => r.checked = false);
            updateSearchResults(allRecipes);
        });
    }
}

function updateSearchResults(recipes) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (recipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-muted mb-3"></i>
                <h5>Рецепты не найдены</h5>
                <p class="text-muted">Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recipes.map(recipe => `
        <div class="col-lg-4 col-md-6">
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
    
    addEventListeners();
}

// Обработка форм
function initForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Вход выполнен успешно');
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
        });
    }
    
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
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    generateRecipeCards();
    generateSearchResults();
    initForms();
    initRecipePage();
    initSearchPage();
});