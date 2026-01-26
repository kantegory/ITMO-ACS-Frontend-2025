// DOM элементы
const sections = {
    home: document.getElementById('homeSection'),
    login: document.getElementById('loginSection'),
    register: document.getElementById('registerSection'),
    recipes: document.getElementById('recipesSection'),
    recipeDetail: document.getElementById('recipeDetailSection'),
    profile: document.getElementById('profileSection')
};

const authElements = {
    userMenu: document.getElementById('userMenu'),
    authButtons: document.getElementById('authButtons'),
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail')
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
});

// Загрузка начальных данных
function loadInitialData() {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem('token');
    if (token) {
        validateToken(token);
    } else {
        showSection('home');
    }
}

// Валидация токена
async function validateToken(token) {
    try {
        const response = await api.get('/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data) {
            currentUser = response.data;
            updateUIForLoggedInUser();
            showSection('home');
        } else {
            localStorage.removeItem('token');
            showSection('home');
        }
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        localStorage.removeItem('token');
        showSection('home');
    }
}

// Обновление UI для залогиненного пользователя
function updateUIForLoggedInUser() {
    authElements.authButtons.style.display = 'none';
    authElements.userMenu.style.display = 'flex';
    authElements.profileName.textContent = currentUser.name;
    authElements.profileEmail.textContent = currentUser.email;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Навигация
    document.getElementById('homeLink').addEventListener('click', () => showSection('home'));
    document.getElementById('recipesLink').addEventListener('click', () => showSection('recipes'));
    document.getElementById('blogLink').addEventListener('click', () => alert('Страница блогов будет добавлена позже'));
    document.getElementById('exploreRecipes').addEventListener('click', () => showSection('recipes'));
    
    // Авторизация
    document.getElementById('loginBtn').addEventListener('click', () => showSection('login'));
    document.getElementById('registerBtn').addEventListener('click', () => showSection('register'));
    document.getElementById('showRegisterFromLogin').addEventListener('click', () => {
        showSection('register');
    });
    document.getElementById('showLoginFromRegister').addEventListener('click', () => {
        showSection('login');
    });
    
    // Форма входа
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Форма регистрации
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Выход
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Профиль
    document.getElementById('profileLink').addEventListener('click', () => showSection('profile'));
    
    // Фильтры рецептов
    document.getElementById('applyFilters').addEventListener('click', filterRecipes);
    
    // Детали рецепта
    document.getElementById('likeRecipeBtn').addEventListener('click', toggleLike);
    document.getElementById('saveRecipeBtn').addEventListener('click', toggleSave);
    document.getElementById('addCommentBtn').addEventListener('click', addComment);
    
    // Табы профиля
    document.getElementById('savedTab').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('savedRecipesContent').style.display = 'block';
        document.getElementById('publishedRecipesContent').style.display = 'none';
        this.classList.add('active');
        document.getElementById('publishedTab').classList.remove('active');
        loadSavedRecipes();
    });
    
    document.getElementById('publishedTab').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('publishedRecipesContent').style.display = 'block';
        document.getElementById('savedRecipesContent').style.display = 'none';
        this.classList.add('active');
        document.getElementById('savedTab').classList.remove('active');
        loadPublishedRecipes();
    });
    
    // Публикация рецепта
    document.getElementById('submitRecipeBtn').addEventListener('click', submitNewRecipe);
}

// Показать секцию
function showSection(sectionName) {
    // Скрыть все секции
    Object.values(sections).forEach(section => {
        section.style.display = 'none';
    });
    
    // Показать нужную секцию
    sections[sectionName].style.display = 'block';
    
    // Загрузить данные для секции
    switch(sectionName) {
        case 'recipes':
            loadRecipes();
            break;
        case 'profile':
            loadProfileData();
            break;
        case 'recipeDetail':
            // Данные загружаются в showRecipeDetails
            break;
    }
}

// Загрузка рецептов
async function loadRecipes() {
    try {
        const response = await api.get('/recipes');
        displayRecipes(response.data);
    } catch (error) {
        console.error('Ошибка загрузки рецептов:', error);
    }
}

// Отображение рецептов
function displayRecipes(recipes) {
    const container = document.getElementById('recipesList');
    container.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<div class="col-12"><p>Рецептов не найдено</p></div>';
        return;
    }
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card recipe-card h-100">
                <img src="https://cdn-icons-png.flaticon.com/512/4345/4345581.png" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text">${recipe.description || 'Описание недоступно'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Сложность: ${recipe.difficulty}</small>
                        <button class="btn btn-sm btn-primary" data-id="${recipe.id}">Подробнее</button>
                    </div>
                </div>
            </div>
        `;
        
        card.querySelector('.btn-primary').addEventListener('click', () => showRecipeDetails(recipe.id));
        container.appendChild(card);
    });
}

// Фильтрация рецептов
async function filterRecipes() {
    const type = document.getElementById('typeFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    const ingredient = document.getElementById('ingredientSearch').value.toLowerCase();
    
    try {
        let response = await api.get('/recipes');
        let recipes = response.data;
        
        if (type) {
            recipes = recipes.filter(recipe => recipe.type === type);
        }
        
        if (difficulty) {
            recipes = recipes.filter(recipe => recipe.difficulty === difficulty);
        }
        
        if (ingredient) {
            recipes = recipes.filter(recipe => 
                recipe.ingredients.some(ing => ing.toLowerCase().includes(ingredient))
            );
        }
        
        displayRecipes(recipes);
    } catch (error) {
        console.error('Ошибка фильтрации рецептов:', error);
    }
}

// Показ деталей рецепта
async function showRecipeDetails(recipeId) {
    try {
        const response = await api.get(`/recipes/${recipeId}`);
        const recipe = response.data;
        
        document.getElementById('recipeTitle').textContent = recipe.title;
        document.getElementById('recipeType').textContent = recipe.type;
        document.getElementById('recipeDifficulty').textContent = recipe.difficulty;
        document.getElementById('likesCount').textContent = recipe.likes || 0;
        
        // Загрузка ингредиентов
        const ingredientsList = document.getElementById('ingredientsList');
        ingredientsList.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });
        
        // Загрузка инструкций
        const instructionsContainer = document.getElementById('instructionsContainer');
        instructionsContainer.innerHTML = '';
        recipe.instructions.forEach((step, index) => {
            const div = document.createElement('div');
            div.className = 'mb-3';
            div.innerHTML = `
                <h6>Шаг ${index + 1}</h6>
                <p>${step}</p>
            `;
            instructionsContainer.appendChild(div);
        });
        
        // Установка видео
        const videoFrame = document.getElementById('recipeVideo');
        videoFrame.src = recipe.videoUrl || '';
        
        // Загрузка комментариев
        loadComments(recipeId);
        
        showSection('recipeDetail');
    } catch (error) {
        console.error('Ошибка загрузки деталей рецепта:', error);
    }
}

// Загрузка комментариев
async function loadComments(recipeId) {
    try {
        const response = await api.get(`/comments?recipeId=${recipeId}`);
        const comments = response.data;
        
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="text-muted">Комментариев пока нет</p>';
            return;
        }
        
        comments.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'border-bottom pb-2 mb-2';
            div.innerHTML = `
                <strong>${comment.author}</strong>
                <p class="mb-1">${comment.text}</p>
                <small class="text-muted">${new Date(comment.date).toLocaleString()}</small>
            `;
            commentsList.appendChild(div);
        });
    } catch (error) {
        console.error('Ошибка загрузки комментариев:', error);
    }
}

// Добавление комментария
async function addComment() {
    const commentText = document.getElementById('newComment').value.trim();
    if (!commentText) return;
    
    // Получаем ID текущего рецепта из URL или другим способом
    // В демонстрационных целях используем фиктивный ID
    const recipeId = 1; // В реальном приложении получать из URL
    
    try {
        await api.post('/comments', {
            recipeId: recipeId,
            text: commentText,
            author: currentUser.name,
            date: new Date().toISOString()
        });
        
        document.getElementById('newComment').value = '';
        loadComments(recipeId);
    } catch (error) {
        console.error('Ошибка добавления комментария:', error);
    }
}

// Переключение лайка
async function toggleLike() {
    const recipeId = 1; // В реальном приложении получать из контекста
    
    try {
        await api.patch(`/recipes/${recipeId}/like`, {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        // В реальной реализации нужно обновить счетчик лайков
        const likesElement = document.getElementById('likesCount');
        const currentLikes = parseInt(likesElement.textContent);
        likesElement.textContent = currentLikes + 1;
    } catch (error) {
        console.error('Ошибка лайка:', error);
    }
}

// Переключение сохранения
async function toggleSave() {
    const recipeId = 1; // В реальном приложении получать из контекста
    
    try {
        await api.post(`/users/${currentUser.id}/saved`, {
            recipeId: recipeId
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        alert('Рецепт сохранен!');
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

// Загрузка данных профиля
async function loadProfileData() {
    if (!currentUser) return;
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    try {
        // Загрузка количества рецептов пользователя
        const recipesResponse = await api.get(`/recipes?authorId=${currentUser.id}`);
        document.getElementById('recipeCount').textContent = recipesResponse.data.length;
        
        // Загрузка подписчиков (фиктивные данные)
        document.getElementById('followersCount').textContent = 12;
        document.getElementById('followingCount').textContent = 5;
        
        // Загрузка сохраненных рецептов
        loadSavedRecipes();
    } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
    }
}

// Загрузка сохраненных рецептов
async function loadSavedRecipes() {
    try {
        // В реальной реализации получать сохраненные рецепты пользователя
        // Для демонстрации используем фиктивные данные
        const savedRecipes = [
            { id: 1, title: 'Паста Карбонара', type: 'второе', difficulty: 'средняя' },
            { id: 2, title: 'Тирамису', type: 'десерт', difficulty: 'средняя' },
            { id: 3, title: 'Гаспачо', type: 'первое', difficulty: 'легкая' }
        ];
        
        const container = document.getElementById('savedRecipesList');
        container.innerHTML = '';
        
        if (savedRecipes.length === 0) {
            container.innerHTML = '<div class="col-12"><p>Нет сохраненных рецептов</p></div>';
            return;
        }
        
        savedRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="https://cdn-icons-png.flaticon.com/512/4345/4345581.png" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">Тип: ${recipe.type}</p>
                        <p class="card-text">Сложность: ${recipe.difficulty}</p>
                        <button class="btn btn-primary w-100" onclick="showRecipeDetails(${recipe.id})">Открыть</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки сохраненных рецептов:', error);
    }
}

// Загрузка опубликованных рецептов
async function loadPublishedRecipes() {
    try {
        const response = await api.get(`/recipes?authorId=${currentUser.id}`);
        const recipes = response.data;
        
        const container = document.getElementById('publishedRecipesContent');
        
        if (recipes.length === 0) {
            container.innerHTML = '<div class="alert alert-info">У вас пока нет опубликованных рецептов.</div>';
            return;
        }
        
        let html = '<div class="row">';
        recipes.forEach(recipe => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="https://cdn-icons-png.flaticon.com/512/4345/4345581.png" class="card-img-top" alt="${recipe.title}">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.title}</h5>
                            <p class="card-text">Тип: ${recipe.type}</p>
                            <p class="card-text">Сложность: ${recipe.difficulty}</p>
                            <button class="btn btn-primary w-100" onclick="showRecipeDetails(${recipe.id})">Открыть</button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Ошибка загрузки опубликованных рецептов:', error);
    }
}

// Отправка нового рецепта
async function submitNewRecipe() {
    const title = document.getElementById('recipeTitleInput').value;
    const type = document.getElementById('recipeTypeInput').value;
    const difficulty = document.getElementById('recipeDifficultyInput').value;
    const ingredients = document.getElementById('recipeIngredientsInput').value.split('\n').filter(i => i.trim());
    const instructions = document.getElementById('recipeInstructionsInput').value.split('\n').filter(i => i.trim());
    const videoUrl = document.getElementById('recipeVideoInput').value;
    
    try {
        await api.post('/recipes', {
            title,
            type,
            difficulty,
            description: `Рецепт ${title}`,
            ingredients,
            instructions,
            videoUrl,
            authorId: currentUser.id,
            likes: 0
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        // Сброс формы
        document.getElementById('publishRecipeForm').reset();
        
        // Закрытие модального окна
        bootstrap.Modal.getInstance(document.getElementById('publishModal')).hide();
        
        alert('Рецепт успешно опубликован!');
    } catch (error) {
        console.error('Ошибка публикации рецепта:', error);
        alert('Ошибка публикации: ' + (error.response?.data?.message || 'Неизвестная ошибка'));
    }
}