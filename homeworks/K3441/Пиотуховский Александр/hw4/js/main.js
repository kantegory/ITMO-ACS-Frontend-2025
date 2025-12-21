let currentUser = JSON.parse(localStorage.getItem('current_user')) || null;

let favorites = JSON.parse(localStorage.getItem('favorites')) || {
    recipes: [],
    posts: []
};


document.addEventListener('DOMContentLoaded', function () {
    highlightActivePage();
    updateAuthUI();
    initializeFavorites();
    initializeComments();
    initializeTabs();
    initializeFilters();
});


function updateAuthUI() {
    const authButtons = document.getElementById('auth-buttons');
    if (!authButtons) return;

    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('current_user'));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (token && user) {
        const profileLink = currentPage === 'profile.html' ? '' :
            '<li><a class="dropdown-item" href="profile.html"><i class="bi bi-person me-2"></i>Профиль</a></li>';

        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                    <img src="${user.photoUrl || 'https://placehold.co/32x32/999/fff?text=' + (user.firstName?.[0] || 'U')}"
                         alt="${user.username}"
                         class="rounded-circle me-2"
                         width="24" height="24">
                    <span class="d-none d-sm-inline">${user.firstName || user.username}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    ${profileLink}
                    ${profileLink ? '<li><hr class="dropdown-divider"></li>' : ''}
                    <li><a class="dropdown-item" href="#" onclick="logout()"><i class="bi bi-box-arrow-right me-2"></i>Выйти</a></li>
                </ul>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline-secondary">Войти</a>
        `;
    }
}


function logout() {
    if (window.api) {
        api.logout();
    } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('current_user');
    }
    currentUser = null;
    showToast('Вы вышли из аккаунта', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}


function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar .nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}


function toggleFavorite(button) {
    button.classList.toggle('active');

    const isActive = button.classList.contains('active');
    button.setAttribute('aria-pressed', isActive);

    if (isActive) {
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);

        showToast('Добавлено в избранное!', 'success');
    } else {
        showToast('Удалено из избранного', 'info');
    }

    saveFavorites();
}


function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(button => {
        if (Math.random() > 0.7) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        }
    });
}


function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}


function toggleSubscribe(button) {
    const isSubscribed = button.classList.contains('subscribed');

    if (isSubscribed) {
        button.classList.remove('subscribed', 'btn-primary');
        button.classList.add('btn-outline-primary');
        button.innerHTML = '<i class="bi bi-person-plus me-2"></i>Подписаться';
        showToast('Вы отписались', 'info');
    } else {
        button.classList.add('subscribed', 'btn-primary');
        button.classList.remove('btn-outline-primary');
        button.innerHTML = '<i class="bi bi-person-check me-2"></i>Подписаны';
        showToast('Вы подписались!', 'success');
    }
}


function initializeComments() {
    const commentForms = document.querySelectorAll('.comment-form');
    commentForms.forEach(form => {
        form.addEventListener('submit', handleCommentSubmit);
    });
}


function handleCommentSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const textarea = form.querySelector('textarea');
    const commentText = textarea.value.trim();

    if (!commentText) {
        showToast('Комментарий не может быть пустым', 'warning');
        return;
    }

    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
        const commentHTML = createCommentHTML(commentText);
        commentsList.insertAdjacentHTML('afterbegin', commentHTML);
        textarea.value = '';
        showToast('Комментарий добавлен!', 'success');
        updateCommentCount();
    }
}


function createCommentHTML(text) {
    const now = new Date();
    const timeStr = 'только что';

    return `
        <div class="comment-item">
            <img src="https://placehold.co/50x50/6c757d/ffffff?text=Вы" alt="User" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">Вы</span>
                    <span class="comment-time">${timeStr}</span>
                </div>
                <p class="comment-text">${escapeHtml(text)}</p>
            </div>
        </div>
    `;
}


function updateCommentCount() {
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
        const count = commentsList.querySelectorAll('.comment-item').length;
        const countElements = document.querySelectorAll('.comments-count');
        countElements.forEach(el => {
            el.textContent = count;
        });
    }
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function initializeTabs() {
    const tabButtons = document.querySelectorAll('[data-tab]');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}


function switchTab(tabName) {
    const tabButtons = document.querySelectorAll('[data-tab]');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });

    const activeContent = document.getElementById(tabName);
    if (activeContent) {
        activeContent.classList.add('active');
        activeContent.style.display = 'block';
    }
}


function initializeFilters() {
    const filterForm = document.querySelector('.filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', handleFilterSubmit);
    }

    const resetButton = document.querySelector('.btn-reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 300));
    }
}


function handleFilterSubmit(e) {
    e.preventDefault();
    applyFilters();
}


function applyFilters() {
    const dishType = document.querySelector('select[name="dishType"]')?.value;
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
    const searchQuery = document.querySelector('.search-input')?.value.toLowerCase();

    const recipeCards = document.querySelectorAll('.recipe-card');
    let visibleCount = 0;

    recipeCards.forEach(card => {
        let shouldShow = true;

        if (dishType && dishType !== 'all') {
            const badges = card.querySelectorAll('.badge');
            const hasDishType = Array.from(badges).some(badge =>
                badge.textContent.toLowerCase().includes(dishType.toLowerCase())
            );
            if (!hasDishType) shouldShow = false;
        }

        if (difficulty && difficulty !== 'all') {
            const badges = card.querySelectorAll('.badge');
            const hasDifficulty = Array.from(badges).some(badge =>
                badge.textContent.toLowerCase().includes(difficulty.toLowerCase())
            );
            if (!hasDifficulty) shouldShow = false;
        }

        if (searchQuery) {
            const title = card.querySelector('.recipe-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.recipe-description')?.textContent.toLowerCase() || '';
            if (!title.includes(searchQuery) && !description.includes(searchQuery)) {
                shouldShow = false;
            }
        }

        if (shouldShow) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    updateResultsCount(visibleCount);

    if (visibleCount === 0) {
        showToast('Ничего не найдено. Попробуйте изменить фильтры.', 'info');
    }
}


function resetFilters() {
    const filterForm = document.querySelector('.filter-form');
    if (filterForm) {
        filterForm.reset();
    }

    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.style.display = '';
    });

    updateResultsCount(recipeCards.length);

    showToast('Фильтры сброшены', 'info');
}


function performSearch(e) {
    const searchQuery = e.target.value.toLowerCase();

    if (searchQuery.length < 2 && searchQuery.length > 0) {
        return;
    }

    applyFilters();
}


function updateResultsCount(count) {
    const countElement = document.querySelector('.results-count');
    if (countElement) {
        countElement.textContent = `Найдено рецептов: ${count}`;
    }
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImage = modal.querySelector('.modal-image');
        if (modalImage) {
            modalImage.src = imageSrc;
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }
}


function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="bi bi-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}


function getToastIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        error: 'exclamation-circle-fill',
        warning: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || icons.info;
}


function validateLoginForm(e) {
    e.preventDefault();

    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        showToast('Пожалуйста, заполните все поля', 'warning');
        return false;
    }

    if (!isValidEmail(email)) {
        showToast('Пожалуйста, введите корректный email', 'error');
        return false;
    }

    showToast('Вход выполнен успешно!', 'success');

    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 1500);

    return false;
}


function validateRegisterForm(e) {
    e.preventDefault();

    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!username || !email || !password || !confirmPassword) {
        showToast('Пожалуйста, заполните все поля', 'warning');
        return false;
    }

    if (!isValidEmail(email)) {
        showToast('Пожалуйста, введите корректный email', 'error');
        return false;
    }

    if (password.length < 6) {
        showToast('Пароль должен содержать минимум 6 символов', 'error');
        return false;
    }

    if (password !== confirmPassword) {
        showToast('Пароли не совпадают', 'error');
        return false;
    }

    showToast('Регистрация успешна!', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);

    return false;
}


function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function formatDate(date) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('ru-RU', options);
}


function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


console.log('%cА зачем ты в консоль полез? ;)', 'background: #ff6b6b; color: white; font-size: 20px; padding: 10px;');
