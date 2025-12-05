import { fetchBlogPostById, fetchBlogPosts } from './api.js';
import { state } from './state.js';
import { renderPlaceholder } from './utils.js';

export async function initBlogPage() {
    const container = document.getElementById('blogContainer');
    if (!container) {
        return;
    }

    renderPlaceholder(container, 'Загружаем статьи...');

    try {
        state.blogPosts = await fetchBlogPosts();
        renderBlogPosts(state.blogPosts);
        initBlogFilters();
    } catch (error) {
        console.error(error);
    }
}

export async function initBlogPostPage() {
    const titleElement = document.getElementById('postTitle');
    if (!titleElement) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'), 10);

    if (!Number.isFinite(postId)) {
        titleElement.textContent = 'Статья не найдена';
        return;
    }

    try {
        const post = await fetchBlogPostById(postId);
        renderBlogPost(post);
    } catch (error) {
        console.error(error);
        titleElement.textContent = 'Не удалось загрузить статью';
    }
}

function initBlogFilters() {
    const searchInput = document.getElementById('blogSearch');
    const categorySelect = document.getElementById('blogCategory');

    if (searchInput) {
        searchInput.addEventListener('input', applyBlogFilters);
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', applyBlogFilters);
    }
}

function applyBlogFilters() {
    if (!state.blogPosts.length) {
        return;
    }

    const searchValue = document.getElementById('blogSearch')?.value.trim().toLowerCase() || '';
    const categoryValue = document.getElementById('blogCategory')?.value || 'all';

    let filtered = [...state.blogPosts];

    if (categoryValue !== 'all') {
        filtered = filtered.filter(post => post.category === categoryValue);
    }

    if (searchValue) {
        filtered = filtered.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchValue);
            const contentMatch = (post.content || '').toLowerCase().includes(searchValue);
            return titleMatch || contentMatch;
        });
    }

    renderBlogPosts(filtered);
}

function renderBlogPosts(postsToRender) {
    const container = document.getElementById('blogContainer');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    if (!postsToRender.length) {
        container.innerHTML = '<p class="text-muted">Статьи не найдены. Попробуйте изменить фильтры или поиск.</p>';
        return;
    }

    const categoryNames = {
        nutrition: 'Питание',
        health: 'Здоровье',
        motivation: 'Мотивация'
    };

    postsToRender.forEach(post => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card blog-card" onclick="goToBlogPost(${post.id})">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">
                        <strong>Категория:</strong> ${categoryNames[post.category] || '-'}<br>
                        <strong>Дата:</strong> ${post.date}
                    </p>
                    <a href="blog-post.html?id=${post.id}" class="btn btn-primary">Читать</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function goToBlogPost(id) {
    window.location.href = `blog-post.html?id=${id}`;
}

function renderBlogPost(post) {
    const categoryNames = {
        nutrition: 'Питание',
        health: 'Здоровье',
        motivation: 'Мотивация'
    };

    document.getElementById('postTitle').textContent = post.title;
    document.getElementById('postCategory').textContent = `Категория: ${categoryNames[post.category] || '-'}`;
    document.getElementById('postDate').textContent = `Дата: ${post.date}`;
    document.getElementById('postAuthor').textContent = `Автор: ${post.author}`;
    document.getElementById('postImage').src = post.image;
    document.getElementById('postContent').innerHTML = post.content;
}

window.goToBlogPost = goToBlogPost;
