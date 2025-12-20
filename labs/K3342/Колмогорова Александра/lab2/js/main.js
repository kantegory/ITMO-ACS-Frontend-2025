const url = 'http://localhost:3000';

let publicRecipes = [];

function loadRecipeCards() {
    const container = document.getElementById('cards-container');
    
    fetch(`${url}/publicRecipes`)
        .then(response => response.json())
        .then(recipes => {
            publicRecipes = recipes;
            
            showRecipeCards(recipes);
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>Ошибка загрузки рецептов</p>';
        });
}

function showRecipeCards(recipes, filters = {}) {
    const container = document.getElementById('cards-container');
    
    let filtered = recipes.filter(r => {
        if (filters.type && r.type !== filters.type) return false;
        if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
        if (filters.search) {
            return r.title.toLowerCase().includes(filters.search.toLowerCase());
        }
        return true;
    });
    
    container.innerHTML = '';
    
    if (filtered.length == 0) {
        container.innerHTML = '<p>Рецепты не найдены</p>';
        return;
    }
    
    filtered.forEach(r => {
        const card = document.createElement('div');
        card.className = 'col-12 col-xl-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${r.image}" class="card-img-top" alt="${r.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${r.title}</h5>
                    <p class="card-text m-0">${r.type}</p>
                    <p class="card-text">Сложность: ${r.difficulty}</p>
                    <a href="recipe.html?id=${r.id}" class="btn btn-success">Посмотреть полностью</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function setActiveTab(tabId, text = null) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    if (text && activeTab) {
        activeTab.textContent = text;
    }
}

function filterByType(type) {
    if (publicRecipes.length > 0) {
        setActiveTab('type-dropdown', type);
        showRecipeCards(publicRecipes, { type: type });
    }
}

function filterByDifficulty(difficulty) {
    if (publicRecipes.length > 0) {
        const diffNames = {
            '★': 'Низкая',
            '★★': 'Средняя', 
            '★★★': 'Высокая'
        };
        setActiveTab('difficulty-dropdown', diffNames[difficulty] || difficulty);
        showRecipeCards(publicRecipes, { difficulty: difficulty });
    }
}

function showAllRecipes() {
    if (publicRecipes.length > 0) {
        document.getElementById('type-dropdown').textContent = 'Тип блюда';
        document.getElementById('difficulty-dropdown').textContent = 'Сложность';
        
        setActiveTab('all-recipes');
        showRecipeCards(publicRecipes);
    }
}

function searchRecipe(event) {
    event.preventDefault();
    
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        showRecipeCards(publicRecipes, { search: searchTerm });
    } else {
        showRecipeCards(publicRecipes);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadRecipeCards();
});