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
    setupShareModal();
}

async function loadRecipeDetails() {
    const response = await sendJsonRequest(`${API_BASE.RECIPE}/recipe/${recipePageState.recipeId}`);
    if (!response.ok) {
        throw new Error(response.data?.message || 'Рецепт не найден');
    }

    const recipe = response.data;
    recipePageState.recipe = recipe;

    document.getElementById('recipeTitle').innerText = recipe.title;
    document.getElementById('recipeDescription').innerText = recipe.description || 'Описание отсутствует.';
    document.getElementById('recipeMeta').innerText = [
        `Тип: ${recipe.dishType?.name || '-'}`,
        `Сложность: ${recipe.recipeDifficulty?.name || '-'}`,
        `Порций: ${recipe.servings}`,
        `Время подготовки: ${formatMinutesToText(recipe.preparation_time)}`,
        `Время готовки: ${formatMinutesToText(recipe.cooking_time)}`,
    ].join(' • ');

    const imageElement = document.getElementById('recipeImage');
    if (recipe.image) {
        imageElement.src = recipe.image;
        imageElement.alt = `Изображение рецепта: ${recipe.title}`;
        imageElement.classList.remove('d-none');
        imageElement.removeAttribute('role');
    } else {
        imageElement.classList.add('d-none');
        imageElement.setAttribute('role', 'presentation');
    }

    if (recipePageState.authorizedUser?.id === recipe.userId) {
        const editButton = document.getElementById('editRecipeButton');
        if (editButton) {
            editButton.classList.remove('d-none');
            editButton.addEventListener('click', () => {
                window.location.href = `edit-recipe.html?id=${recipe.id}`;
            });
        }
    }
    await renderRecipeAuthor(recipe.userId);

    renderIngredients(recipe.recipeIngredients ?? []);
    renderSteps((recipe.steps ?? []).sort((a, b) => a.step_number - b.step_number));
}

async function renderRecipeAuthor(userId) {
    const authorElement = document.getElementById('recipeAuthor');
    if (!authorElement) return;
    if (!Number.isFinite(userId) || userId <= 0) {
        authorElement.innerText = 'Автор: неизвестно';
        return;
    }

    const response = await sendJsonRequest(`${API_BASE.AUTH}/user/${userId}`);
    if (!response.ok) {
        authorElement.innerText = 'Автор: неизвестно';
        return;
    }

    const author = response.data;
    recipePageState.author = author;
    const fullName = `${escapeHtml(author.first_name)} ${escapeHtml(author.last_name)}`.trim();
    authorElement.innerHTML = `Автор: <a href="user.html?id=${author.id}">${fullName || 'Профиль пользователя'}</a>`;
}

function renderIngredients(ingredients) {
    const list = document.getElementById('ingredientsList');
    const counter = document.getElementById('ingredientsCount');
    if (counter) counter.innerText = ingredients.length;
    if (!list) return;

    if (!ingredients.length) {
        list.innerHTML = '<li class=\'list-group-item text-muted\'>Ингредиенты не указаны.</li>';
        return;
    }

    list.innerHTML = '';
    ingredients.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.setAttribute('role', 'listitem');
        const ingredientName = escapeHtml(entry.ingredient?.name || 'Ингредиент');
        const quantity = entry.quantity;
        const unit = entry.unit;
        item.innerHTML = `
            <span>${ingredientName}</span>
            <span class="text-muted" aria-label="Количество: ${quantity} ${unit}">${quantity} ${unit}</span>
        `;
        item.setAttribute('aria-label', `Ингредиент ${index + 1}: ${ingredientName}, количество: ${quantity} ${unit}`);
        list.appendChild(item);
    });
}

function renderSteps(steps) {
    const list = document.getElementById('stepsList');
    if (!list) return;

    if (!steps.length) {
        list.innerHTML = '<div class=\'entity-list-empty\'>Шаги приготовления появятся позже.</div>';
        return;
    }

    list.innerHTML = '';
    steps.forEach((step) => {
        const row = document.createElement('div');
        row.className = 'step-row';
        row.setAttribute('role', 'listitem');
        const stepNumber = step.step_number;
        const instruction = escapeHtml(step.instruction);
        row.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <span class="step-number-badge" aria-hidden="true">${stepNumber}</span>
                <h6 class="mb-0" id="step-title-${stepNumber}">Шаг ${stepNumber}</h6>
            </div>
            <p class="mb-0" aria-labelledby="step-title-${stepNumber}">${instruction}</p>
        `;
        row.setAttribute('aria-label', `Шаг ${stepNumber}: ${instruction}`);
        list.appendChild(row);
    });
}

async function loadComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    container.innerHTML = createLoadingPlaceholder('Загружаем комментарии...');

    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/comment/${recipePageState.recipeId}`);
    if (!response.ok) {
        renderEmptyState(container, 'Не удалось загрузить комментарии.');
        showInlineMessage('recipeAlert', response.data?.message || 'Ошибка загрузки комментариев.');
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
    comments.forEach((comment, index) => {
        const card = document.createElement('div');
        card.className = 'card comment-card mb-3';
        card.setAttribute('role', 'listitem');
        const commentDate = new Date(comment.created_at).toLocaleString('ru-RU');
        const commentContent = escapeHtml(comment.content);
        card.innerHTML = `
            <div class="card-body">
                <div class="comment-meta mb-2" aria-label="Автор комментария и дата">
                    <span>Пользователь #${comment.userId}</span>
                    <time class="ms-2" datetime="${comment.created_at}" aria-label="Дата публикации комментария: ${commentDate}">${commentDate}</time>
                </div>
                <p class="mb-0" aria-label="Текст комментария от пользователя #${comment.userId}">${commentContent}</p>
            </div>
        `;
        card.setAttribute('aria-label', `Комментарий ${index + 1} от пользователя #${comment.userId}`);
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
    const response = await sendJsonRequest(
        `${API_BASE.SOCIAL}/comment/${recipePageState.recipeId}`,
        'POST',
        { content: textarea.value.trim() },
    );

    submitButton.disabled = false;
    if (!response.ok) {
        showInlineMessage('recipeAlert', response.data?.message || 'Не удалось отправить комментарий.');
        return;
    }

    textarea.value = '';
    hideInlineMessage('recipeAlert');
    await loadComments();
}

async function loadLikes() {
    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/recipe/${recipePageState.recipeId}`);
    if (!response.ok) {
        showInlineMessage('recipeAlert', response.data?.message || 'Не удалось получить лайки.');
        return;
    }

    recipePageState.likes = response.data ?? [];
    recipePageState.userLike = recipePageState.authorizedUser
        ? recipePageState.likes.find((like) => like.userId === recipePageState.authorizedUser.id)
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
    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like`, 'POST', {
        recipeId: recipePageState.recipeId,
    });
    likeButton.disabled = false;
    if (!response.ok) {
        showInlineMessage('recipeAlert', response.data?.message || 'Не удалось поставить лайк.');
        return;
    }
    await loadLikes();
}

async function handleUnlike() {
    if (!requireAuthOrRedirect()) return;
    const likeButton = document.getElementById('likeButton');
    likeButton.disabled = true;
    const response = await sendJsonRequest(`${API_BASE.SOCIAL}/like/${recipePageState.userLike.id}`, 'DELETE');
    likeButton.disabled = false;
    if (!response.ok) {
        showInlineMessage('recipeAlert', response.data?.message || 'Не удалось убрать лайк.');
        return;
    }
    await loadLikes();
}

function setupShareModal() {
    const shareLinkInput = document.getElementById('shareLinkInput');
    if (!shareLinkInput) return;
    shareLinkInput.value = window.location.href;
}

function copyShareLink() {
    const shareLinkInput = document.getElementById('shareLinkInput');
    if (!shareLinkInput) return;
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, shareLinkInput.value.length);
    navigator.clipboard.writeText(shareLinkInput.value)
        .then(() => {
            showInlineMessage('recipeAlert', 'Ссылка скопирована в буфер обмена.', 'success');
            setTimeout(() => hideInlineMessage('recipeAlert'), 2500);
        })
        .catch(() => {
            showInlineMessage('recipeAlert', 'Не удалось скопировать ссылку.');
        });
}

