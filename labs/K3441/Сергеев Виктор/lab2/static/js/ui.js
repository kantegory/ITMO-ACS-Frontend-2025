function getQueryParam(parameterName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(parameterName);
}

function formatMinutesToText(minutes) {
    if (!Number.isFinite(minutes)) return '-';
    return `${minutes} мин`;
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
        }[cha]
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

document.addEventListener('DOMContentLoaded', () => {
    updateNavigationControls();
});