// js/sprite-helper.js

/**
 * Вспомогательные функции для работы с SVG спрайтом
 */

class SpriteHelper {
    constructor() {
        this.spriteUrl = 'images/sprite.svg';
    }

    /**
     * Создает SVG элемент с иконкой из спрайта
     * @param {string} iconId - ID иконки в спрайте (без префикса #)
     * @param {string} className - Дополнительные CSS классы
     * @param {object} attributes - Дополнительные атрибуты
     * @returns {string} HTML строка с SVG
     */
    getIcon(iconId, className = '', attributes = {}) {
        const defaultClass = 'icon';
        const allClasses = className ? `${defaultClass} ${className}` : defaultClass;
        
        let attrString = '';
        for (const [key, value] of Object.entries(attributes)) {
            attrString += ` ${key}="${value}"`;
        }
        
        return `
            <svg class="${allClasses}"${attrString}>
                <use xlink:href="${this.spriteUrl}#${iconId}"></use>
            </svg>
        `;
    }

    /**
     * Заменяет Font Awesome иконки на SVG из спрайта
     * @param {HTMLElement} container - Контейнер для поиска иконок
     */
    replaceFontAwesomeIcons(container = document.body) {
        const faToSpriteMap = {
            'fa-user': 'icon-user',
            'fa-dumbbell': 'icon-dumbbell',
            'fa-blog': 'icon-blog',
            'fa-bolt': 'icon-bolt',
            'fa-sign-in-alt': 'icon-sign-in',
            'fa-user-plus': 'icon-user', // Используем ту же иконку пользователя
            'fa-heart': 'icon-heart',
            'fa-fire': 'icon-fire',
            'fa-calendar-week': 'icon-calendar',
            'fa-check': 'icon-check',
            'fa-moon': 'icon-moon',
            'fa-sun': 'icon-sun',
            'fa-heart-pulse': 'icon-heart-pulse',
            'fa-bed': 'icon-bed',
            'fa-dumbbell': 'icon-dumbbell',
            'fa-spa': 'icon-heart', // для йоги
            'fa-child-reaching': 'icon-user', // для растяжки
            'fa-weight-hanging': 'icon-dumbbell' // для пауэрлифтинга
        };

        // Находим все элементы с Font Awesome
        const faIcons = container.querySelectorAll('[class*="fa-"]');
        
        faIcons.forEach(element => {
            const classes = element.className.split(' ');
            const faClass = classes.find(cls => cls.startsWith('fa-'));
            
            if (faClass && faToSpriteMap[faClass]) {
                const iconId = faToSpriteMap[faClass];
                const svgHtml = this.getIcon(iconId, element.className);
                
                // Создаем временный элемент для парсинга SVG
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = svgHtml.trim();
                const svgElement = tempDiv.firstChild;
                
                // Копируем все атрибуты
                Array.from(element.attributes).forEach(attr => {
                    if (attr.name !== 'class' && attr.name !== 'aria-hidden') {
                        svgElement.setAttribute(attr.name, attr.value);
                    }
                });
                
                // Сохраняем aria-hidden если есть
                if (element.getAttribute('aria-hidden') === 'true') {
                    svgElement.setAttribute('aria-hidden', 'true');
                }
                
                // Заменяем элемент
                element.parentNode.replaceChild(svgElement, element);
            }
        });
    }

    /**
     * Инициализирует использование спрайта на странице
     */
    init() {
        // Проверяем загрузку спрайта
        this.checkSpriteLoaded();
        
        // Заменяем иконки на странице
        this.replaceFontAwesomeIcons();
        
        console.log('SVG sprite helper initialized');
    }

    /**
     * Проверяет доступность SVG спрайта
     */
    async checkSpriteLoaded() {
        try {
            const response = await fetch(this.spriteUrl);
            if (!response.ok) {
                console.warn('SVG sprite not found at:', this.spriteUrl);
            }
        } catch (error) {
            console.warn('Could not load SVG sprite:', error);
        }
    }
}

// Создаем глобальный экземпляр
window.SpriteHelper = new SpriteHelper();