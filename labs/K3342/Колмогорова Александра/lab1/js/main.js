function loadRecipeCards(recipes, filters = {}) {
    const container = document.getElementById('cards-container');
    let html = ''; 
            
    const filteredRecipes = Object.values(recipes).filter(r => {
        if (filters.type && r.type !== filters.type) return false;
        if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
        return true;
    });
                      
    // визуальное изменение tab'ов
    document.getElementById('all-recipes').classList.remove('active');
    document.getElementById('type-dropdown').classList.remove('active');
    document.getElementById('difficulty-dropdown').classList.remove('active');
    document.getElementById('type-dropdown').textContent = 'Тип блюда';
    document.getElementById('difficulty-dropdown').textContent = 'Сложность';

    const diff_transcript = {
        '★': 'Низкая',
        '★★': 'Средняя',
        '★★★': 'Высокая'
    };

    if (filters.type) {
        document.getElementById('type-dropdown').classList.add('active');
        document.getElementById('type-dropdown').textContent = filters.type;
    }
    else if (filters.difficulty) {
        document.getElementById('difficulty-dropdown').classList.add('active');
        document.getElementById('difficulty-dropdown').textContent = diff_transcript[filters.difficulty] || filters.difficulty;
    } 
    else {
        document.getElementById('all-recipes').classList.add('active');
    }
            
    if (filteredRecipes.length === 0) {
        html = `<div class="col-12 text-center">
                    <p class="text-muted">Рецепты не найдены</p>
                </div>`;
    } else {
        filteredRecipes.forEach(r => { 
            html += `
                <div class="col-12 col-xl-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="${r.image}" class="card-img-top" alt="${r.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${r.title}</h5>
                            <p class="card-text m-0">${r.type}</p>
                            <p class="card-text">Сложность: ${r.difficulty}</p>
                            <a href="recipe.html?id=${r.id}" class="btn btn-success">Читать полностью</a>
                        </div>
                    </div>
                </div>`;
        });
    }
            
    container.innerHTML = html; 
}

document.addEventListener('DOMContentLoaded', function() {
    loadRecipeCards(recipes);
});