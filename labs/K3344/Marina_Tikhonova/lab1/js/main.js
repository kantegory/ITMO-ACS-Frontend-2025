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
    }
];

let stepCounter = 1;
let ingredientCounter = 1;

function generateRecipeCards() {
    const container = document.getElementById('recipeGrid');
    if (!container) return;

    container.innerHTML = allRecipes.map(recipe => `
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

function addEventListeners() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const counter = this.querySelector('.like-count');
            let count = parseInt(counter.textContent);
            
            if (icon.classList.contains('bi-heart')) {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#dc3545';
                counter.textContent = count + 1;
                showNotification('Лайк добавлен!');
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = '';
                counter.textContent = count - 1;
                showNotification('Лайк удален');
            }
        });
    });
    
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('bi-bookmark')) {
                icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                icon.style.color = '#0d6efd';
                showNotification('Рецепт сохранен');
            } else {
                icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                icon.style.color = '';
                showNotification('Рецепт удален из сохраненных');
            }
        });
    });

    document.querySelectorAll('.blog-like').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const counter = this.querySelector('span:not(.ms-1)');
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
}

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
                showNotification('Лайк добавлен!');
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = '';
                counter.textContent = count - 1;
                showNotification('Лайк удален');
            }
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('bi-bookmark')) {
                icon.classList.replace('bi-bookmark', 'bi-bookmark-fill');
                icon.style.color = '#0d6efd';
                showNotification('Рецепт сохранен');
            } else {
                icon.classList.replace('bi-bookmark-fill', 'bi-bookmark');
                icon.style.color = '';
                showNotification('Рецепт удален из сохраненных');
            }
        });
    }
    
    if (addCommentBtn && commentText) {
        addCommentBtn.addEventListener('click', function() {
            const text = commentText.value.trim();
            if (!text) {
                showNotification('Введите комментарий', 'warning');
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
            showNotification('Комментарий добавлен');
        });
    }
}

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
            showNotification(`Найдено ${filtered.length} рецептов`);
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
            showNotification(`Применены фильтры: ${filtered.length} рецептов`);
        });
    }
    
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            checkboxes.forEach(cb => cb.checked = false);
            radios.forEach(r => r.checked = false);
            updateSearchResults(allRecipes);
            showNotification('Фильтры сброшены');
        });
    }
}

function initRecipeForm() {
    const addIngredientBtn = document.getElementById('addIngredient');
    const addStepBtn = document.getElementById('addStep');
    const recipeForm = document.getElementById('recipeForm');
    const saveDraftBtn = document.getElementById('saveDraft');
    const publishBtn = document.getElementById('publishRecipe');
    
    if (addIngredientBtn) {
        addIngredientBtn.addEventListener('click', function() {
            const container = document.getElementById('ingredientsContainer');
            ingredientCounter++;
            
            const div = document.createElement('div');
            div.className = 'input-group mb-2';
            div.innerHTML = `
                <input type="text" class="form-control ingredient-input" placeholder="Например: 500 г муки">
                <button type="button" class="btn btn-outline-danger remove-ingredient">
                    <i class="bi bi-x"></i>
                </button>
            `;
            
            container.appendChild(div);
            
            div.querySelector('.remove-ingredient').addEventListener('click', function() {
                div.remove();
                showNotification('Ингредиент удален');
            });
        });
    }
    
    if (addStepBtn) {
        addStepBtn.addEventListener('click', function() {
            const container = document.getElementById('stepsContainer');
            stepCounter++;
            
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <label class="form-label">Шаг ${stepCounter}</label>
                <textarea class="form-control step-input" rows="2" required></textarea>
                <button type="button" class="btn btn-outline-danger btn-sm mt-2 remove-step">
                    Удалить шаг
                </button>
            `;
            
            container.appendChild(div);
            
            div.querySelector('.remove-step').addEventListener('click', function() {
                div.remove();
                stepCounter--;
                updateStepLabels();
                showNotification('Шаг удален');
            });
        });
    }
    
    if (recipeForm) {
        recipeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('recipeTitle').value;
            const category = document.getElementById('recipeCategory').value;
            
            if (!title || !category) {
                showNotification('Заполните обязательные поля', 'warning');
                return;
            }
            
            if (e.submitter?.id === 'publishRecipe') {
                showNotification('Рецепт опубликован!', 'success');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                showNotification('Черновик сохранен');
            }
        });
    }
    
    document.querySelectorAll('.remove-ingredient').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.input-group').remove();
            showNotification('Ингредиент удален');
        });
    });
    
    document.querySelectorAll('.remove-step').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.mb-3').remove();
            stepCounter--;
            updateStepLabels();
            showNotification('Шаг удален');
        });
    });
}

function updateStepLabels() {
    const steps = document.querySelectorAll('#stepsContainer .mb-3');
    steps.forEach((step, index) => {
        step.querySelector('.form-label').textContent = `Шаг ${index + 1}`;
    });
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

function initForms() {
    const loginForms = document.querySelectorAll('form[id^="loginForm"]');
    const registerForm = document.getElementById('registerForm');
    
    loginForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Вход выполнен успешно', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
        });
    });
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirm').value;
            
            if (password !== confirm) {
                showNotification('Пароли не совпадают', 'warning');
                return;
            }
            
            showNotification('Регистрация завершена', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
        });
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        'success': '#28a745',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    
    const notification = document.createElement('div');
    notification.className = 'position-fixed top-0 end-0 p-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        <div class="toast align-items-center text-white bg-${type === 'info' ? 'dark' : type} border-0 show" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function initBlogPage() {
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showNotification('Статья скоро будет доступна');
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    generateRecipeCards();
    generateSearchResults();
    initForms();
    initRecipePage();
    initSearchPage();
    initRecipeForm();
    initBlogPage();
    
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});