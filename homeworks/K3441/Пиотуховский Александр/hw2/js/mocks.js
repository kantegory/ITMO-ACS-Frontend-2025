function parseMarkdown(text) {
    if (!text) return '';

    // Заголовок ## 
    text = text.replace(/^## (.+)$/gm, '<h5>$1</h5>');

    // **Жирный текстbold**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // __Подчёркнутый текст__
    text = text.replace(/__(.+?)__/g, '<u>$1</u>');

    // *Курсив*
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // ~~Зачёркнутый текст~~
    text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Перевод строк
    const paragraphs = text
        .split('\n\n')
        .map(p => {
            p = p.trim();
            if (p.startsWith('<h5>')) return p;
            if (p) return `<p>${p.replace(/\n/g, '<br>')}</p>`;
            return '';
        })
        .filter(p => p);

    return paragraphs.join('\n');
}


async function loadJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            console.error(`Failed to load ${path}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${path}:`, error);
        return null;
    }
}

function getDifficultyBadge(difficulty) {
    if (difficulty === 1) return { class: 'bg-success', text: 'Легко' };
    if (difficulty === 2) return { class: 'bg-warning text-dark', text: 'Средне' };
    return { class: 'bg-danger', text: 'Сложно' };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'сегодня';
    if (diffDays === 1) return 'вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`;

    return date.toLocaleDateString('ru-RU');
}

function renderRecipeCard(recipe, user) {
    const diffBadge = getDifficultyBadge(recipe.difficulty);
    const likes = Math.floor(Math.random() * 500 + 100);
    const comments = Math.floor(Math.random() * 100 + 10);

    return `
        <article class="recipe-card" data-recipe-id="${recipe.id}" role="listitem">
            <div class="recipe-image">
                <img src="https://placehold.co/350x250/ff6b6b/ffffff?text=${encodeURIComponent(recipe.title.substring(0, 20))}" alt="Фото рецепта: ${recipe.title}">
                <button class="btn-favorite" onclick="toggleFavorite(this)" aria-label="Добавить в избранное" aria-pressed="false">
                    <i class="bi bi-heart" aria-hidden="true"></i>
                </button>
            </div>
            <div class="recipe-body">
                <div class="recipe-tags mb-2" role="group" aria-label="Категории рецепта">
                    <span class="badge bg-light text-dark">${recipe.dishType.title}</span>
                    <span class="badge ${diffBadge.class}">${diffBadge.text}</span>
                </div>
                <h5 class="recipe-title">
                    <a href="recipe.html?id=${recipe.id}">${recipe.title}</a>
                </h5>
                <p class="recipe-description">
                    ${recipe.description || ''}
                </p>
                <div class="recipe-footer">
                    <div class="recipe-author">
                        <img src="${user?.photoUrl || 'https://placehold.co/32x32/999/fff?text=?'}" alt="Фото автора: ${user?.firstName || 'Пользователь'} ${user?.lastName || ''}">
                        <span>${user?.firstName || 'Пользователь'} ${user?.lastName || ''}</span>
                    </div>
                    <div class="recipe-stats" role="group" aria-label="Статистика рецепта">
                        <span class="me-3" aria-label="${likes} лайков">
                            <i class="bi bi-heart-fill text-danger" aria-hidden="true"></i> ${likes}
                        </span>
                        <span aria-label="${comments} комментариев">
                            <i class="bi bi-chat-fill text-primary" aria-hidden="true"></i> ${comments}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function renderRecipeBlocks(blocks) {
    if (!blocks || !Array.isArray(blocks)) return '';

    return blocks.map(block => {
        if (block.blockType === 'text') {
            return `
                <div class="recipe-block">
                    <div class="recipe-block-text">
                        ${parseMarkdown(block.content)}
                    </div>
                </div>
            `;
        } else if (block.blockType === 'image') {
            return `
                <div class="recipe-block">
                    <div class="recipe-block-image">
                        <img
                            src="${block.content}"
                            alt="Шаг ${block.displayOrder}"
                            onclick="openImageModal(this.src)"
                            style="cursor: pointer;"
                        >
                    </div>
                </div>
            `;
        }
        return '';
    }).join('\n');
}

function renderIngredients(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) return '';

    return ingredients.map((ing, index) => `
        <li class="ingredient-item">
            <input type="checkbox" id="ing${index}" class="form-check-input me-2">
            <label for="ing${index}">${ing.name}</label>
        </li>
    `).join('\n');
}

function renderComment(comment, user) {
    return `
        <div class="comment-item">
            <img src="${user?.photoUrl || 'https://placehold.co/50x50/999/fff?text=?'}" alt="User" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${user?.firstName || 'Пользователь'} ${user?.lastName || ''}</span>
                    <span class="comment-time">${formatDate(comment.createdAt)}</span>
                </div>
                <p class="comment-text">${comment.content}</p>
            </div>
        </div>
    `;
}

function renderCommentsTree(comments, users, parentId = null, level = 0) {
    const filteredComments = comments.filter(c => c.parentId === parentId);

    if (filteredComments.length === 0) {
        return '';
    }

    return filteredComments.map(comment => {
        const user = users.find(u => u.id === comment.userId);
        const marginLeft = level * 40;

        const commentHtml = `
            <div class="comment-item" style="margin-left: ${marginLeft}px">
                <img src="${user?.photoUrl || 'https://placehold.co/50x50/999/fff?text=?'}" alt="User" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${user?.firstName || 'Пользователь'} ${user?.lastName || ''}</span>
                        <span class="comment-time">${formatDate(comment.createdAt)}</span>
                    </div>
                    <p class="comment-text">${comment.content}</p>
                    ${level < 3 ? '<button class="btn btn-link btn-sm p-0 comment-reply-btn"><i class="bi bi-reply me-1"></i>Ответить</button>' : ''}
                </div>
            </div>
        `;

        const replies = renderCommentsTree(comments, users, comment.id, level + 1);

        return commentHtml + replies;
    }).join('');
}

function renderPostCard(post, user) {
    const preview = post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '');
    const hasImages = post.images && post.images.length > 0;
    const hasRecipes = post.recipes && post.recipes.length > 0;

    return `
        <div class="post-card mb-4" data-post-id="${post.id}">
            <div class="post-header">
                <div class="d-flex align-items-center mb-3">
                    <img src="${user?.photoUrl || 'https://placehold.co/50x50/999/fff?text=?'}" alt="${user?.username || 'User'}" class="rounded-circle me-3" width="50" height="50">
                    <div>
                        <h5 class="mb-0">${user?.firstName || 'Пользователь'} ${user?.lastName || ''}</h5>
                        <small class="text-muted">${formatDate(post.createdAt)}</small>
                    </div>
                </div>
                <h4 class="post-title">
                    <a href="post.html?id=${post.id}">${post.title}</a>
                </h4>
            </div>
            <div class="post-preview">
                <p>${preview}</p>
            </div>
            <div class="post-meta mt-3">
                ${hasImages ? `<span class="badge bg-secondary me-2"><i class="bi bi-image me-1"></i>${post.images.length} фото</span>` : ''}
                ${hasRecipes ? `<span class="badge bg-secondary me-2"><i class="bi bi-book me-1"></i>${post.recipes.length} рецепт(а)</span>` : ''}
            </div>
            <div class="post-footer mt-3 pt-3 border-top">
                <div class="d-flex justify-content-between">
                    <div class="post-stats">
                        <span class="me-3">
                            <i class="bi bi-heart"></i> ${Math.floor(Math.random() * 200 + 50)}
                        </span>
                        <span>
                            <i class="bi bi-chat"></i> ${Math.floor(Math.random() * 50 + 5)}
                        </span>
                    </div>
                    <a href="post.html?id=${post.id}" class="btn btn-sm btn-outline-primary">Читать полностью</a>
                </div>
            </div>
        </div>
    `;
}

function renderRecipeCardMini(recipe, user) {
    const diffBadge = getDifficultyBadge(recipe.difficulty);

    return `
        <a href="recipe.html?id=${recipe.id}" class="recipe-card-mini text-decoration-none">
            <div class="d-flex align-items-center">
                <img src="https://placehold.co/80x80/ff6b6b/ffffff?text=Рецепт" alt="${recipe.title}" class="rounded me-3">
                <div>
                    <h6 class="mb-1">${recipe.title}</h6>
                    <div>
                        <span class="badge bg-light text-dark small">${recipe.dishType.title}</span>
                        <span class="badge ${diffBadge.class} small">${diffBadge.text}</span>
                    </div>
                </div>
            </div>
        </a>
    `;
}

window.MockData = {
    loadJSON,
    parseMarkdown,
    getDifficultyBadge,
    formatDate,
    renderRecipeCard,
    renderRecipeBlocks,
    renderIngredients,
    renderComment,
    renderCommentsTree,
    renderPostCard,
    renderRecipeCardMini
};
