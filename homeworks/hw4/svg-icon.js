// svg-icons.js
const SVGIcons = {
    // Получение SVG иконки по имени
    getIcon: function(iconName, className = 'svg-icon') {
        const icons = {
            'calendar': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6v2h14V6H5zm2 4h10v2H7zm0 4h7v2H7z"/>
                </svg>
            `,
            'dumbbell': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm3 7c0-2.8-2.2-5-5-5H7.5C4.5 4 2 6.5 2 9.5S4.5 15 7.5 15H9v5h2v-5h2v5h2v-5h1.5c3 0 5.5-2.5 5.5-5.5S21 9 18 9h-.5z"/>
                </svg>
            `,
            'profile-silhouette': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" fill="currentColor"/>
                    <path fill="currentColor" d="M12 14c-4.42 0-8 2.69-8 6v2h16v-2c0-3.31-3.58-6-8-6z"/>
                </svg>
            `,
            'document': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path fill="currentColor" d="M7 7h10v2H7zm0 4h7v2H7zm0 4h10v2H7z"/>
                </svg>
            `,
            'home': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
            `,
            'stats': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 11V3H8v6H2v12h20V11h-6zm-6-6h4v14h-4V5zm-6 6h4v8H4v-8zm16 8h-4v-6h4v6z"/>
                </svg>
            `,
            'nutrition': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/>
                </svg>
            `,
            'progress': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
            `,
            'settings': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
            `,
            'login': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M10 17v-3H3v-4h7V7l5 5-5 5zm0-15h9c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-9c-1.1 0-2-.9-2-2v-4h2v4h9V5h-9v4H8V5c0-1.1.9-2 2-2z"/>
                </svg>
            `,
            'register': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-6 4c.22-.72 3.31-2 6-2 2.7 0 5.8 1.29 6 2H9zm-3-3v-3h3v-2H6V7H4v3H1v2h3v3z"/>
                </svg>
            `,
            'bolt': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8H7z"/>
                </svg>
            `,
            'sun': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                </svg>
            `,
            'moon': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                </svg>
            `,
            'heart': `
                <svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            `
        };

        return icons[iconName] || '';
    },

    // Создание иконки профиля для страницы профиля (НАД именем)
    createProfileHeader: function(userName = "Atanova Sophie", userRole = "Premium Member") {
        return `
        <div class="profile-header-container text-center mb-4">
            <div class="profile-icon-large mx-auto mb-3">
                <svg viewBox="0 0 100 100" width="100" height="100" aria-label="Profile picture of ${userName}">
                    <defs>
                        <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1"/>
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1"/>
                        </linearGradient>
                        <clipPath id="circleClip">
                            <circle cx="50" cy="50" r="45"/>
                        </clipPath>
                    </defs>
                    
                    <!-- Градиентный фон -->
                    <circle cx="50" cy="50" r="45" fill="url(#profileGradient)"/>
                    
                    <!-- Силуэт головы -->
                    <circle cx="50" cy="40" r="18" fill="#ffffff"/>
                    
                    <!-- Силуэт тела -->
                    <ellipse cx="50" cy="75" rx="20" ry="25" fill="#ffffff" clip-path="url(#circleClip)"/>
                    
                    <!-- Детали (глаза) -->
                    <circle cx="42" cy="38" r="3" fill="#333"/>
                    <circle cx="58" cy="38" r="3" fill="#333"/>
                    
                    <!-- Улыбка -->
                    <path d="M42 48 Q50 55 58 48" stroke="#333" stroke-width="2" fill="none"/>
                </svg>
            </div>
            <h1 class="mb-1">${userName}</h1>
            <p class="text-muted mb-0">
                <svg class="svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align: middle;">
                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                ${userRole}
            </p>
        </div>
        `;
    },

    // Создание навигации с иконками
    createNavigation: function() {
        return `
        <nav class="main-navigation mb-4" role="navigation" aria-label="Main navigation">
            <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="index.html" class="nav-link">
                    ${this.getIcon('home', 'nav-svg-icon')}
                    Home
                </a>
                <a href="pages/workouts.html" class="nav-link">
                    ${this.getIcon('dumbbell', 'nav-svg-icon')}
                    Workouts
                </a>
                <a href="pages/blog.html" class="nav-link">
                    ${this.getIcon('document', 'nav-svg-icon')}
                    Blog
                </a>
                <a href="pages/profile.html" class="nav-link active">
                    ${this.getIcon('profile-silhouette', 'nav-svg-icon')}
                    Profile
                </a>
            </div>
        </nav>
        `;
    },

    // Создание карточек тренировок с календарем
    createWorkoutCard: function(title, date, exercises, icon = 'dumbbell') {
        return `
        <div class="card glass-card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title mb-0">
                        ${this.getIcon(icon, 'svg-icon-sm')}
                        ${title}
                    </h5>
                    <div class="text-muted">
                        ${this.getIcon('calendar', 'svg-icon-sm')}
                        ${date}
                    </div>
                </div>
                <ul class="list-unstyled mb-3">
                    ${exercises.map(exercise => `
                        <li class="mb-2">
                            <svg class="svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true" style="color: #4CAF50;">
                                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                            ${exercise}
                        </li>
                    `).join('')}
                </ul>
                <button class="btn btn-sm btn-primary">
                    ${this.getIcon('progress', 'svg-icon-sm')}
                    Track Progress
                </button>
            </div>
        </div>
        `;
    },

    // Инициализация всех иконок на странице
    init: function() {
        // Инициализация на странице профиля
        this.initProfilePage();
        
        // Инициализация на странице тренировок
        this.initWorkoutsPage();
        
        // Инициализация на странице блога
        this.initBlogPage();
    },

    initProfilePage: function() {
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            // Вставляем заголовок профиля с иконкой над именем
            profileContainer.insertAdjacentHTML('afterbegin', this.createProfileHeader());
            
            // Добавляем секции профиля с иконками
            this.addProfileSections();
        }
    },

    initWorkoutsPage: function() {
        const workoutsContainer = document.querySelector('.workouts-container');
        if (workoutsContainer) {
            // Добавляем примеры тренировок
            const workouts = [
                {
                    title: "Full Body Workout",
                    date: "Today, 10:00 AM",
                    exercises: ["Push-ups: 3x15", "Squats: 3x20", "Plank: 3x60s"],
                    icon: "dumbbell"
                },
                {
                    title: "Cardio Session",
                    date: "Tomorrow, 8:00 AM",
                    exercises: ["Running: 30 min", "Jump Rope: 5x100", "Burpees: 3x10"],
                    icon: "progress"
                }
            ];
            
            workouts.forEach(workout => {
                workoutsContainer.insertAdjacentHTML('beforeend', 
                    this.createWorkoutCard(workout.title, workout.date, workout.exercises, workout.icon)
                );
            });
        }
    },

    initBlogPage: function() {
        // Инициализация страницы блога при необходимости
    },

    addProfileSections: function() {
        const sections = [
            {
                title: "Statistics",
                icon: "stats",
                content: "View your workout statistics and progress"
            },
            {
                title: "Nutrition",
                icon: "nutrition",
                content: "Track your daily nutrition intake"
            },
            {
                title: "Settings",
                icon: "settings",
                content: "Customize your profile and preferences"
            }
        ];

        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            sections.forEach(section => {
                const sectionHTML = `
                <div class="card glass-card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${this.getIcon(section.icon, 'svg-icon-sm')}
                            ${section.title}
                        </h5>
                        <p class="card-text">${section.content}</p>
                        <button class="btn btn-sm btn-primary">
                            Explore
                            <svg class="svg-icon-sm" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                `;
                profileContainer.insertAdjacentHTML('beforeend', sectionHTML);
            });
        }
    },

    // Метод для добавления иконок к существующим ссылкам
    addIconsToLinks: function() {
        const linksMap = {
            'pages/workouts.html': 'dumbbell',
            'pages/blog.html': 'document',
            'pages/profile.html': 'profile-silhouette',
            'index.html': 'home'
        };

        Object.entries(linksMap).forEach(([href, iconName]) => {
            const links = document.querySelectorAll(`a[href="${href}"]`);
            links.forEach(link => {
                if (!link.querySelector('.svg-icon')) {
                    const iconHTML = this.getIcon(iconName, 'svg-icon-sm');
                    link.insertAdjacentHTML('afterbegin', iconHTML);
                }
            });
        });
    }
};

// Автоматическая инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SVGIcons.addIconsToLinks();
        SVGIcons.init();
    });
} else {
    SVGIcons.addIconsToLinks();
    SVGIcons.init();
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGIcons;
} else {
    window.SVGIcons = SVGIcons;
}