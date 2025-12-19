import { isAuthenticated, logoutApi } from './api.js';
import { authManager } from './auth.js';

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
        if (this.cache.container) {
            return this.cache.container;
        }

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

        if (
            currentPath.includes('/pages/') ||
            currentPath.includes('login.html') ||
            currentPath.includes('register.html') ||
            currentPath.includes('profile.html') ||
            currentPath.includes('chats.html')
        ) {
            return '../';
        }

        return './';
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
            <li class="nav-item" role="none">
                <span class="nav-link text-light"
                      role="menuitem"
                      aria-label="Текущий пользователь: ${safeUsername}">
                    <svg class="icon me-2" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-person-circle"></use>
                    </svg>
                    <span>${safeUsername}</span>
                </span>
            </li>

            <li class="nav-item" role="none">
                <a class="nav-link"
                   role="menuitem"
                   href="${basePath}pages/chats.html">
                    <svg class="icon me-2" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-chat-dots"></use>
                    </svg>
                    <span>Чаты</span>
                </a>
            </li>

            <li class="nav-item" role="none">
                <a class="nav-link"
                   role="menuitem"
                   href="${basePath}pages/profile.html">
                    <svg class="icon me-1" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-person-badge"></use>
                    </svg>
                    <span>Личный кабинет</span>
                </a>
            </li>

            <li class="nav-item" role="none">
                <a class="nav-link"
                   href="#"
                   id="logoutLink"
                   role="menuitem"
                   aria-label="Выйти из аккаунта">
                    <svg class="icon me-1" aria-hidden="true">
                        <use href="../assets/icons.svg#icon-box-arrow-right"></use>
                    </svg>
                    <span>Выйти</span>
                </a>
            </li>
        `;
    }

    generateGuestNavbar(basePath, currentPath) {
        if (currentPath.includes('login.html')) {
            return `
                <li class="nav-item" role="none">
                    <a class="nav-link"
                       role="menuitem"
                       href="${basePath}pages/register.html">
                        <svg class="icon me-1" aria-hidden="true">
                            <use href="../assets/icons.svg#icon-person-plus"></use>
                        </svg>
                        <span>Регистрация</span>
                    </a>
                </li>
            `;
        }

        if (currentPath.includes('register.html')) {
            return `
                <li class="nav-item" role="none">
                    <a class="nav-link"
                       role="menuitem"
                       href="${basePath}pages/login.html">
                        <svg class="icon me-2" aria-hidden="true"><use href="../assets/icons.svg#icon-box-arrow-in-right"></use></svg>
                        <span>Вход</span>
                    </a>
                </li>
            `;
        }

        return `
            <li class="nav-item" role="none">
                <a class="nav-link"
                   role="menuitem"
                   href="${basePath}pages/login.html">
                    <svg class="icon me-2" aria-hidden="true"><use href="../assets/icons.svg#icon-box-arrow-in-right"></use></svg>
                    <span>Вход</span>
                </a>
            </li>

            <li class="nav-item" role="none">
                <a class="nav-link"
                   role="menuitem"
                   href="${basePath}pages/register.html">
                    <svg class="icon me-2" aria-hidden="true"><use href="../assets/icons.svg#icon-chat-dots"></use></svg>
                    <span>Регистрация</span>
                </a>
            </li>

            <li class="nav-item" role="none">
                <a class="nav-link"
                   role="menuitem"
                   href="${basePath}pages/chats.html">
                    <svg class="icon me-1" aria-hidden="true"><use href="../assets/icons.svg#icon-chat-dots"></use></svg>
                    <span>Чаты</span>
                </a>
            </li>
        `;
    }

    setCurrentPage(container) {
        const currentPath = window.location.pathname;

        container.querySelectorAll('a.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href)) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    attachEventHandlers(basePath) {
        const logoutLink = document.getElementById('logoutLink');

        if (logoutLink) {
            logoutLink.addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    await logoutApi();
                } catch (error) {
                    console.warn('Logout API error:', error);
                } finally {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = basePath + 'index.html';
                }
            });
        }
    }

    async init() {
        try {
            const container = this.findContainer();
            if (!container) return;

            container.setAttribute('role', 'menubar');
            container.setAttribute('aria-label', 'Основные разделы сайта');

            const basePath = this.getBasePath();
            const currentPath = window.location.pathname;
            const auth = isAuthenticated();
            const user = authManager.getCurrentUser();

            let navbarHTML = auth && user
                ? this.generateAuthNavbar(user, basePath)
                : this.generateGuestNavbar(basePath, currentPath);

            container.innerHTML = navbarHTML;

            this.setCurrentPage(container);
            this.attachEventHandlers(basePath);

            console.log('Navbar initialized (accessible)');

        } catch (error) {
            console.error('Navbar initialization error:', error);
        }
    }

    async reload() {
        this.cache.container = null;
        await this.init();
    }
}

let navbarInstance = null;

export function initNavbar() {
    if (!navbarInstance) {
        navbarInstance = new Navbar();
    }
    return navbarInstance;
}

export function getNavbar() {
    return navbarInstance;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navbarInstance = new Navbar();
    });
} else {
    navbarInstance = new Navbar();
}