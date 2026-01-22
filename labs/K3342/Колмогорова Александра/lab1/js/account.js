function updateProfile() {
    const name = document.getElementById('editName').value;
    const username = document.getElementById('editUsername').value;
    const bio = document.getElementById('editBio').value;
    
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileUsername').textContent = '@' + username;
    document.getElementById('profileBio').textContent = bio;
    
    const profileData = {
        name: name,
        username: username,
        bio: bio
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    showNotification('Профиль успешно обновлен!', 'success');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function createRecipe() {
    const name = document.getElementById('recipeName').value;
    const description = document.getElementById('recipeDescription').value;
    const type = document.getElementById('recipeType').value;
    const difficulty = document.getElementById('recipeDifficulty').value;
    
    const ingredients = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        ingredients.push(checkbox.value);
    });

    if (!name || !description || !type || !difficulty || ingredients.length === 0) {
        alert('Заполните все поля');
        return;
    }

    const recipe = {
        id: Date.now(),
        name: name,
        description: description,
        type: type,
        difficulty: difficulty,
        ingredients: ingredients,
    };

    const recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));

    displayRecipes();
    
    bootstrap.Modal.getInstance(document.getElementById('createRecipeModal')).hide();
    document.getElementById('recipeForm').reset();
}

function displayRecipes() {
    const container = document.querySelector('#my-recipes .row');
    const recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    
    container.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeHTML = `
            <div class="col-md-6">
                <div class="recipe-card border rounded mb-3">
                    <div class="p-3">
                        <h6 class="fw-bold mb-2">${recipe.name}</h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-secondary me-1">${recipe.type}</span>
                                <span class="badge bg-info">${recipe.difficulty}</span>
                            </div>
                            <div>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteRecipe(${recipe.id})">×</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += recipeHTML;
    });
}

function deleteRecipe(recipeId) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    recipes = recipes.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem('myRecipes', JSON.stringify(recipes));
    displayRecipes();
}

document.addEventListener('DOMContentLoaded', function() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        
        document.getElementById('profileName').textContent = profileData.name;
        document.getElementById('profileUsername').textContent = '@' + profileData.username;
        document.getElementById('profileBio').textContent = profileData.bio;
        
        document.getElementById('editName').value = profileData.name;
        document.getElementById('editUsername').value = profileData.username;
        document.getElementById('editBio').value = profileData.bio;
    }
    
    document.getElementById('profileForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            updateProfile();
        }
    });
});

document.getElementById('editUsername').addEventListener('input', function(e) {
    this.value = this.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
});

function displaySavedRecipes() {
    const container = document.querySelector('#saved .row');
    const stars = JSON.parse(localStorage.getItem('recipeStars')) || {};
    const allRecipes = {...recipes, ...(JSON.parse(localStorage.getItem('myRecipes')) || {})};
    
    container.innerHTML = '';
    
    const savedRecipes = Object.values(allRecipes).filter(recipe => stars[recipe.id]);
    
    if (savedRecipes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Нет сохранённых рецептов</p>
            </div>
        `;
        return;
    }
    
    savedRecipes.forEach(recipe => {
        const recipeHTML = `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text m-0">${recipe.type}</p>
                        <p class="card-text">Сложность: ${recipe.difficulty}</p>
                        <a href="recipe.html?id=${recipe.id}" class="btn btn-success">Посмотреть рецепт</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += recipeHTML;
    });
}

document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function (e) {
        if (e.target.getAttribute('href') === '#saved') {
            displaySavedRecipes();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    displayRecipes();
    displaySavedRecipes();
});