const url = 'http://localhost:3000';

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');
    
    if (user.id && token) {
        fetch(`${url}/users/${user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(curUser=> {
            localStorage.setItem('user', JSON.stringify(curUser));
            
            document.getElementById('profileName').textContent = curUser.name || 'Пользователь';
            document.getElementById('profileUsername').textContent = '@' + (curUser.username || 'username');
            document.getElementById('profileBio').textContent = curUser.bio || 'Расскажите о себе...';
            
            document.getElementById('editName').value = curUser.name || '';
            document.getElementById('editUsername').value = curUser.username || '';
            document.getElementById('editBio').value = curUser.bio || '';
            
            if (curUser.recipes) {
                displayRecipes(curUser.recipes);
            }
        })
        .catch(error => {
            showLocalProfile(user);
        });
    } else {
        showLocalProfile(user);
    }
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

function showLocalProfile(user) {
    document.getElementById('profileName').textContent = user.name || 'Пользователь';
    document.getElementById('profileUsername').textContent = '@' + (user.username || 'username');
    document.getElementById('profileBio').textContent = user.bio || 'Расскажите о себе...';
}

function updateProfile() {
    const name = document.getElementById('editName').value;
    const username = document.getElementById('editUsername').value;
    const bio = document.getElementById('editBio').value;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');
       
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileUsername').textContent = '@' + username;
    document.getElementById('profileBio').textContent = bio;
    
    fetch(`${url}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            username: username,
            bio: bio
        })
    })
    .then(response => response.json())
    .then(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showNotification('Профиль успешно обновлен!', 'success');
    })
    .catch(error => {
        showNotification('error..', 'danger');
    })
    .finally(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();
    });
}

function createRecipe() {
    const name = document.getElementById('recipeName').value;
    const description = document.getElementById('recipeDescription').value;
    const type = document.getElementById('recipeType').value;
    const difficulty = document.getElementById('recipeDifficulty').value;
    
    const ingredients = [];
    const checkboxes = document.querySelectorAll('#createRecipeModal input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        ingredients.push(checkbox.value);
    });

    if (!name || !description || !type || !difficulty || ingredients.length == 0) {
        alert('Заполните все поля!');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');

    const newRecipe = {
        id: Date.now(),
        title: name,
        description: description,
        type: type,
        difficulty: difficulty,
        ingredients: ingredients,
    };

    fetch(`${url}/users/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(currentUser => {
        const updatedRecipes = [...(currentUser.recipes || []), newRecipe];
        
        return fetch(`${url}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipes: updatedRecipes
            })
        });
    })
    .then(response => response.json())
    .then(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (updatedUser.recipes) {
            displayRecipes(updatedUser.recipes);
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createRecipeModal'));
        if (modal) modal.hide();
        document.getElementById('recipeForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayRecipes(recipes) {
    const container = document.querySelector('#my-recipes .row');
    container.innerHTML = '';
    
    if (!recipes || recipes.length == 0) {
        container.innerHTML = '<p class="text-muted">У вас пока нет рецептов</p>';
        return;
    }
    
    recipes.forEach(recipe => {
        const recipeHTML = `
            <div class="col-md-6">
                <div class="recipe-card border rounded mb-3">
                    <div class="p-3">
                        <h6 class="fw-bold mb-2">${recipe.title}</h6>
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('accessToken');
    
    fetch(`${url}/users/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(currentUser => {
        const updatedRecipes = (currentUser.recipes || []).filter(recipe => recipe.id !== recipeId);
        
        return fetch(`${url}/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipes: updatedRecipes
            })
        });
    })
    .then(response => response.json())
    .then(updatedUser => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (updatedUser.recipes) {
            displayRecipes(updatedUser.recipes);
        }
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displaySavedRecipes() {
    const container = document.querySelector('#saved .row');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
      
    const favorites = JSON.parse(localStorage.getItem('userFavorites')) || {};
    const savedRecipeIds = favorites[user.id] || [];
    
    if (savedRecipeIds.length == 0) {
        container.innerHTML = '<p>Нет сохраненных рецептов</p>';
        return;
    }
    
    fetch(`${url}/publicRecipes`)
        .then(response => response.json())
        .then(allRecipes => {
            const savedRecipes = allRecipes.filter(recipe => 
                savedRecipeIds.includes(recipe.id)
            );
            
            container.innerHTML = '';
            
            if (savedRecipes.length == 0) {
                container.innerHTML = '<p>Нет сохраненных рецептов</p>';
                return;
            }
            
            savedRecipes.forEach(recipe => {
                const recipeHTML = `
                    <div class="col-md-6 mb-3">
                        <div class="card h-100">
                            ${recipe.image ? `
                                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}" style="height: 150px; object-fit: cover;">
                            ` : ''}
                            <div class="card-body">
                                <h5 class="card-title">${recipe.title}</h5>
                                <p class="card-text">
                                    <span class="badge bg-secondary">${recipe.type}</span>
                                    <span class="badge bg-info ms-1">${recipe.difficulty}</span>
                                </p>
                                <div class="d-flex gap-2">
                                    <a href="recipe.html?id=${recipe.id}" class="btn btn-success btn-sm">Посмотреть</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += recipeHTML;
            });
        })
        .catch(error => {
            console.error(error);
            container.innerHTML = '<p>Ошибка загрузки</p>';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    
    document.querySelectorAll('a[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('click', function(e) {
            if (e.target.getAttribute('href') == '#saved') {
                displaySavedRecipes();
            }
        });
    });
});

window.updateProfile = updateProfile;
window.createRecipe = createRecipe;
window.deleteRecipe = deleteRecipe;
window.displaySavedRecipes = displaySavedRecipes;

function logout() {
    localStorage.clear()
    window.location.href = 'index.html'
}
