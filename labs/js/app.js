// ----- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ -----
function esc(s) {
  const div = document.createElement('div');
  div.textContent = s ?? '';
  return div.innerHTML;
}
function qS(sel) { return document.querySelector(sel); }
function qSA(sel) { return document.querySelectorAll(sel); }
function getParam(name) { return new URLSearchParams(location.search).get(name); }

// ----- ЛАЙКИ -----
const LS_LIKES = 'recipes_likes';
function getLikes() {
  try { return JSON.parse(localStorage.getItem(LS_LIKES)) || {}; }
  catch { return {}; }
}
function saveLikes(data) { localStorage.setItem(LS_LIKES, JSON.stringify(data)); }
function likeRecipe(id) {
  const likes = getLikes();
  likes[id] = (likes[id] || 0) + 1;
  saveLikes(likes);
  return likes[id];
}

// ----- РЕНДЕР КАРТОЧЕК (главная и поиск) -----
function renderCard(recipe) {
  const likes = getLikes()[recipe.id] || 0;
  const mainImg = recipe.image || (recipe.images && recipe.images[0]) || 'assets/img/example.jpg';

  return `
    <div class="col-12 col-sm-6 col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${mainImg}" class="card-img-top" alt="${esc(recipe.title)}"
             onerror="this.src='assets/img/example.jpg'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${esc(recipe.title)}</h5>
          <p class="card-text text-truncate">${esc(recipe.short || '')}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted">${recipe.time || '-'} мин</small>
              <span class="badge bg-secondary ms-2">${esc(recipe.difficulty || '')}</span>
            </div>
            <div>
              <a href="recipe.html?id=${recipe.id}" class="btn btn-sm btn-primary me-2">Просмотр</a>
              <button class="btn btn-outline-danger btn-sm like-btn" data-id="${recipe.id}">❤</button>
              <small class="ms-1">${likes}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderGrid() {
  const container = document.getElementById('recipesGrid');
  if (!container) return;

  const q = (getParam('q') || '').toLowerCase();
  let list = RECIPES;

  if (q) {
    list = RECIPES.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.short && r.short.toLowerCase().includes(q))
    );
  }

  container.innerHTML = list.map(renderCard).join('');

  // привязываем лайки на карточках
  qSA('.like-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const count = likeRecipe(id);
      btn.nextElementSibling.textContent = count;
    };
  });
}

// ----- СТРАНИЦА РЕЦЕПТА -----
function renderRecipePage() {
  const titleEl = qS('#recipeTitle');
  if (!titleEl) return; // не на странице рецепта

  const id = getParam('id');
  if (!id) { titleEl.textContent = 'Рецепт не найден'; return; }

  const recipe = RECIPES.find(r => r.id == id);
  if (!recipe) { titleEl.textContent = 'Рецепт не найден'; return; }

  // Основные данные
  titleEl.textContent = recipe.title;
  qS('#recipeSubtitle').textContent = recipe.short || '';
  qS('#timeInfo').textContent = (recipe.time || '-') + ' мин';
  qS('#difficultyInfo').textContent = recipe.difficulty || '-';
  qS('#authorInfo').textContent = recipe.author || 'Неизвестен';
  qS('#publishedInfo').textContent = recipe.published || '';

  // Главное фото и галерея
  const mainImg = qS('#mainRecipeImage');
  const thumbs = qS('#thumbs');
  const images = recipe.images || [recipe.image || 'assets/img/example.jpg'];

  mainImg.src = images[0];
  mainImg.alt = recipe.title;

  thumbs.innerHTML = images.map((src, i) => 
    `<img src="${src}" class="rounded" onclick="document.getElementById('mainRecipeImage').src=this.src" 
          style="width:80px; height:80px; object-fit:cover; cursor:pointer; border: ${i===0 ? '3px solid #0d6efd' : '2px solid #ddd'}">`
  ).join(' ');

  // Ингредиенты с чекбоксами
  const ingList = qS('#ingredientsList');
  const savedChecks = JSON.parse(localStorage.getItem(`ingredients_${id}`) || '{}');

  ingList.innerHTML = recipe.ingredients.map((ing, i) => {
    const checked = savedChecks[i] ? 'checked' : '';
    return `
      <li class="ingredient-item mb-2">
        <input type="checkbox" id="ing${i}" ${checked}
               onchange="saveIngredient(${id}, ${i}, this.checked)">
        <label for="ing${i}" style="cursor:pointer">${esc(ing)}</label>
      </li>
    `;
  }).join('');

  // Шаги
  qS('#stepsList').innerHTML = recipe.steps.map(s => `<li class="mb-3">${esc(s)}</li>`).join('');

  // Лайки на странице рецепта
  const likeBtn = qS('#likeBtn');
  const currentLikes = getLikes()[id] || 0;
  likeBtn.innerHTML = `❤ Нравится (${currentLikes})`;
  likeBtn.onclick = () => {
    const newCount = likeRecipe(id);
    likeBtn.innerHTML = `❤ Нравится (${newCount})`;
  };

  // Кнопка Сохранить
  qS('#saveBtn').onclick = (e) => {
    e.preventDefault();
    alert('Рецепт сохранён в избранное!');
  };

  // Комментарии
  const commentsKey = `comments_${id}`;
  const commentsBlock = qS('#commentsBlock');
  const savedComments = JSON.parse(localStorage.getItem(commentsKey) || '[]');

  function showComments() {
    if (savedComments.length === 0) {
      commentsBlock.innerHTML = '<p class="text-muted">Пока нет комментариев. Будьте первым!</p>';
      return;
    }
    commentsBlock.innerHTML = savedComments.map(c => `
      <div class="border-bottom pb-2 mb-3">
        <strong>${esc(c.name)}</strong> 
        <small class="text-muted">— ${c.date}</small>
        <p class="mb-0 mt-1">${esc(c.text)}</p>
      </div>
    `).join('');
  }
  showComments();

  qS('#commentForm').onsubmit = (e) => {
    e.preventDefault();
    const name = qS('#commentUser').value.trim();
    const text = qS('#commentText').value.trim();
    if (!name || !text) return;

    savedComments.push({
      name,
      text,
      date: new Date().toLocaleDateString('ru')
    });
    localStorage.setItem(commentsKey, JSON.stringify(savedComments));
    qS('#commentUser').value = '';
    qS('#commentText').value = '';
    showComments();
  };

  qS('#clearCommentsBtn').onclick = () => {
    if (confirm('Очистить все комментарии к этому рецепту?')) {
      localStorage.removeItem(commentsKey);
      savedComments.length = 0;
      showComments();
    }
  };
}

function saveIngredient(recipeId, index, checked) {
  const key = `ingredients_${recipeId}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  data[index] = checked;
  localStorage.setItem(key, JSON.stringify(data));
}

// ----- ЗАПУСК -----
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  renderRecipePage();
});