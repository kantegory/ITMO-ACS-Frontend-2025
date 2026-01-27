// Функции специфичные для главной страницы
async function loadCategories() {
    try {
        const categories = await api.getCategories();
        const container = document.getElementById('categoriesGrid');
        
        if (container && categories.length > 0) {
            container.innerHTML = categories.map(cat => `
                <div class="col-md-3 col-sm-6">
                    <a href="search.html?category=${encodeURIComponent(cat.name)}" class="text-decoration-none text-dark">
                        <div class="card h-100 border">
                            <div class="card-body text-center">
                                <i class="bi bi-${cat.icon} fs-1 text-muted mb-3"></i>
                                <h5 class="card-title">${cat.name}</h5>
                                <p class="card-text text-muted">${cat.count} рецептов</p>
                            </div>
                        </div>
                    </a>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function loadRecentRecipes() {
    try {
        const recipes = await api.getRecipes();
        const recentRecipes = recipes
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
        
        const container = document.getElementById('recipeGrid');
        
        if (container && recentRecipes.length > 0) {
            container.innerHTML = recentRecipes.map(recipe => `
                <div class="col-lg-3 col-md-6">
                    <div class="recipe-card card h-100">
                        <a href="recipe.html?id=${recipe.id}" class="text-decoration-none text-dark">
                            <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" 
                                 onerror="this.src='https://images.unsplash.com/photo-1565958011703-44f9829ba187'">
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
                                            <i class="bi ${recipe.likedBy?.includes(currentUser?.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
                                            <span class="like-count small ms-1">${recipe.likes}</span>
                                        </span>
                                        <span class="action-icon save-btn" data-id="${recipe.id}">
                                            <i class="bi ${recipe.savedBy?.includes(currentUser?.id) ? 'bi-bookmark-fill text-primary' : 'bi-bookmark'}"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="mt-3 pt-3 border-top">
                                    <small class="text-muted">
                                        <i class="bi bi-person"></i> ${recipe.author}
                                    </small>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `).join('');
            
            addEventListeners();
        } else if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-egg-fried fs-1 text-muted mb-3"></i>
                    <h5>Рецептов пока нет</h5>
                    <p class="text-muted">Будьте первым, кто добавит рецепт!</p>
                    <button class="btn btn-dark mt-3" data-bs-toggle="modal" data-bs-target="#registerModal">
                        Присоединиться
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load recent recipes:', error);
        const container = document.getElementById('recipeGrid');
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-triangle fs-1 text-muted mb-3"></i>
                    <h5>Не удалось загрузить рецепты</h5>
                    <p class="text-muted">Проверьте подключение к серверу</p>
                </div>
            `;
        }
    }
}

async function loadHeroImage() {
    try {
        const recipes = await api.getRecipes();
        if (recipes.length > 0) {
            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
            const heroImage = document.getElementById('heroImage');
            if (heroImage) {
                heroImage.src = randomRecipe.image;
            }
        }
    } catch (error) {
        console.error('Failed to load hero image:', error);
    }
}

function handleAddRecipeButton() {
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    if (addRecipeBtn) {
        addRecipeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!currentUser) {
                const modal = new bootstrap.Modal(document.getElementById('registerModal'));
                modal.show();
                showNotification('Зарегистрируйтесь, чтобы добавлять рецепты', 'warning');
            } else {
                window.location.href = 'edit-recipe.html';
            }
        });
    }
}

function handleSubscribe() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeEmail = document.getElementById('subscribeEmail');
    
    if (subscribeBtn && subscribeEmail) {
        subscribeBtn.addEventListener('click', function() {
            const email = subscribeEmail.value.trim();
            if (!email || !email.includes('@')) {
                showNotification('Введите корректный email', 'warning');
                return;
            }
            
            showNotification('Вы успешно подписались на рассылку!', 'success');
            subscribeEmail.value = '';
            
            setTimeout(() => {
                const modal = new bootstrap.Modal(document.getElementById('loginModal'));
                modal.show();
            }, 2000);
        });
    }
}

// Инициализация главной страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadCategories();
        loadRecentRecipes();
        loadHeroImage();
        handleAddRecipeButton();
        handleSubscribe();
    }
});