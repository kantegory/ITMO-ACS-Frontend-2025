const url = 'http://localhost:3000';

function loadRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (!recipeId) {
        document.getElementById('recipe-container').innerHTML = '<p>Рецепт не найден</p>';
        return;
    }
    
    const container = document.getElementById('recipe-container');
    
    fetch(`${url}/publicRecipes`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить рецепты');
            }
            return response.json();
        })
        .then(allRecipes => {
            const recipe = allRecipes.find(r => r.id === recipeId);
            
            if (recipe) {
                showRecipe(recipe);
            } else {
                container.innerHTML = '<p>Рецепт не найден</p>';
            }
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>Ошибка загрузки рецепта</p>';
        });
}

function showRecipe(recipe) {
    const likes = JSON.parse(localStorage.getItem('recipeLikes')) || {};
    const stars = JSON.parse(localStorage.getItem('recipeStars')) || {};
    const comments = JSON.parse(localStorage.getItem('recipeComments')) || {};
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const isLiked = likes[recipe.id] || false;
    const isStared = isRecipeSaved(recipe.id);
    const recipeComments = comments[recipe.id] || [];
    const isSubscribed = isUserSubscribedTo(recipe.author);
    
    document.getElementById('recipe-container').innerHTML = `
        <div class="text-center mb-3">
            <h1>${recipe.title}</h1>
            <div class="mt-2">
                <span class="badge bg-secondary me-2">Сложность: ${recipe.difficulty}</span>
                <span class="badge bg-primary me-2">${recipe.type}</span>
            </div>
            ${recipe.author ? `
                <div class="mt-2 d-flex justify-content-center align-items-center gap-3">
                    <p class="mb-0">Автор: <strong>${recipe.author}</strong></p>
                    ${user.id ? `
                        <button class="btn ${isSubscribed ? 'btn-danger' : 'btn-success'}" 
                                onclick="${isSubscribed ? 'unsubscribeFromAuthor' : 'subscribeToAuthor'}('${recipe.author}')">
                            ${isSubscribed ? 'Отписаться' : 'Подписаться'}
                        </button>
                    ` : ''}
                </div>
            ` : ''}
        </div>

        <div class="card mb-4">
            <div class="card-header"><h3>Ингредиенты</h3></div>
            <div class="card-body">
                <ul class="list-group">
                    ${(recipe.ingredients || []).map(ing => `<li class="list-group-item">${ing}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header"><h3>Приготовление</h3></div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h4>Пошаговая инструкция</h4>
                        ${(recipe.steps || []).map((step, index) => `
                            <div class="mb-3">
                                <h5>Шаг ${index + 1}</h5>
                                <p>${step}</p>
                            </div>
                        `).join('')}
                    </div>
                    ${recipe.video ? `
                        <div class="col-md-6">
                            <h4 class="text-center">Видео-инструкция</h4>
                            <video src="${recipe.video}" controls class="w-100" style="max-height: 400px;"></video>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>

        ${recipe.image ? `
            <div class="card mb-4">
                <div class="card-header"><h3>Фото готового блюда</h3></div>
                <div class="card-body text-center">
                    <img src="${recipe.image}" class="img-fluid" alt="${recipe.title}" style="max-height: 400px;">
                </div>
            </div>
        ` : ''}

        <div class="text-center mb-4">
            <button class="btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'} me-2" onclick="toggleLike('${recipe.id}')">
                ${isLiked ? '♥' : '♡'}
            </button>
            ${user.id ? `
                <button class="btn ${isStared ? 'btn-warning' : 'btn-outline-warning'} me-2" 
                        onclick="${isStared ? 'removeFromFavorites' : 'saveRecipeToFavorites'}('${recipe.id}')">
                    ${isStared ? '★' : '☆'}
                </button>
            ` : `
                <button class="btn btn-outline-warning" onclick="alert('Войдите в систему, чтобы сохранять рецепты')">
                    ☆ Сохранить
                </button>
            `}
        </div>

        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h3 class="mb-0">Комментарии</h3>
                <small class="text-muted">${recipeComments.length} комментариев</small>
            </div>
            <div class="card-body">
                ${recipeComments.length > 0 ? 
                    recipeComments.map(comment => `
                        <div class="mb-3 p-2 border rounded">
                            <div class="d-flex justify-content-between">
                                <strong>${comment.user}</strong>
                                <small class="text-muted">${comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : ''}</small>
                            </div>
                            <p class="mb-0 mt-1">${comment.text}</p>
                        </div>
                    `).join('') : 
                    '<p class="text-muted">Пока нет комментариев. Будьте первым!</p>'
                }
                
                <div class="mt-4">
                    <h5>Добавить комментарий:</h5>
                    <div class="input-group">
                        <input type="text" class="form-control" id="commentText" placeholder="Ваш комментарий...">
                        <button class="btn btn-primary" onclick="addComment('${recipe.id}')">Отправить</button>
                    </div>
                    ${!user.id ? '<small class="text-muted d-block mt-1">Вы комментируете как гость</small>' : ''}
                </div>
            </div>
        </div>
    `;
}

function toggleLike(recipeId) {
    const likes = JSON.parse(localStorage.getItem('recipeLikes')) || {};
    likes[recipeId] = !likes[recipeId];
    localStorage.setItem('recipeLikes', JSON.stringify(likes));
    loadRecipe();
}

function toggleStar(recipeId) {
    const stars = JSON.parse(localStorage.getItem('recipeStars')) || {};
    stars[recipeId] = !stars[recipeId];
    localStorage.setItem('recipeStars', JSON.stringify(stars));
    loadRecipe();
}

function addComment(recipeId) {
    const commentText = document.getElementById('commentText').value;
    if (!commentText.trim()) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || user.email?.split('@')[0] || 'Гость';
    
    const comments = JSON.parse(localStorage.getItem('recipeComments')) || {};
    if (!comments[recipeId]) comments[recipeId] = [];
    
    comments[recipeId].push({
        user: username,
        text: commentText,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('recipeComments', JSON.stringify(comments));
    document.getElementById('commentText').value = '';
    loadRecipe();
}

function saveRecipeToFavorites(recipeId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const favorites = JSON.parse(localStorage.getItem('userFavorites')) || {};
    if (!favorites[user.id]) {
        favorites[user.id] = [];
    }
    
    if (!favorites[user.id].includes(recipeId)) {
        favorites[user.id].push(recipeId);
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
        loadRecipe();
    }
}

function removeFromFavorites(recipeId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = JSON.parse(localStorage.getItem('userFavorites')) || {};
    
    if (favorites[user.id]) {
        favorites[user.id] = favorites[user.id].filter(id => id !== recipeId);
        localStorage.setItem('userFavorites', JSON.stringify(favorites));
        loadRecipe();
    }
}

function subscribeToAuthor(author) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions')) || {};
    if (!subscriptions[user.id]) {
        subscriptions[user.id] = [];
    }
    
    if (!subscriptions[user.id].includes(author)) {
        subscriptions[user.id].push(author);
        localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));
        loadRecipe();
    } else {
return    }
}

function unsubscribeFromAuthor(author) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions')) || {};
    
    if (subscriptions[user.id]) {
        subscriptions[user.id] = subscriptions[user.id].filter(a => a !== author);
        localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));
        loadRecipe();
    }
}

function isUserSubscribedTo(author) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const subscriptions = JSON.parse(localStorage.getItem('userSubscriptions')) || {};
    
    return subscriptions[user.id]?.includes(author) || false;
}

function isRecipeSaved(recipeId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const favorites = JSON.parse(localStorage.getItem('userFavorites')) || {};
    
    return favorites[user.id]?.includes(recipeId) || false;
}

document.addEventListener('DOMContentLoaded', loadRecipe);