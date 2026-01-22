function getQueryParam(parameterName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(parameterName);
}

function formatMinutesToText(minutes) {
    if (!Number.isFinite(minutes)) return '-';
    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    if (hours === 0) return `${minutes} мин`;
    if (restMinutes === 0) return `${hours} ч`;
    return `${hours} ч ${restMinutes} мин`;
}

function showInlineMessage(containerId, message, type = 'danger') {
    const element = document.getElementById(containerId);
    if (!element) return;

    element.className = `alert inline-alert alert-${type}`;
    element.innerHTML = message;
    element.style.display = 'block';
}

function hideInlineMessage(containerId) {
    const element = document.getElementById(containerId);
    if (!element) return;
    element.className = 'alert inline-alert';
    element.innerText = '';
}

function renderEmptyState(container, text) {
    if (!container) return;
    container.innerHTML = `<div class="entity-list-empty">${text}</div>`;
}

function toggleElementVisibility(element, shouldShow) {
    if (!element) return;
    element.classList.toggle('d-none', !shouldShow);
}

function createLoadingPlaceholder(text = 'Загрузка...') {
    return `
        <div class="d-flex align-items-center gap-2 text-muted">
            <div class="spinner-border spinner-border-sm" role="status"></div>
            <span>${text}</span>
        </div>
    `;
}

function escapeHtml(input) {
    if (typeof input !== 'string') return input ?? '';
    return input.replace(/[&<>"']/g, (character) => (
        {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
        }[character]
    ));
}

function updateNavigationControls() {
    const isLoggedIn = isAuthenticated();
    const loginLink = document.getElementById('navLoginLink');
    const registerLink = document.getElementById('navRegisterLink');
    const profileLink = document.getElementById('navProfileLink');
    const logoutButton = document.getElementById('navLogoutButton');

    toggleElementVisibility(loginLink, !isLoggedIn);
    toggleElementVisibility(registerLink, !isLoggedIn);
    toggleElementVisibility(profileLink, isLoggedIn);
    toggleElementVisibility(logoutButton, isLoggedIn);

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            saveToken(null);
            window.location.href = 'search.html';
        });
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const header = document.querySelector('header');
    const nav = document.querySelector('.navbar');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.setAttribute('data-bs-theme', 'dark');
        if (header) {
            header.setAttribute('data-bs-theme', 'dark');
        }
        if (nav) {
            nav.setAttribute('data-bs-theme', 'dark');
        }
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
    } else {
        body.classList.remove('dark-theme');
        body.removeAttribute('data-bs-theme');
        if (header) {
            header.removeAttribute('data-bs-theme');
        }
        if (nav) {
            nav.removeAttribute('data-bs-theme');
        }
        if (themeIcon) {
            themeIcon.textContent = '🌙';
        }
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigationControls();
    initTheme();
    setupThemeToggle();
});

