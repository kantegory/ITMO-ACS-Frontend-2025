// URL API - 3000 порт базовый
const API_URL = 'http://localhost:3000';

// текущий пользователь
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ОБЩЕЕ

// ф-я для fetch с обработкой ошибок
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        throw error;
    }
}

// обновление интерфейса навигации
function updateNavbar() {
    const navDiv = document.querySelector('.navbar div');
    
    if (currentUser) {
        navDiv.innerHTML = `
            <span class="navbar-text me-3">Привет, ${currentUser.name}!</span>
            <button class="btn btn-outline-danger" onclick="logout()">Выйти</button>
        `;
    } else {
        navDiv.innerHTML = `
            <button class="btn btn-outline-secondary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Вход</button>
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#registerModal">Регистрация</button>
        `;
    }
}

// РАБОТА С РЕЦЕПТАМИ

// загрузка рецептов
async function loadRecipes() {
    try {
        const recipes = await fetchData(`${API_URL}/recipes`);
        displayRecipes(recipes);
    } catch {
        document.getElementById('recipesContainer').innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    Не удалось загрузить рецепты
                </div>
            </div>
        `;
    }
}

// фильтрация рецептов
async function filterRecipes() {
    const type = document.getElementById('typeFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    
    let url = `${API_URL}/recipes`;
    const params = [];
    
    if (type) params.push(`type=${type}`);
    if (difficulty) params.push(`difficulty=${difficulty}`);
    
    if (params.length > 0) url += `?${params.join('&')}`;
    
    try {
        const recipes = await fetchData(url);
        displayRecipes(recipes);
    } catch {
        alert('Не удалось применить фильтры');
    }
}

// отображение рецептов
function displayRecipes(recipes) {
    const container = document.getElementById('recipesContainer');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">Рецепты не найдены</p></div>';
        return;
    }
    
    container.innerHTML = recipes.map(recipe => `
        <div class="col-md-6 col-lg-4">
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image w-100 mb-3">
                <h5>${recipe.title}</h5>
                <p class="text-muted">${recipe.description}</p>
                <div class="recipe-stats d-flex justify-content-between">
                    <span>${recipe.type}</span>
                    <span>${recipe.difficulty}</span>
                    <span>❤️ ${recipe.likes}</span>
                    <span>💬 ${recipe.comments}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm mt-2 w-100" onclick="viewRecipe(${recipe.id})">
                    Смотреть рецепт
                </button>
                ${currentUser ? `
                    <button class="btn btn-outline-success btn-sm mt-1 w-100" onclick="likeRecipe(${recipe.id})">
                        ❤️ Лайк
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// просмотреть рецепт
async function viewRecipe(id) {
    try {
        const recipe = await fetchData(`${API_URL}/recipes/${id}`);
        
        const ingredients = recipe.ingredients.map(ing => `• ${ing}`).join('\n');
        const instructions = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
        
        alert(`🍳 ${recipe.title}\n\n📖 Описание: ${recipe.description}\n\n🛒 Ингредиенты:\n${ingredients}\n\n👩‍🍳 Приготовление:\n${instructions}\n\n⭐ Сложность: ${recipe.difficulty}\n🍽️ Тип: ${recipe.type}\n❤️ Лайков: ${recipe.likes}\n💬 Комментариев: ${recipe.comments}`);
    } catch {
        alert('Не удалось загрузить рецепт');
    }
}

// лайкнуть рецепт
async function likeRecipe(id) {
    if (!currentUser) {
        alert('Для оценки рецептов необходимо войти в систему');
        return;
    }
    
    try {
        // получаем текущий рецепт
        const recipe = await fetchData(`${API_URL}/recipes/${id}`);
        
        // обновляем количество лайков
        const updatedRecipe = { ...recipe, likes: recipe.likes + 1 };
        
        await fetchData(`${API_URL}/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecipe)
        });
        
        alert('Лайк добавлен!');
        await loadRecipes();
    } catch {
        alert('Не удалось добавить лайк');
    }
}

// АВТОРИЗАЦИЯ

// вход
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    try {
        const users = await fetchData(`${API_URL}/users?email=${email}&password=${password}`);
        
        if (users.length === 0) {
            alert('Неверный email или пароль');
            return;
        }
        
        currentUser = users[0];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert(`Добро пожаловать, ${currentUser.name}!`);
        
        // закрываем модальное окно
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        
        updateNavbar();
        await loadRecipes();
        
    } catch {
        alert('Ошибка при входе. Проверьте подключение к серверу.');
    }
}

// регистрация
async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (!name || !email || !password) {
        alert('Заполните все поля');
        return;
    }
    
    try {
        // проверка, нет ли уже такого емайла
        const existingUsers = await fetchData(`${API_URL}/users?email=${email}`);
        
        if (existingUsers.length > 0) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        // создание нового пользователя
        const newUser = { name, email, password };
        
        const createdUser = await fetchData(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });
        
        currentUser = createdUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert('Регистрация успешна!');
        
        // закрытие модального окна
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        
        updateNavbar();
        await loadRecipes();
        
    } catch {
        alert('Ошибка при регистрации');
    }
}

// выход 
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavbar();
    loadRecipes();
    alert('Вы вышли из системы');
}

// ИНИЦИАЛИЗАЦИЯ

// загрузка страницы
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    loadRecipes();
});