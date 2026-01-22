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

function showRecipeCards(recipes) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    if (recipes.length === 0) {
        container.innerHTML = '<p>Рецепты не найдены</p>';
        return;
    }

    recipes.forEach(r => {
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
    setActiveTab('type-dropdown', type);

    fetch(`${url}/publicRecipes?type=${encodeURIComponent(type)}`)
        .then(res => res.json())
        .then(recipes => showRecipeCards(recipes))
        .catch(err => console.error(err));
}

function filterByDifficulty(difficulty) {
    const diffNames = {
        '★': 'Низкая',
        '★★': 'Средняя', 
        '★★★': 'Высокая'
    };

    setActiveTab('difficulty-dropdown', diffNames[difficulty]);

    fetch(`${url}/publicRecipes?difficulty=${encodeURIComponent(difficulty)}`) 
        .then(res => res.json())
        .then(recipes => showRecipeCards(recipes))
        .catch(err => console.error(err));
}

function showAllRecipes() {
    document.getElementById('type-dropdown').textContent = 'Тип блюда';
    document.getElementById('difficulty-dropdown').textContent = 'Сложность';

    setActiveTab('all-recipes');
    loadRecipeCards();
}

function searchRecipe(event) {
    event.preventDefault();

    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    const query = searchTerm
        ? `${url}/publicRecipes?q=${encodeURIComponent(searchTerm)}`
        : `${url}/publicRecipes`;

    fetch(query)
        .then(res => res.json())
        .then(recipes => {
            const filtered = recipes.filter(r =>
                r.title.toLowerCase().includes(searchTerm)
            );
            showRecipeCards(filtered);
        })
        .catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', function() {
    loadRecipeCards();
});