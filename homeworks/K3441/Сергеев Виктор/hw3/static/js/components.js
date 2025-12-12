async function loadComponent(selector, url) {
    const target = document.querySelector(selector);
    if (!target) {
        console.warn(`Не удалось найти контейнер для компонента ${url}`);
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Ошибка загрузки компонента: ${url} (${response.status})`);
            return;
        }
        target.innerHTML = await response.text();
    } catch (error) {
        console.error(`Не удалось получить компонент ${url}`, error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof initTheme === 'function') {
        initTheme();
    }
    
    await loadComponent('#header-placeholder', 'header.html');
    await loadComponent('#footer-placeholder', 'footer.html');
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (typeof applyTheme === 'function') {
        applyTheme(currentTheme);
    }

    if (typeof setupThemeToggle === 'function') {
        setupThemeToggle();
    }
    
    if (typeof updateNavigationControls === 'function') {
        updateNavigationControls();
    }
});