// localStorage
function loadSavedRecipes() {
    return JSON.parse(localStorage.getItem("saved_recipes") || "[]");
}

function saveRecipes(list) {
    localStorage.setItem("saved_recipes", JSON.stringify(list));
}

// сохранение имени пользователя
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("user_name") || "Злата";

    const authorSpan = document.getElementById("recipe-author");
    if (authorSpan) authorSpan.textContent = username;

    const greetingSpan = document.querySelector("h2 span");
    if (greetingSpan) greetingSpan.textContent = username;
});

// комментарии под рецептами
document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("comments-container");
  const form = document.getElementById("comment-form");
  const input = document.getElementById("comment-input");

  if (!container || !form || !input) return;

  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  if (!recipeId) {
    console.error("ID рецепта не найден в URL");
    return;
  }

  const commentsKey = `comments_recipe_${recipeId}`;

  console.log("ID рецепта:", recipeId);
  console.log("Ключ хранения:", commentsKey);

  function loadComments() {
    const saved = JSON.parse(localStorage.getItem(commentsKey) || "[]");
    container.innerHTML = "";

    saved.forEach(text => {
      addCommentToPage(text);
    });
  }

  function addCommentToPage(text, author = "Вы") {
    const card = document.createElement("div");
    card.className = "card p-3 my-3";
    card.innerHTML = `<p><strong>${author}:</strong> ${text}</p>`;
    container.appendChild(card);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    const saved = JSON.parse(localStorage.getItem(commentsKey) || "[]");
    saved.push(text);
    localStorage.setItem(commentsKey, JSON.stringify(saved));

    addCommentToPage(text);
    input.value = "";
  });

  loadComments();
});

// сохранения рецептов на аккаунт
document.addEventListener("DOMContentLoaded", async () => {
    const btn = document.getElementById("saveRecipeBtn");
    if (!btn) return;

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");

    if (!recipeId) {
        console.error("Recipe id not found in URL");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/recipes/${recipeId}`);
        const recipe = await response.json();

        if (!recipe.id) {
            console.error("Recipe not found");
            return;
        }

        const recipeToSave = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            description: recipe.description,
            link: `recipe.html?id=${recipe.id}`
        };

        function loadSavedRecipes() {
            return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
        }

        function saveRecipes(list) {
            localStorage.setItem("savedRecipes", JSON.stringify(list));
        }

        function updateButton() {
            const saved = loadSavedRecipes();
            const exists = saved.some(r => String(r.id) === String(recipeToSave.id));
            btn.textContent = exists
                ? "💔 Убрать из сохранённых"
                : "💖 Сохранить";
        }

        btn.addEventListener("click", () => {
            let saved = loadSavedRecipes();
            const exists = saved.some(r => String(r.id) === String(recipeToSave.id));

            if (exists) {
                saved = saved.filter(r => String(r.id) !== String(recipeToSave.id));
            } else {
                saved.push(recipeToSave);
            }

            saveRecipes(saved);
            updateButton();
        });

        updateButton();

    } catch (error) {
        console.error("Ошибка при загрузке рецепта:", error);
    }
});

// выводим созраненные рецепты
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("savedRecipesContainer");

    if (!container) return;

    const saved = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (saved.length === 0) {
        container.innerHTML = "<p>У вас нет сохранённых рецептов</p>";
        return;
    }

    saved.forEach(recipe => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <div class="card h-100">
                <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.title}</h5>
                    <p class="card-text">${recipe.description}</p>
                    <a href="${recipe.link}" class="btn btn-outline-primary w-100">
                        Перейти к рецепту
                    </a>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
});

// фильтры
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const difficultySelect = document.getElementById('difficultySelect');
    const resetBtn = document.getElementById('resetBtn');
    const recipesRow = document.getElementById('recipesRow');
    const noResults = document.getElementById('noResults');

    if (!recipesRow) return;

    let allRecipes = [];

    fetch('http://localhost:3000/recipes')
        .then(res => res.json())
        .then(data => {
            allRecipes = data;
            renderRecipes(allRecipes);
        })
        .catch(err => {
            console.error("Ошибка загрузки рецептов:", err);
            recipesRow.innerHTML = "<p>Ошибка загрузки данных 😢</p>";
        });


    function renderRecipes(recipes) {
        recipesRow.innerHTML = '';

        if (recipes.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        } else {
            if (noResults) noResults.style.display = 'none';
        }

        recipes.forEach(recipe => {
            const col = document.createElement('div');
            col.className = 'col-md-4';

            col.innerHTML = `
                <div class="card recipe-card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <p class="card-text">${recipe.description}</p>
                        <a href="${recipe.link}" class="btn btn-outline-primary w-100">
                            Смотреть рецепт
                        </a>
                    </div>
                </div>
            `;

            recipesRow.appendChild(col);
        });
    }


    function normalize(str) {
        return String(str || '').trim().toLowerCase();
    }

    function applyFilters() {
        const query = normalize(searchInput.value);
        const type = typeSelect.value;
        const difficulty = difficultySelect.value;

        let filtered = allRecipes.filter(recipe => {
            const matchesQuery = !query || normalize(recipe.title).includes(query);
            const matchesType = !type || recipe.type === type;
            const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;

            return matchesQuery && matchesType && matchesDifficulty;
        });

        renderRecipes(filtered);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
        });
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (typeSelect) typeSelect.addEventListener('change', applyFilters);
    if (difficultySelect) difficultySelect.addEventListener('change', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            typeSelect.value = '';
            difficultySelect.value = '';
            renderRecipes(allRecipes);
        });
    }

});

// логин
function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Заполните все поля");
            return;
        }

        try {
            const response = await fetch(
              `http://localhost:3000/users?email=${email}&password=${password}`
            );

            const data = await response.json();

            if (data.length > 0) {
                const user = data[0];

                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("user_name", user.name || "Пользователь");

                alert("✅ Успешный вход!");
                window.location.href = "profile.html";

            } else {
                alert("❌ Неверный email или пароль");
            }

        } catch (error) {
            console.error(error);
            alert("Ошибка подключения к серверу");
        }
    });
}


document.addEventListener("DOMContentLoaded", initLoginForm);


// мои рецепты в профиле
document.addEventListener("DOMContentLoaded", async () => {
    const myRecipesSection = document.querySelector(".my-recipes");

    if (!myRecipesSection) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
        myRecipesSection.innerHTML = "<p>Вы не вошли в систему</p>";
        return;
    }

    const currentUserId = currentUser.id;

    try {
        const response = await fetch("http://localhost:3000/recipes");
        const recipes = await response.json();

        const myRecipes = recipes.filter(r => String(r.author) === String(currentUserId));

        if (myRecipes.length === 0) {
            myRecipesSection.innerHTML =
                "<p>У вас пока нет рецептов 👩🏻‍🍳</p>";
            return;
        }

        const prepared = myRecipes.map(recipe => ({
            ...recipe,
            link: `recipe.html?id=${recipe.id}`
        }));

    prepared.forEach(recipe => {
    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
        <div class="card recipe-card h-100">
            <img src="${recipe.image}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${recipe.title}</h5>
                <p class="card-text">${recipe.description}</p>
                <a href="${recipe.link}" class="btn btn-outline-primary w-100">
                    Смотреть рецепт
                </a>
            </div>
        </div>
    `;

    myRecipesSection.appendChild(col);
});

    } catch (error) {
        console.error(error);
        myRecipesSection.innerHTML = error;
    }
});


// редактирование данных в ЛК
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-profile-form");
  if (!form) return;

  const nameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("new-password");
  const message = document.getElementById("profile-message");

  const currentUser = JSON.parse(localStorage.getItem("user"));

  if (!currentUser) {
    message.textContent = "Вы не вошли в систему";
    message.style.color = "red";
    return;
  }

  nameInput.value = currentUser.name;
  emailInput.value = currentUser.email;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedUser = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    if (passwordInput.value.trim()) {
      updatedUser.password = passwordInput.value.trim();
    }

    if (!(nameInput.value.trim()) || !(emailInput.value.trim())) {
      alert("Имя и почта обязательны");
      return;
    }

    try {
      const resp = await fetch("http://localhost:3000/users");
      const users = await resp.json();

      const emailExists = users.find(
        u => u.email === emailInput.value.trim() && u.id !== currentUser.id
      );

      if (emailExists) {
        alert("❌ Такая почта уже используется!");
        return;
      }

      const nameExists = users.find(
        u => u.name === nameInput.value.trim() && u.id !== currentUser.id
      );

      if (nameExists) {
        alert("❌ Такое имя уже используется!");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/users/${currentUser.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!response.ok) throw new Error("Ошибка при обновлении");

      const newUserData = await response.json();

      localStorage.setItem("user", JSON.stringify(newUserData));
      localStorage.setItem("user_name", newUserData.name);

      message.textContent = "✅ Данные успешно обновлены!";
      message.style.color = "green";

      passwordInput.value = "";

    } catch (error) {
      console.error(error);
      message.textContent = error;
      message.style.color = "red";
    }
  });
});

// регистрация
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm-password").value.trim();

    if (!name || !email || !password || !confirm) {
      alert("Заполните все поля");
      return;
    }

    if (password !== confirm) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users");
      const users = await response.json();

      const existingEmail = users.find(u => u.email === email);
      if (existingEmail) {
        alert("❌ Этот email уже зарегистрирован");
        return;
      }

      const existingName = users.find(u => u.name === name);
      if (existingName) {
        alert("❌ Это имя уже занято");
        return;
      }

      const newUser = {
        name: name,
        email: email,
        password: password
      };

      const createResponse = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      const createdUser = await createResponse.json();

      localStorage.setItem("user", JSON.stringify(createdUser));
      localStorage.setItem("user_name", createdUser.name);
      window.location.href = "profile.html";

      alert("✅ Регистрация успешна!");

    } catch (error) {
      console.error(error);
      alert("Ошибка регистрации");
    }
  });
});
