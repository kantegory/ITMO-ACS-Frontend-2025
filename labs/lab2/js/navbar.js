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

        console.warn('Navbar container not found. Available selectors:', this.containerSelectors);
        return null;
    }

    getBasePath() {
        const currentPath = window.location.pathname;

        if (currentPath.includes('/pages/') ||
            currentPath.includes('login.html') ||
            currentPath.includes('register.html') ||
            currentPath.includes('profile.html') ||
            currentPath.includes('chats.html')) {
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
            <li class="nav-item">
                <span class="nav-link text-light">
                    <i class="bi bi-person-circle me-1"></i>${safeUsername}
                </span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/chats.html">
                    <i class="bi bi-chat-dots"></i> Чаты
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/profile.html">
                    <i class="bi bi-person-badge"></i> Личный кабинет
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutLink">
                    <i class="bi bi-box-arrow-right"></i> Выйти
                </a>
            </li>
        `;
    }

    generateGuestNavbar(basePath, currentPath) {
        if (currentPath.includes('login.html')) {
            return `
                <li class="nav-item">
                    <a class="nav-link" href="${basePath}pages/register.html">
                        <i class="bi bi-person-plus"></i> Регистрация
                    </a>
                </li>
            `;
        }

        if (currentPath.includes('register.html')) {
            return `
                <li class="nav-item">
                    <a class="nav-link" href="${basePath}pages/login.html">
                        <i class="bi bi-box-arrow-in-right"></i> Вход
                    </a>
                </li>
            `;
        }

        return `
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/login.html">
                    <i class="bi bi-box-arrow-in-right"></i> Вход
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/register.html">
                    <i class="bi bi-person-plus"></i> Регистрация
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="${basePath}pages/chats.html">
                    <i class="bi bi-chat-dots"></i> Чаты
                </a>
            </li>
        `;
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
            if (!container) {
                console.log('Navbar: Container not found, waiting for DOM...');
                return;
            }

            const basePath = this.getBasePath();
            const currentPath = window.location.pathname;
            const auth = isAuthenticated();
            const user = authManager.getCurrentUser();

            let navbarHTML = '';

            if (auth && user) {
                navbarHTML = this.generateAuthNavbar(user, basePath);
            } else {
                navbarHTML = this.generateGuestNavbar(basePath, currentPath);
            }

            container.innerHTML = navbarHTML;
            this.attachEventHandlers(basePath);

            console.log('Navbar initialized successfully');

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