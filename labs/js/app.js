// показываем имя в шапке, если вошли
function updateHeader() {
    let user = localStorage.getItem("myuser");
    let place = document.getElementById("userInfo");
    
    if (user) {
        place.innerHTML = "Привет, " + user + "!";
    } else {
        place.innerHTML = "";
    }
}

// показ карточек рецептов (на главной и поиске)
function showRecipes(list) {
    let container = document.getElementById("recipesList");
    if (!container) return;
    
    container.innerHTML = ""; //очистка контейнера перед добавлением новых
    
    for (let i = 0; i < list.length; i++) {
        let r = list[i]; // r - текущий рецепт
        let card = 
            '<div class="col-md-4 mb-4">' +
                '<div class="card h-100 shadow-sm">' +
                    '<img src="' + r.image + '" class="card-img-top" alt="' + r.title + '" style="height:200px; object-fit:cover;">' +
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

// показ одного рецепта
function showSingleRecipe() {
    let container = document.getElementById("recipeContent"); // поиск div, куда вставить рецепт
    if (!container) return;

    // цель вытащить id
    let params = new URLSearchParams(window.location.search); // window.location.search будет иметь вид ?id
    let id = params.get('id');

    if (!id) {
        container.innerHTML = '<div class="alert alert-danger">Нет номера рецепта!</div>';
        return;
    }

    let allRecipes = getAllRecipes();
    let recipe = null;

    for (let i = 0; i < allRecipes.length; i++) {
        if (allRecipes[i].id == id) {
            recipe = allRecipes[i];
            break;
        }
    }

    if (!recipe) {
        container.innerHTML = '<div class="alert alert-warning">Рецепт не найден :(</div>';
        return;
    }

    let html = ''; // пустая строка, куда будем добавлять HTML

    html += '<h1>' + recipe.title + '</h1>';
    if (recipe.short) {
        html += '<p class="text-muted">' + recipe.short + '</p>';
    }

    html += '<img src="' + recipe.image + '" class="img-fluid rounded mb-4" alt="' + recipe.title + '">';

    html += '<div class="row">';

    html += '<div class="col-lg-8">';
    html += '<h4>Ингредиенты</h4>';
    html += '<ul class="list-group mb-4">';
    for (let j = 0; j < recipe.ingredients.length; j++) {
        html += '<li class="list-group-item">' + recipe.ingredients[j] + '</li>';
    }
    html += '</ul>';

    html += '<h4>Шаги приготовления</h4>';
    html += '<ol class="list-group list-group-numbered mb-4">';
    for (let k = 0; k < recipe.steps.length; k++) {
        html += '<li class="list-group-item">' + recipe.steps[k] + '</li>';
    }
    html += '</ol>';
    html += '</div>';

    html += '<div class="col-lg-4">';
    html += '<div class="card">';
    html += '<div class="card-body">';
    html += '<p><strong>Время:</strong> ' + recipe.time + ' минут</p>';
    html += '<p><strong>Сложность:</strong> ' + recipe.difficulty + '</p>';
    if (recipe.author) {
        html += '<p><strong>Автор:</strong> ' + recipe.author + '</p>';
    }
    if (recipe.published) {
        html += '<p><strong>Опубликовано:</strong> ' + recipe.published + '</p>';
    }
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;
}
// фильтр поиска
function doFilter() {
    let text = document.getElementById("searchText").value.toLowerCase();
    let diff = document.getElementById("difficulty").value;
    
    let result = [];
    let allRecipes = getAllRecipes();
    
    for (let i = 0; i < allRecipes.length; i++) {
        let r = allRecipes[i];
        let good = true;
        
        if (text != "" && r.title.toLowerCase().indexOf(text) == -1 && 
            (r.short && r.short.toLowerCase().indexOf(text) == -1)) {
            good = false;
        }
        
        if (diff != "" && r.difficulty != diff) {
            good = false;
        }
        
        if (good) {
            result.push(r);
        }
    }
    
    showRecipes(result);
}

// показ своих рецептов в профиле
function showMyRecipes() {
    let container = document.getElementById("myRecipesList");
    if (!container) return;

    container.innerHTML = "";

    let custom = JSON.parse(localStorage.getItem("myCustomRecipes") || "[]");
    let user = localStorage.getItem("myuser");

    let myList = [];
    for (let i = 0; i < custom.length; i++) {
        if (custom[i].author === user) {
            myList.push(custom[i]);
        }
    }

    if (myList.length === 0) {
        container.innerHTML = '<p class="text-muted">У тебя пока нет своих рецептов</p>';
        return;
    }

    for (let i = 0; i < myList.length; i++) {
        let r = myList[i];
        let card = 
            '<div class="col-md-6 mb-3">' +
                '<div class="card">' +
                    '<div class="card-body">' +
                        '<h5>' + r.title + '</h5>' +
                        '<p class="small text-muted">' + (r.short || '') + '</p>' +
                        '<small>Время: ' + r.time + ' мин • ' + r.difficulty + '</small>' +
                        '<a href="recipe.html?id=' + r.id + '" class="btn btn-sm btn-outline-primary mt-2">Открыть</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        container.innerHTML += card;
    }
}

// показ сохраненных рецептов
function showSavedRecipes() {
    let container = document.getElementById("savedRecipesList");
    if (!container) return;

    container.innerHTML = "";

    let user = localStorage.getItem("myuser");
    if (!user) return;

    let saved = JSON.parse(localStorage.getItem("mySavedRecipes") || "{}");
    let userSavedIds = saved[user] || [];

    let allRecipes = recipes.concat(JSON.parse(localStorage.getItem("myCustomRecipes") || "[]"));

    let savedList = [];
    for (let i = 0; i < userSavedIds.length; i++) {
        for (let j = 0; j < allRecipes.length; j++) {
            if (allRecipes[j].id == userSavedIds[i]) {
                savedList.push(allRecipes[j]);
                break;
            }
        }
    }

    if (savedList.length === 0) {
        container.innerHTML = '<p class="text-muted">У тебя нет сохраненных рецептов</p>';
        return;
    }

    for (let i = 0; i < savedList.length; i++) {
        let r = savedList[i];
        let card = 
            '<div class="col-md-6 mb-3">' +
                '<div class="card">' +
                    '<div class="card-body">' +
                        '<h5>' + r.title + '</h5>' +
                        '<small>Время: ' + r.time + ' мин • ' + r.difficulty + '</small>' +
                        '<a href="recipe.html?id=' + r.id + '" class="btn btn-sm btn-outline-primary mt-2">Открыть</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
        container.innerHTML += card;
    }
}


// получить все рецепты: из data.js + добавленные пользователем
function getAllRecipes() {
    let custom = JSON.parse(localStorage.getItem("myCustomRecipes") || "[]");
    return recipes.concat(custom);
}

// запуск всего
document.addEventListener("DOMContentLoaded", function() {

    updateHeader();

    showSingleRecipe();

    // главная
    if (document.getElementById("recipesList")) {
        showRecipes(getAllRecipes());
    }

    // поиск
    if (document.getElementById("btnFilter")) {
        document.getElementById("btnFilter").onclick = doFilter;
        doFilter();
    }

    // кабинет
    if (document.getElementById("btnLogin")) {
        document.getElementById("btnLogin").onclick = function() {
            let name = document.getElementById("username").value.trim();
            let pass = document.getElementById("password").value.trim();
            
            if (name.length < 2) {
                alert("Напиши нормальное имя");
                return;
            }
            
            localStorage.setItem("myuser", name);
            updateHeader();
            
            document.getElementById("loginBlock").classList.add("d-none");
            document.getElementById("profileBlock").classList.remove("d-none");
            document.getElementById("userName").innerText = name;
            
            document.getElementById("addRecipeBlock").classList.remove("d-none");
            showMyRecipes();
            showSavedRecipes();
        };

        document.getElementById("btnRegister").onclick = function() {
            document.getElementById("btnLogin").click();
        };

        document.getElementById("btnLogout").onclick = function() {
            localStorage.removeItem("myuser");
            localStorage.removeItem("myCustomRecipes"); // можно убрать, если хочешь сохранять
            localStorage.removeItem("mySavedRecipes");
            window.location.reload();
        };

        // если уже вошёл
        if (localStorage.getItem("myuser")) {
            document.getElementById("loginBlock").classList.add("d-none");
            document.getElementById("profileBlock").classList.remove("d-none");
            document.getElementById("userName").innerText = localStorage.getItem("myuser");
            document.getElementById("addRecipeBlock").classList.remove("d-none");
            showMyRecipes();
            showSavedRecipes();
        }

        // добавление рецепта
        if (document.getElementById("addRecipeForm")) {
            document.getElementById("addRecipeForm").onsubmit = function(e) {
                e.preventDefault();

                let title = document.getElementById("newTitle").value.trim();
                let short = document.getElementById("newShort").value.trim();
                let time = document.getElementById("newTime").value;
                let difficulty = document.getElementById("newDifficulty").value;
                let ingredientsText = document.getElementById("newIngredients").value.trim();
                let stepsText = document.getElementById("newSteps").value.trim();

                if (title === "" || ingredientsText === "" || stepsText === "") {
                    alert("Заполни все важные поля!");
                    return;
                }

                let ingredients = ingredientsText.split("\n");
                let steps = stepsText.split("\n");

                let custom = JSON.parse(localStorage.getItem("myCustomRecipes") || "[]");

                let newRecipe = {
                    id: Date.now(),
                    title: title,
                    short: short,
                    time: Number(time),
                    difficulty: difficulty,
                    image: "assets/img/example.jpg",
                    ingredients: ingredients,
                    steps: steps,
                    author: localStorage.getItem("myuser") || "Аноним"
                };

                custom.push(newRecipe);
                localStorage.setItem("myCustomRecipes", JSON.stringify(custom));

                alert("Рецепт добавлен!");
                document.getElementById("addRecipeForm").reset();
                
                showMyRecipes(); // обновляем список
                showRecipes(getAllRecipes());
            };
        }
    }
});
