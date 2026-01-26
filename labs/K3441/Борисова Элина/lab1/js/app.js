class RentEstateApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        console.log('Инициализация приложения rentestate');
        this.loadModules();

        if (typeof updateNavigation === 'function') {
            updateNavigation();
        }
        console.log('Приложение инициализировано');
    }

    loadModules() {
        console.log('Модули загружены');
    }

    static formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.RentEstateApp = new RentEstateApp();
});
localStorage.setItem('currentUser', JSON.stringify({ id: 2, username: 'Иван' }));
