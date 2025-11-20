function getLikes() {
    return JSON.parse(localStorage.getItem('recipeLikes')) || {};
}

function saveLikes(likes) {
    localStorage.setItem('recipeLikes', JSON.stringify(likes));
}

function getStars() {
    return JSON.parse(localStorage.getItem('recipeStars')) || {};
}

function saveStars(stars) {
    localStorage.setItem('recipeStars', JSON.stringify(stars));
}

function getComments() {
    return JSON.parse(localStorage.getItem('recipeComments')) || {};
}

function saveComments(comments) {
    localStorage.setItem('recipeComments', JSON.stringify(comments));
}

function getSubscriptions() {
    return JSON.parse(localStorage.getItem('userSubscriptions')) || [];
}

function saveSubscriptions(subscriptions) {
    localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions));
}

function loadRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const recipe = recipes[recipeId];
    
    if (!recipe) {
        document.getElementById('recipe-container').innerHTML = '<p>Рецепт не найден</p>';
        return;
    }
    const likes = getLikes();
    const stars = getStars();
    const comments = getComments();
    const subscriptions = getSubscriptions();
    
    const isLiked = likes[recipeId] || false;
    const isStared = stars[recipeId] || false;
    const recipeComments = comments[recipeId] || [
        {user: "anonymous", text: "Спасибо, все просто и понятно"}
    ];
    const isSubscribed = subscriptions.includes(recipe.author);

    document.title = recipe.title;
    document.getElementById('recipe-container').innerHTML = `
        <div class="text-center mb-3">
            <h1>${recipe.title}</h1>
            <div class="mt-2">
                <span class="badge bg-secondary me-2">Сложность: ${recipe.difficulty}</span>
                <span class="badge bg-primary me-2">${recipe.type}</span>
            </div>
            <div class="mt-2 d-flex justify-content-between align-items-center">
                <p class="mb-0">Автор: <strong>${recipe.author}</strong></p>
                <button class="btn ${isSubscribed ? 'btn-danger' : 'btn-success'}" onclick="toggleSubscription('${recipe.author}')">
                    ${isSubscribed ? 'Отписаться' : 'Подписаться'}
                </button>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3>Ингредиенты</h3>
            </div>
            <div class="card-body">
                <ul class="list-group">
                    ${recipe.ingredients.map(ing => `<li class="list-group-item">${ing}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="card mb-4">
            <div class="card-header">
                <h3>Приготовление</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h4>Пошаговая инструкция</h4>
                        ${recipe.steps.map((step, index) => `
                            <div class="mb-3">
                                <h5>Шаг ${index + 1}</h5>
                                <p>${step}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="col-md-6">
                        <h4 class="text-center">Видео-инструкция</h4>
                        <video src="${recipe.video}" controls class="w-100" style="max-height: 600px;"></video>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Фото готового блюда</h3>
            </div>
            <div class="card-body text-center">
                <img src="${recipe.image}" class="img-fluid" alt="${recipe.title}" style="max-height: 400px; width: auto;">
            </div>
        </div>

        <footer>
            <div class="mb-4 mt-2 d-flex justify-content-center align-items-center gap-3">
                <button class="btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}" onclick="toggleLike('${recipeId}')">
                        ${isLiked ? '♥' : '♡'}</button>
                <button class="btn ${isStared ? 'btn-warning' : 'btn-outline-warning'}" onclick="toggleStar('${recipeId}')">
                        ${isStared ? '★' : '☆'}</button>
            </div>
            <div class="card mb-4">
                <div class="card-header">
                    <h3>Комментарии</h3>
                </div>
                <div class="card-body">
                    ${recipeComments.map(comment => `
                        <div class="mb-3 p-2 border rounded">
                            <strong>${comment.user}:</strong>
                            <p class="mb-0">${comment.text}</p>
                        </div>
                    `).join('')}
                    
                    <div class="mt-4">
                        <h5>Добавить комментарий:</h5>
                        <div class="input-group">
                            <input type="text" class="form-control" id="commentText" placeholder="Ваш комментарий...">
                            <button class="btn btn-primary" onclick="addComment('${recipeId}')">Отправить</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

function toggleLike(recipeId) {
    const likes = getLikes();
    likes[recipeId] = !likes[recipeId];
    saveLikes(likes);
    loadRecipe(); 
}

function toggleStar(recipeId) {
    const stars = getStars();
    stars[recipeId] = !stars[recipeId];
    saveStars(stars);
    loadRecipe(); 
}

function addComment(recipeId) {
    const commentText = document.getElementById('commentText').value;
    if (!commentText.trim()) return;
    
    const comments = getComments();
    if (!comments[recipeId]) comments[recipeId] = [];
    
    comments[recipeId].push({
        user: "me",
        text: commentText
    });
    
    saveComments(comments);
    document.getElementById('commentText').value = '';
    loadRecipe(); 
}

function toggleSubscription(author) {
    const subscriptions = getSubscriptions();
    const index = subscriptions.indexOf(author);
    
    if (index > -1) {
        subscriptions.splice(index, 1); 
    } else {
        subscriptions.push(author); 
    }
    
    saveSubscriptions(subscriptions);
    loadRecipe(); 
}

loadRecipe();