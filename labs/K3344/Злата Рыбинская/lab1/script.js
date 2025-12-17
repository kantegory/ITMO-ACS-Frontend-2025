function loadSavedRecipes() {
    return JSON.parse(localStorage.getItem("saved_recipes") || "[]");
}

function saveRecipes(list) {
    localStorage.setItem("saved_recipes", JSON.stringify(list));
}

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("user_name") || "Злата";

    const authorSpan = document.getElementById("recipe-author");
    if (authorSpan) authorSpan.textContent = username;

    const greetingSpan = document.querySelector("h2 span");
    if (greetingSpan) greetingSpan.textContent = username;

    const nameInput = document.getElementById("username");
    const settingsForm = document.querySelector("#settings form");

    if (nameInput && settingsForm) {
        nameInput.value = username;

        settingsForm.addEventListener("submit", event => {
            event.preventDefault();
            const newName = nameInput.value.trim() || "Злата";
            localStorage.setItem("user_name", newName);

            if (greetingSpan) greetingSpan.textContent = newName;
            if (authorSpan) authorSpan.textContent = newName;

            alert("Изменения сохранены!");
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("comments-container");
    const form = document.getElementById("comment-form");
    const input = document.getElementById("comment-input");

    if (!container || !form || !input) return;

    const filename = location.pathname.split("/").pop();
    const commentsKey = {
        "recipe_cake.html": "comments_cake",
        "recipe_eclaire.html": "comments_eclair",
        "recipe_pie.html": "comments_pie"
    }[filename] || "comments_default";

    function loadComments() {
        const saved = JSON.parse(localStorage.getItem(commentsKey) || "[]");
        saved.forEach(text => addCommentToPage(text, "Вы"));
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


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("saveRecipeBtn");
    if (!btn) return;

    const filename = location.pathname.split("/").pop();
    console.log(filename);
    const recipes = {
        "recipe_cake.html": {
            id: "chocolate_cake",
            title: "Шоколадный торт",
            image: "https://media.istockphoto.com/id/1370520449/ru/фото/кусочек-шоколадного-торта-с-глазурью.jpg?s=1024x1024&w=is&k=20&c=qNbPk8s8Qe8qqDT0zxYSVheTf8lQ3rFrXI6KIvVxE_I=",
            description: "Воздушный бисквит с насыщенным кремом из тёмного шоколада",
            link: "recipe_cake.html"
        },
        "recipe_eclaire.html": {
            id: "eclair",
            title: "Эклеры с заварным кремом",
            image: "https://media.istockphoto.com/id/135896040/ru/фото/шоколадный-eclairs.jpg?s=1024x1024&w=is&k=20&c=GEaaF3mzBQEPV6-sxGS_e7gHZAt7IcfslodpPo_ajfE=",
            description: "Нежные эклеры с ванильным кремом и шоколадной глазурью",
            link: "recipe_eclaire.html"
        },
        "recipe_pie.html": {
            id: "apple_pie",
            title: "Яблочный пирог",
            image: "https://media.istockphoto.com/id/512602151/ru/фото/классическая-американская-яблочный-пирог.jpg?s=1024x1024&w=is&k=20&c=5JTDoo_OSarOcymSnpKvq-ZfURK7-d2o0n0S8Xqr3KI=",
            description: "Классика: сочные яблоки, аромат корицы и рассыпчатое тесто",
            link: "recipe_pie.html"
        }
    };

    const recipe = recipes[filename];
    if (!recipe) return;

    function updateButton() {
        const saved = loadSavedRecipes();
        const exists = saved.some(r => r.id === recipe.id);
        btn.textContent = exists ? "💔 Убрать из сохранённых" : "💖 Сохранить";
    }

    btn.addEventListener("click", () => {
        let saved = loadSavedRecipes();
        const exists = saved.some(r => r.id === recipe.id);

        if (exists) {
            saved = saved.filter(r => r.id !== recipe.id);
        } else {
            saved.push(recipe);
        }

        saveRecipes(saved);
        updateButton();
    });

    updateButton();
});


document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("savedRecipesContainer");
    if (!container) return;

    const saved = loadSavedRecipes();

    if (saved.length === 0) {
        container.innerHTML = "<p class='text-center text-muted'>Нет сохранённых рецептов</p>";
        return;
    }

    container.innerHTML = saved.map(r => `
        <div class="col-md-4">
            <div class="card">
                <img src="${r.image}" class="card-img-top" alt="${r.title}">
                <div class="card-body">
                    <h5 class="card-title">${r.title}</h5>
                    <p class="card-text">${r.description}</p>
                    <a href="${r.link}" class="btn btn-outline-primary w-100">Открыть</a>
                </div>
            </div>
        </div>
    `).join("");
});


document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const typeSelect = document.getElementById('typeSelect');
    const difficultySelect = document.getElementById('difficultySelect');
    const resetBtn = document.getElementById('resetBtn');
    const recipeCols = Array.from(document.querySelectorAll('.recipe-card-col'));
    const noResults = document.getElementById('noResults');

    if (!form || !searchInput || !typeSelect || !difficultySelect) return;

    function normalize(str) {
        return String(str || '').trim().toLowerCase();
    }

    function applyFilters() {
        const query = normalize(searchInput.value);
        const type = typeSelect.value;
        const difficulty = difficultySelect.value;

        let visibleCount = 0;

        recipeCols.forEach(col => {
            const card = col.querySelector('.recipe-card');
            const title = normalize(card.dataset.title);
            const cardType = card.dataset.type || '';
            const cardDifficulty = card.dataset.difficulty || '';

            const matchesQuery = !query || title.includes(query);
            const matchesType = !type || cardType === type;
            const matchesDifficulty = !difficulty || cardDifficulty === difficulty;

            if (matchesQuery && matchesType && matchesDifficulty) {
                col.style.display = '';
                visibleCount++;
            } else {
                col.style.display = 'none';
            }
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        applyFilters();
    });

    searchInput.addEventListener('input', applyFilters);
    typeSelect.addEventListener('change', applyFilters);
    difficultySelect.addEventListener('change', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            typeSelect.value = '';
            difficultySelect.value = '';
            applyFilters();
        });
    }

    applyFilters();
});
