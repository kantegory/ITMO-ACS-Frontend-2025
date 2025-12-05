import { getCurrentUserFromStorage, isAuthenticated, logout } from './auth.js';

export function initNavbar() {
    const nav = document.getElementById('navLinks');
    if (!nav) return;

    const user = getCurrentUserFromStorage();
    const auth = isAuthenticated();

    if (auth && user) {
        nav.innerHTML = `
            <li class="nav-item"><span class="nav-link text-light">Привет, ${escapeHtml(user.username)}</span></li>
            <li class="nav-item"><a class="nav-link" href="chats.html">Чаты</a></li>
            <li class="nav-item"><a class="nav-link" href="../profile.html">Личный кабинет</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logoutLink">Выйти</a></li>
        `;
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    } else {
        nav.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="../login.html">Вход</a></li>
            <li class="nav-item"><a class="nav-link" href="../register.html">Регистрация</a></li>
            <li class="nav-item"><a class="nav-link" href="chats.html">Чаты</a></li>
            <li class="nav-item"><a class="nav-link" href="../profile.html">Личный кабинет</a></li>
        `;
    }

    const brand = document.getElementById('brandLink');
    if (brand) brand.addEventListener('click', (e) => { });
}

function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
}
