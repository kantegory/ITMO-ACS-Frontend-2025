import { authSession } from '../auth/auth.session.js';
import { logout } from '../auth/auth.service.js';

class Navbar {
    constructor() {
        this.containerSelectors = [
            '#navbarNavLinks',
            '#navLinks',
            '.navbar-nav.ms-auto',
            '#navbarNav .navbar-nav',
            '.navbar-collapse .navbar-nav'
        ];
        this.cache = {};
        this.init();
    }

    findContainer() {
        if (this.cache.container) return this.cache.container;

        for (const selector of this.containerSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                this.cache.container = element;
                return element;
            }
        }
        console.warn('Navbar container not found.');
        return null;
    }

    getBasePath() {
        const currentPath = window.location.pathname;
        return ['/pages/', 'login.html', 'register.html', 'profile.html', 'chats.html']
            .some(p => currentPath.includes(p)) ? '../' : './';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generateAuthNavbar(user, basePath) {
        const safeUsername = this.escapeHtml(user.username || 'Пользователь');

        return `
            <li class="nav-item">
                <span class="nav-link text-light" aria-label="Текущий пользователь: ${safeUsername}">
                    <svg class="icon me-2"><use href="../assets/icons.svg#icon-person-circle"></use></svg>
                    ${safeUsername}
                </span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/chats.html">
                    <svg class="icon me-2"><use href="../assets/icons.svg#icon-chat-dots"></use></svg>
                    Чаты
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/profile.html">
                    <svg class="icon me-1"><use href="../assets/icons.svg#icon-person-badge"></use></svg>
                    Личный кабинет
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutLink" aria-label="Выйти из аккаунта">
                    <svg class="icon me-1"><use href="../assets/icons.svg#icon-box-arrow-right"></use></svg>
                    Выйти
                </a>
            </li>
        `;
    }

    generateGuestNavbar(basePath, currentPath) {
        const loginLink = `
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/login.html">
                    <svg class="icon me-2"><use href="../assets/icons.svg#icon-box-arrow-in-right"></use></svg>
                    Вход
                </a>
            </li>`;
        const registerLink = `
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/register.html">
                    <svg class="icon me-2"><use href="../assets/icons.svg#icon-person-plus"></use></svg>
                    Регистрация
                </a>
            </li>`;
        const chatsLink = `
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/chats.html">
                    <svg class="icon me-1"><use href="../assets/icons.svg#icon-chat-dots"></use></svg>
                    Чаты
                </a>
            </li>`;

        if (currentPath.includes('login.html')) return registerLink;
        if (currentPath.includes('register.html')) return loginLink;
        return loginLink + registerLink + chatsLink;
    }

    setCurrentPage(container) {
        const currentPath = window.location.pathname;
        container.querySelectorAll('a.nav-link').forEach(link => {
            if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    attachEventHandlers() {
        const logoutLink = document.getElementById('logoutLink');
        if (!logoutLink) return;

        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await logout();
            } catch (err) {
                console.warn('Logout error:', err);
                authSession.clear();
                window.location.href = this.getBasePath() + 'index.html';
            }
        });
    }

    async init() {
        const container = this.findContainer();
        if (!container) return;

        container.setAttribute('role', 'menubar');
        container.setAttribute('aria-label', 'Основные разделы сайта');

        const basePath = this.getBasePath();
        const currentPath = window.location.pathname;
        const auth = authSession.isAuthenticated();
        const user = authSession.getUser();

        container.innerHTML = auth && user
            ? this.generateAuthNavbar(user, basePath)
            : this.generateGuestNavbar(basePath, currentPath);

        this.setCurrentPage(container);
        this.attachEventHandlers();
        console.log('Navbar initialized');
    }

    async reload() {
        this.cache.container = null;
        await this.init();
    }
}

let navbarInstance = null;

export function initNavbar() {
    if (!navbarInstance) navbarInstance = new Navbar();
    return navbarInstance;
}

export function getNavbar() {
    return navbarInstance;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => navbarInstance = new Navbar());
} else {
    navbarInstance = new Navbar();
}