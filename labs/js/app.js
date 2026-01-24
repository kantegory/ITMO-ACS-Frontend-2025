//----------------------------------------------------------------------
// Показываем имя в шапке
function updateHeader() {
    let user = localStorage.getItem("myuser");
    let place = document.getElementById("userInfo");
    
    if (user) {
        place.innerHTML = "Привет, " + user + "!";
    } else {
        place.innerHTML = "";
    }
}

//----------------------------------------------------------------------
// Показываем карточки рецептов (на главной и в поиске)
function showRecipes(list) {
    let container = document.getElementById("recipesList");
    if (!container) return;
    
    container.innerHTML = "";
    
    for (let i = 0; i < list.length; i++) {
        let r = list[i];
        let card = 
            '<div class="col-md-4 mb-4">' +
                '<div class="card h-100 shadow-sm">' +
                    '<img src="' + r.image + '" class="card-img-top" alt="' + r.title + '" ' +
                         'style="height:200px; object-fit:cover;" ' +
                         'onerror="this.src=\'assets/img/example.jpg\'">' +
                    '<div class="card-body d-flex flex-column">' +
                        '<h5 class="card-title">' + r.title + '</h5>' +
                        '<p class="card-text text-muted small">' + (r.short || '') + '</p>' +
                        '<div class="mt-auto">' +
                            '<p class="mb-2"><small>Время: ' + r.time + ' мин • ' + r.difficulty + '</small></p>' +
                            '<a href="recipe.html?id=' + r.id + '" class="btn btn-primary btn-sm">Открыть рецепт</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        container.innerHTML += card;
    }
}

//----------------------------------------------------------------------
// Первый запрос — получаем все рецепты с сервера (для главной)
function loadRecipesFromServer() {
    let container = document.getElementById("recipesList");
    if (!container) return;

    container.innerHTML = "Загрузка...";

    fetch("http://localhost:3001/recipes")
        .then(response => response.json())
        .then(recipes => {
            container.innerHTML = "";
            showRecipes(recipes);
        })
        .catch(error => {
            console.log("Ошибка загрузки рецептов:", error);
            container.innerHTML = "Не удалось загрузить рецепты";
        });
}

//----------------------------------------------------------------------
// Фильтр поиска — тоже через сервер 
function doFilter() {
    let text = document.getElementById("searchText").value.toLowerCase();
    let diff = document.getElementById("difficulty").value;

    fetch("http://localhost:3001/recipes")
        .then(response => response.json())
        .then(allRecipes => {
            let result = [];
            for (let i = 0; i < allRecipes.length; i++) {
                let r = allRecipes[i];
                let good = true;

                if (text !== "" && r.title.toLowerCase().indexOf(text) === -1 && 
                    (r.short && r.short.toLowerCase().indexOf(text) === -1)) {
                    good = false;
                }

                if (diff !== "" && r.difficulty !== diff) {
                    good = false;
                }

                if (good) result.push(r);
            }

            let container = document.getElementById("recipesList");
            container.innerHTML = "";
            showRecipes(result);
        })
        .catch(error => {
            console.log("Ошибка фильтра:", error);
        });
}

//----------------------------------------------------------------------
// Показ одного рецепта — запрос по id
function showSingleRecipe() {
    let container = document.getElementById("recipeContent");
    if (!container) return;

    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');  // id из ссылки (всегда строка)

    if (!id) {
        container.innerHTML = '<div class="alert alert-danger">Нет id в ссылке!</div>';
        return;
    }

    container.innerHTML = '<p class="text-center my-5">Загрузка рецепта...</p>';

    fetch("http://localhost:3001/recipes")
        .then(response => {
            if (!response.ok) throw new Error("Не удалось загрузить список рецептов");
            return response.json();
        })
        .then(recipes => {

            // Ищем рецепт, приводя id к строке (работает и для чисел, и для строк)
            let recipe = recipes.find(r => String(r.id) === id);

            if (!recipe) {
                container.innerHTML = '<div class="alert alert-danger">Рецепт с id ' + id + ' не найден</div>';
                return;
            }

            let html = '';

            html += '<h1>' + (recipe.title || 'Без названия') + '</h1>';
            if (recipe.short) html += '<p class="text-muted">' + recipe.short + '</p>';

            let imgSrc = recipe.image || 'assets/img/example.jpg';
            html += '<img src="' + imgSrc + '" class="img-fluid rounded mb-4" alt="' + (recipe.title || '') + '" onerror="this.src=\'assets/img/example.jpg\'">';

            html += '<div class="row"><div class="col-lg-8">';

            html += '<h4>Ингредиенты</h4>';
            if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
                html += '<ul class="list-group mb-4">';
                recipe.ingredients.forEach(ing => {
                    let trimmed = ing.trim();
                    if (trimmed) html += '<li class="list-group-item">' + trimmed + '</li>';
                });
                html += '</ul>';
            } else {
                html += '<p class="text-muted">Ингредиенты не указаны</p>';
            }

            html += '<h4>Шаги приготовления</h4>';
            if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
                html += '<ol class="list-group list-group-numbered mb-4">';
                recipe.steps.forEach(step => {
                    let trimmed = step.trim();
                    if (trimmed) html += '<li class="list-group-item">' + trimmed + '</li>';
                });
                html += '</ol>';
            } else {
                html += '<p class="text-muted">Шаги не указаны</p>';
            }

            html += '</div><div class="col-lg-4"><div class="card"><div class="card-body">';
            html += '<p><strong>Время:</strong> ' + (recipe.time || '—') + ' минут</p>';
            html += '<p><strong>Сложность:</strong> ' + (recipe.difficulty || '—') + '</p>';
            if (recipe.author) html += '<p><strong>Автор:</strong> ' + recipe.author + '</p>';
            if (recipe.published) html += '<p><strong>Опубликовано:</strong> ' + recipe.published + '</p>';
            html += '</div></div></div></div>';

            container.innerHTML = html;
        })
        .catch(error => {
            console.error("Ошибка:", error);
            container.innerHTML = '<div class="alert alert-danger">Ошибка загрузки: ' + error.message + '</div>';
        });
}

//----------------------------------------------------------------------
// Авторизация / регистрация (модалка)
function sendAuthForm(event) {
    event.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username.length < 2) {
        alert("Имя слишком короткое");
        return;
    }

    fetch("http://localhost:3001/users?username=" + username + "&password=" + password)
        .then(response => response.json())
        .then(users => {
            if (users.length > 0) {
                // Вход успешен
                localStorage.setItem("myuser", username);
                updateHeader();
                document.getElementById("loginBlock").classList.add("d-none"); // скрываем блок входа
                document.getElementById("profileBlock").classList.remove("d-none"); // отрисовка профиля пользователя
                document.getElementById("userName").innerText = username; //имя пользователя отображается в интерфейсе
                document.getElementById("addRecipeBlock").classList.remove("d-none"); //блок добавления рецептов доступен только авторизированным пользователям
                showMyRecipes();
                alert("Добро пожаловать!");
            } else {
                // Регистрируем нового
                let newUser = { username: username, password: password };
                fetch("http://localhost:3001/users", {
                    method: "POST", // POST запрос, так как без ?
                    body: JSON.stringify(newUser),
                    headers: {
                        "Content-Type": "application/json" //что отправят json-формат
                    }
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem("myuser", username);
                    updateHeader();
                    document.getElementById("loginBlock").classList.add("d-none");
                    document.getElementById("profileBlock").classList.remove("d-none");
                    document.getElementById("userName").innerText = username;
                    document.getElementById("addRecipeBlock").classList.remove("d-none");
                    showMyRecipes();  // сразу показываем после регистрации
                    alert("Вы зарегистрированы и вошли!");
                })
                .catch(error => {
                    alert("Ошибка регистрации");
                });
            }
        })
        .catch(error => {
            alert("Ошибка сервера");
        });
}

//----------------------------------------------------------------------
// Показ своих рецептов в профиле (с сервера)
function showMyRecipes() {
    let container = document.getElementById("myRecipesList");
    if (!container) return;

    container.innerHTML = "Загрузка...";

    let user = localStorage.getItem("myuser");

    fetch("http://localhost:3001/recipes?author=" + user)
        .then(response => response.json())
        .then(recipes => {
            container.innerHTML = "";
            if (recipes.length === 0) {
                container.innerHTML = '<p class="text-muted">У тебя пока нет своих рецептов</p>';
                return;
            }

            for (let i = 0; i < recipes.length; i++) {
                let r = recipes[i];
                let card = 
                    '<div class="col-md-6 mb-3">' +
                        '<div class="card">' +
                            '<div class="card-body">' +
                                '<h5>' + r.title + '</h5>' +
                                '<p class="small text-muted">' + (r.short || '') + '</p>' +
                                '<small>Время: ' + r.time + ' мин • ' + r.difficulty + '</small>' +
                                '<div class="mt-3">' +
                                    '<a href="recipe.html?id=' + r.id + '" class="btn btn-sm btn-outline-primary">Открыть</a>' +
                                    ' <button class="btn btn-sm btn-outline-danger" onclick="deleteRecipe(\'' + r.id + '\')">Удалить</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                container.innerHTML += card;
            }
        })
        .catch(error => {
            container.innerHTML = "Ошибка загрузки";
        });
}

//----------------------------------------------------------------------
// Добавление рецепта
function addRecipe(event) {
    event.preventDefault();

    let title = document.getElementById("newTitle").value.trim();
    let short = document.getElementById("newShort").value.trim();
    let time = document.getElementById("newTime").value;
    let difficulty = document.getElementById("newDifficulty").value;
    let ingredients = document.getElementById("newIngredients").value.trim().split("\n");
    let steps = document.getElementById("newSteps").value.trim().split("\n");

    if (title === "" || ingredients.length === 0 || steps.length === 0) {
        alert("Заполни все поля!");
        return;
    }

    let newRecipe = {
        title: title,
        short: short,
        time: Number(time),
        difficulty: difficulty,
        image: "assets/img/example.jpg",
        ingredients: ingredients,
        steps: steps,
        author: localStorage.getItem("myuser") || "Аноним"
    };

    fetch("http://localhost:3001/recipes", {
        method: "POST",
        body: JSON.stringify(newRecipe),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        alert("Рецепт добавлен!");
        document.getElementById("addRecipeForm").reset();
        showMyRecipes();  // сразу обновляем список своих рецептов
    })
    .catch(error => {
        alert("Ошибка при добавлении");
    });
}

//----------------------------------------------------------------------
//Удаление рецепта
function deleteRecipe(id) {
    if (!confirm("Ты уверен, что хочешь удалить этот рецепт навсегда?")) {
        return;
    }

    fetch("http://localhost:3001/recipes/" + id, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Не удалось удалить рецепт на сервере");
        }
        alert("Рецепт успешно удалён!");
        showMyRecipes();  // сразу обновляем список своих рецептов
    })
    .catch(error => {
        console.error("Ошибка удаления:", error);
        alert("Ошибка при удалении: " + error.message);
    });
}

//----------------------------------------------------------------------
// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", function() {

    updateHeader();

    // главная/поиск
    if (document.getElementById("recipesList")) {
        loadRecipesFromServer();
    }

    // поиск фильтр
    if (document.getElementById("btnFilter")) {
        document.getElementById("btnFilter").onclick = doFilter;
        doFilter();
    }

    // профиль (выход, форма и т.д.) — твой предыдущий фикс
    let btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.onclick = function() {
            localStorage.removeItem("myuser");
            window.location.reload();
        };
    }

    if (localStorage.getItem("myuser")) {
        let loginBlock = document.getElementById("loginBlock");
        let profileBlock = document.getElementById("profileBlock");
        let addRecipeBlock = document.getElementById("addRecipeBlock");
        let userNameSpan = document.getElementById("userName");

        if (loginBlock) loginBlock.classList.add("d-none");
        if (profileBlock) profileBlock.classList.remove("d-none");
        if (addRecipeBlock) addRecipeBlock.classList.remove("d-none");
        if (userNameSpan) userNameSpan.innerText = localStorage.getItem("myuser");

        showMyRecipes();
    }

    let addForm = document.getElementById("addRecipeForm");
    if (addForm) {
        addForm.addEventListener("submit", addRecipe);
    }

    // страница одного рецепта 
    let recipeContainer = document.getElementById("recipeContent");
        showSingleRecipe();
    }
);