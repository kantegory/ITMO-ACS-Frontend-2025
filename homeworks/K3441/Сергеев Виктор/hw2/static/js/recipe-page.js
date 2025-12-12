const recipePageState = {
    recipeId: null,
    recipe: null,
    authorizedUser: null,
    likes: [],
    userLike: null,
    author: null,
};

document.addEventListener('DOMContentLoaded', () => {
    initRecipePage().catch((error) => {
        console.error(error);
        showInlineMessage('recipeAlert', error.message || 'Не удалось загрузить рецепт');
    });
});

async function initRecipePage() {
    requireAuthOrRedirect()

    const recipeId = Number(getQueryParam('id'));
    if (!Number.isInteger(recipeId)) {
        showInlineMessage('recipeAlert', 'Укажите рецепт через параметр ?id=');
        return;
    }

    recipePageState.recipeId = recipeId;
    recipePageState.authorizedUser = await fetchCurrentUserOrNull();

    await loadRecipeDetails();
    await Promise.all([
        loadLikes(),
        loadComments(),
    ]);

    setupCommentForm();
}

async function loadRecipeDetails() {
    const recipeResponse = await sendRequest(`${BACKEND_URL}/api/recipe/${recipePageState.recipeId}`);
    if (!recipeResponse.success) {
        throw new Error(recipeResponse.error || 'Рецепт не найден');
    }

    const recipe = recipeResponse.data;
    recipePageState.recipe = recipe;
    recipePageState.author = recipe.author ?? null

    document.getElementById('recipeTitle').innerText = recipe.title;
    document.getElementById('recipeDescription').innerText = recipe.description || 'Описание отсутствует.';
    document.getElementById('recipeMeta').innerText = [
        `Сложность: ${recipe.difficulty || '-'}`,
        `Время готовки: ${formatMinutesToText(recipe.cooking_time)}`,
    ].join(' • ');

    const imageElement = document.getElementById('recipeImage');
    if (recipe.image_url) {
        imageElement.src = recipe.image_url;
        imageElement.alt = `Изображение рецепта: ${recipe.title}`;
        imageElement.classList.remove('d-none');
        imageElement.removeAttribute('role');
    } else {
        imageElement.classList.add('d-none');
        imageElement.setAttribute('role', 'presentation');
    }

    if (recipePageState.authorizedUser?.id === recipe.author.id) {
        const editButton = document.getElementById('editRecipeButton');
        if (editButton) {
            editButton.classList.remove('d-none');
            editButton.addEventListener('click', () => {
                window.location.href = `recipe_edit.html?id=${recipe.id}`;
            });
        }
    }

    renderRecipeAuthor();
    await renderIngredients();
    await renderTags();
    await renderSteps();
}

function renderRecipeAuthor() {
    const authorElement = document.getElementById('recipeAuthor');
    if (!authorElement) return;
    if (!recipePageState.author) {
        authorElement.innerText = 'Автор: неизвестно';
        return;
    }

    const author = recipePageState.author;
    authorElement.innerHTML = `Автор: <a href="user.html?id=${author.id}">${author.username || 'Профиль пользователя'}</a>`;
}

async function renderIngredients() {
    const ingredientsResponse = await sendRequest(`${BACKEND_URL}/api/recipeingredient/?recipe_id=${recipePageState.recipeId}`);
    if (!ingredientsResponse.success) {
        throw new Error(ingredientsResponse.error || "Ингредиенты не найдены");
    }

    const ingredients = ingredientsResponse.data;    
    const list = document.getElementById('ingredientsList');
    const counter = document.getElementById('ingredientsCount');
    if (counter) counter.innerText = ingredients.length;
    if (!list) return;

    if (!ingredients.length) {
        list.innerHTML = '<li class=\'list-group-item text-muted\'>Ингредиенты не указаны.</li>';
        return;
    }

    list.innerHTML = '';
    ingredients.forEach((entry) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.setAttribute('role', 'listitem');
        const name = escapeHtml(entry.ingredient?.name || 'Ингредиент');
        const amount = entry.amount;
        const unit = entry.unit;
        item.innerHTML = `
            <span>${name}</span>
            <span class="text-muted">${amount} ${unit}</span>
        `;
        item.setAttribute("aria-label", `Ингредиент ${name}: количество ${amount} ${unit}`)
        list.appendChild(item);
    });
}

async function renderTags() {
    const tagsResponse = await sendRequest(`${BACKEND_URL}/api/recipetag/?recipe_id=${recipePageState.recipeId}`);
    if (!tagsResponse.success) {
        throw new Error(tagsResponse.error || "Теги не найдены");
    }

    const tags = tagsResponse.data;
    const list = document.getElementById("tagsList");
    const counter = document.getElementById("tagsCount");
    if (counter) counter.innerText = tags.length;
    if (!list) return;

    if (!tags.length) {
        list.innerHTML = '<li class=\'list-group-item text-muted\'>Теги не указаны.</li>';
        return;
    }

    list.innerHTML = "";
    tags.forEach((entry) => {
        const item = document.createElement('li');
        item.className = 'list-group-item align-items-center';
        item.setAttribute('role', 'listitem');
        const name = escapeHtml(entry.tag?.name || 'Тег');
        item.innerHTML = `
            <span>${name}</span>
        `;
        item.setAttribute("aria-label", `Тег: ${name}`);
        list.appendChild(item);
    });
}

async function renderSteps() {
    const recipeStepsResponse = await sendRequest(`${BACKEND_URL}/api/recipestep/?recipe_id=${recipePageState.recipeId}`);
    if (!recipeStepsResponse.success) {
        throw new Error(recipeStepsResponse.error || "Шаги не найдены");
    }

    const recipeSteps = recipeStepsResponse.data;
    const list = document.getElementById('stepsList');
    if (!list) return;

    if (!recipeSteps.length) {
        list.innerHTML = '<div class=\'entity-list-empty\'>Шаги приготовления появятся позже.</div>';
        return;
    }

    list.innerHTML = '';
    recipeSteps.forEach((step) => {
        const item = document.createElement('div');
        item.className = 'step-row';
        item.setAttribute('role', 'listitem');
        const stepNumber = step.step_number;
        const instruction = escapeHtml(step.instruction);
        item.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <span class="step-number-badge">${stepNumber}</span>
                <h6 id="stepHeading${stepNumber}" class="mb-0">Шаг ${stepNumber}</h6>
            </div>
            <p class="mb-0">${instruction}</p>
        `;
        item.setAttribute("aria-labelledby", `stepHeading${stepNumber}`)
        list.appendChild(item);
    });
}

async function loadComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    container.innerHTML = createLoadingPlaceholder('Загружаем комментарии...');

    const response = await sendRequest(`${BACKEND_URL}/api/comment/?recipe_id=${recipePageState.recipeId}`);
    if (!response.success) {
        renderEmptyState(container, 'Не удалось загрузить комментарии.');
        showInlineMessage('recipeAlert', response.error || 'Ошибка загрузки комментариев.');
        return;
    }

    const comments = response.data ?? [];
    const commentsCounter = document.getElementById('commentsCount');
    if (commentsCounter) commentsCounter.innerText = comments.length;
    if (!comments.length) {
        renderEmptyState(container, 'Комментариев пока нет.');
        return;
    }

    container.innerHTML = '';
    comments.forEach((comment) => {
        const card = document.createElement('div');
        card.className = 'card comment-card mb-3';
        card.setAttribute('role', 'listitem');
        const commentUserId = comment.user.id;
        const commentContent = escapeHtml(comment.comment);
        const commentDate = new Date(comment.created_at).toLocaleString();
        card.innerHTML = `
            <div class="card-body">
                <div class="comment-meta mb-2" aria-label="Данные о комментаторе">
                    <span>Пользователь #${commentUserId}</span>
                    <span class="ms-2">${commentDate}</span>
                </div>
                <p class="mb-0" aria-label="Текст комментария">${commentContent}</p>
            </div>
        `;
        card.setAttribute("aria-label", `Комментарий от ${commentUserId}`)
        container.appendChild(card);
    });
}

function setupCommentForm() {
    const form = document.getElementById('commentForm');
    const wrapper = document.getElementById('commentFormWrapper');
    if (!form || !wrapper) return;

    if (!recipePageState.authorizedUser) {
        wrapper.innerHTML = `
            <div class="alert alert-info mb-0">
                Чтобы оставить комментарий, <a href="login.html" class="alert-link">войдите</a> в аккаунт.
            </div>
        `;
        return;
    }

    form.addEventListener('submit', handleCommentSubmit);
}

async function handleCommentSubmit(event) {
    event.preventDefault();
    if (!requireAuthOrRedirect()) return;
    const textarea = document.getElementById('commentText');
    const submitButton = document.getElementById('commentSubmitButton');
    if (!textarea.value.trim()) {
        showInlineMessage('recipeAlert', 'Введите текст комментария.');
        return;
    }

    submitButton.disabled = true;
    const addCommentResponse = await sendRequest(
        `${BACKEND_URL}/api/comment/`,
        'POST',
        { 
            comment: textarea.value.trim(),
            recipe_id: recipePageState.recipeId,
            user_id: recipePageState.authorizedUser?.id
        },
    );

    submitButton.disabled = false;
    if (!addCommentResponse.success) {
        showInlineMessage('recipeAlert', addCommentResponse.error || 'Не удалось отправить комментарий.');
        return;
    }

    textarea.value = '';
    hideInlineMessage('recipeAlert');
    await loadComments();
}

async function loadLikes() {
    const likeResponse = await sendRequest(`${BACKEND_URL}/api/like/?recipe_id=${recipePageState.recipeId}`);
    if (!likeResponse.success) {
        showInlineMessage('recipeAlert', likeResponse.error || 'Не удалось получить лайки.');
        return;
    }

    recipePageState.likes = likeResponse.data ?? [];
    recipePageState.userLike = recipePageState.authorizedUser
        ? recipePageState.likes.find((like) => like.user.id === recipePageState.authorizedUser.id)
        : null;

    updateLikesUi();
}

function updateLikesUi() {
    const counter = document.getElementById('likesCount');
    const likeButton = document.getElementById('likeButton');
    if (counter) counter.innerText = `${recipePageState.likes.length}`;

    if (!likeButton) return;
    if (!recipePageState.authorizedUser) {
        likeButton.innerText = 'Войти, чтобы поставить лайк';
        likeButton.disabled = false;
        likeButton.onclick = () => redirectToLogin();
        return;
    }

    if (recipePageState.userLike) {
        likeButton.classList.remove('btn-outline-primary');
        likeButton.classList.add('btn-primary');
        likeButton.innerText = 'Убрать лайк';
        likeButton.setAttribute('aria-label', 'Убрать лайк с рецепта');
        likeButton.setAttribute('aria-pressed', 'true');
        likeButton.onclick = handleUnlike;
    } else {
        likeButton.classList.add('btn-outline-primary');
        likeButton.classList.remove('btn-primary');
        likeButton.innerText = 'Нравится';
        likeButton.setAttribute('aria-label', 'Поставить лайк рецепту');
        likeButton.setAttribute('aria-pressed', 'false');
        likeButton.onclick = handleLike;
    }
}

async function handleLike() {
    if (!requireAuthOrRedirect()) return;
    const likeButton = document.getElementById('likeButton');
    likeButton.disabled = true;
    const addLikeResponse = await sendRequest(`${BACKEND_URL}/api/like`, 'POST', {
        recipe_id: recipePageState.recipeId,
        user_id: recipePageState.authorizedUser.id,
    });
    likeButton.disabled = false;
    if (!addLikeResponse.success) {
        showInlineMessage('recipeAlert', addLikeResponse.error || 'Не удалось поставить лайк.');
        return;
    }
    await loadLikes();
}

async function handleUnlike() {
    if (!requireAuthOrRedirect()) return;
    const likeButton = document.getElementById('likeButton');
    likeButton.disabled = true;
    const deleteLikeResponse = await sendRequest(`${BACKEND_URL}/api/like/${recipePageState.userLike.id}`, 'DELETE');
    likeButton.disabled = false;
    if (!deleteLikeResponse.success) {
        showInlineMessage('recipeAlert', deleteLikeResponse.error || 'Не удалось убрать лайк.');
        return;
    }
    await loadLikes();
}
