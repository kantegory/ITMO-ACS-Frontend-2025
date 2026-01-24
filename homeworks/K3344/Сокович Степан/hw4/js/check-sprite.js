function checkSVGSprite() {
    console.log('=== Проверка SVG-спрайта ===\n');
    
    const svg = document.querySelector('svg[style*="display: none"]');
    if (!svg) {
        console.error('❌ SVG-спрайт не найден в DOM');
        return;
    }
    
    console.log('✅ SVG-спрайт найден');
    
    const symbols = svg.querySelectorAll('symbol');
    console.log(`✅ Найдено символов в спрайте: ${symbols.length}`);
    
    const symbolIds = Array.from(symbols).map(s => s.getAttribute('id'));
    console.log('📋 Список символов:', symbolIds);
    
    const uses = document.querySelectorAll('use[href^="#icon-"]');
    console.log(`\n✅ Найдено использований иконок через <use>: ${uses.length}`);
    
    const usedIcons = new Set();
    uses.forEach(use => {
        const href = use.getAttribute('href');
        const symbolId = href.replace('#', '');
        usedIcons.add(symbolId);
        
        const symbol = document.querySelector(`#${symbolId}`);
        if (symbol) {
            console.log(`  ✅ "${symbolId}" - используется и найден в спрайте`);
        } else {
            console.error(`  ❌ "${symbolId}" - используется, но НЕ найден в спрайте!`);
        }
    });
    
    const unusedIcons = symbolIds.filter(id => !usedIcons.has(id));
    if (unusedIcons.length > 0) {
        console.log(`\n⚠️  Неиспользуемые иконки (${unusedIcons.length}):`, unusedIcons);
    }
    
    const externalIcons = document.querySelectorAll('link[href*="bootstrap-icons"], link[href*="font-awesome"]');
    if (externalIcons.length > 0) {
        console.warn(`\n⚠️  Найдены внешние библиотеки иконок: ${externalIcons.length}`);
    } else {
        console.log('\n✅ Внешние библиотеки иконок не найдены');
    }
    
    console.log('\n=== Проверка завершена ===');
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkSVGSprite);
    } else {
        checkSVGSprite();
    }
}



