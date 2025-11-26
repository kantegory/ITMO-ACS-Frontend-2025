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
              <button class="btn btn-outline-danger btn-sm like-btn" data-id="${recipe.id}">Лайк</button>
              <small class="ms-1">${likes}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Рендер главной страницы и поиска 
function renderGrid() {
  const container = document.getElementById('recipesGrid');
  if (!container) return;

  const q = (getParam('q') || '').toLowerCase();

  const customRecipes = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const allRecipes = [...RECIPES, ...customRecipes];

  let list = allRecipes;

  if (q) {
    list = allRecipes.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.short && r.short.toLowerCase().includes(q))
    );
  }

  container.innerHTML = list.map(renderCard).join('');

  qSA('.like-btn').forEach(btn => {
    btn.onclick = () => {
      const count = likeRecipe(btn.dataset.id);
      btn.nextElementSibling.textContent = count;
    };
  });
}

// ----- СТРАНИЦА РЕЦЕПТА -----
function renderRecipePage() {
  const titleEl = qS('#recipeTitle');
  if (!titleEl) return;

  const id = getParam('id');
  if (!id) { titleEl.textContent = 'Рецепт не найден'; return; }

  const customRecipes = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const allRecipes = [...RECIPES, ...customRecipes];
  const recipe = allRecipes.find(r => String(r.id) === id);

  if (!recipe) { titleEl.textContent = 'Рецепт не найден'; return; }

  // Основные данные
  titleEl.textContent = recipe.title;
  qS('#recipeSubtitle').textContent = recipe.short || '';
  qS('#timeInfo').textContent = (recipe.time || '-') + ' мин';
  qS('#difficultyInfo').textContent = recipe.difficulty || '-';
  qS('#authorInfo').textContent = recipe.author || 'Неизвестен';
  qS('#publishedInfo').textContent = recipe.published || '';

  // Галерея
  const mainImg = qS('#mainRecipeImage');
  const thumbs = qS('#thumbs');
  const images = recipe.images || [recipe.image || 'assets/img/example.jpg'];
  mainImg.src = images[0];
  mainImg.alt = recipe.title;
  thumbs.innerHTML = images.map((src, i) => 
    `<img src="${src}" class="rounded" style="width:80px;height:80px;object-fit:cover;cursor:pointer;border:${i===0?'3px solid #0d6efd':'2px solid #ddd'}"
          onclick="document.getElementById('mainRecipeImage').src=this.src">`
  ).join(' ');

  // Ингредиенты
  const ingList = qS('#ingredientsList');
  const savedChecks = JSON.parse(localStorage.getItem(`ingredients_${id}`) || '{}');
  ingList.innerHTML = recipe.ingredients.map((ing, i) => {
    const checked = savedChecks[i] ? 'checked' : '';
    return `<li class="ingredient-item mb-2">
              <input type="checkbox" id="ing${i}" ${checked} onchange="saveIngredient(${id}, ${i}, this.checked)">
              <label for="ing${i}" style="cursor:pointer">${esc(ing)}</label>
            </li>`;
  }).join('');

  qS('#stepsList').innerHTML = recipe.steps.map(s => `<li class="mb-3">${esc(s)}</li>`).join('');

  // Лайки
  const likeBtn = qS('#likeBtn');
  const currentLikes = getLikes()[id] || 0;
  likeBtn.innerHTML = `Лайк Нравится (${currentLikes})`;
  likeBtn.onclick = () => {
    const newCount = likeRecipe(id);
    likeBtn.innerHTML = `Лайк Нравится (${newCount})`;
  };

  // // Сохранение в избранное
  qS('#saveBtn').onclick = (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      alert('Войдите в аккаунт, чтобы сохранять рецепты!');
      return;
    }

    const savedObj = JSON.parse(localStorage.getItem(LS_SAVED) || '{}');
    if (!savedObj[user.email]) savedObj[user.email] = [];

    if (savedObj[user.email].includes(id)) {
      alert('Рецепт уже в избранном!');
      return;
    }

    savedObj[user.email].push(id);
    localStorage.setItem(LS_SAVED, JSON.stringify(savedObj));
    alert('Рецепт сохранён в избранное!');

    updateProfilePage();
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
        <strong>${esc(c.name)}</strong> <small class="text-muted">— ${c.date}</small>
        <p class="mb-0 mt-1">${esc(c.text)}</p>
      </div>
    `).join('');
  }
  showComments();

  qS('#commentForm').onsubmit = e => {
    e.preventDefault();
    const name = qS('#commentUser').value.trim();
    const text = qS('#commentText').value.trim();
    if (!name || !text) return;
    savedComments.push({ name, text, date: new Date().toLocaleDateString('ru') });
    localStorage.setItem(commentsKey, JSON.stringify(savedComments));
    qS('#commentUser').value = '';
    qS('#commentText').value = '';
    showComments();
  };

  qS('#clearCommentsBtn').onclick = () => {
    if (confirm('Очистить все комментарии?')) {
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

// ----- ФИЛЬТРЫ -----
function applyFilters() {
  const text = (qS('#searchInput')?.value || '').toLowerCase();
  const cats = Array.from(qSA('.category-filter:checked')).map(c => c.value);
  const diff = qS('#difficultyFilter')?.value || '';
  const time = qS('#timeFilter')?.value ? Number(qS('#timeFilter').value) : null;

  const customRecipes = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const allRecipes = [...RECIPES, ...customRecipes];

  const filtered = allRecipes.filter(r => {
    if (text && !r.title.toLowerCase().includes(text) && !(r.short && r.short.toLowerCase().includes(text))) return false;
    if (cats.length && !r.tags?.some(t => cats.includes(t))) return false;
    if (diff && r.difficulty !== diff) return false;
    if (time !== null && r.time > time) return false;
    return true;
  });

  const grid = qS('#recipesGrid');
  grid.innerHTML = filtered.length === 0
    ? '<div class="col-12 text-center text-muted">Ничего не найдено</div>'
    : filtered.map(renderCard).join('');

  qSA('.like-btn').forEach(btn => {
    btn.onclick = () => {
      const count = likeRecipe(btn.dataset.id);
      btn.nextElementSibling.textContent = count;
    };
  });
}

// ----- АВТОРИЗАЦИЯ — МОДАЛЬНОЕ ОКНО -----
const LS_USER = 'recipes_user';
const LS_USERS = 'recipes_users';
const LS_SAVED = 'recipes_saved';
const LS_CUSTOM = 'recipes_custom';

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; }
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
  users[user.email] = user;
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_USER, JSON.stringify(user));
}

// ШАПКА 
function updateHeaderUserInfo() {
  const user = getCurrentUser();
  const block = document.getElementById('userHeaderInfo');
  if (!block) return;

  if (user) {
    block.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${user.avatar || 'assets/img/avatar-placeholder.jpg'}" class="rounded-circle me-2" width="38" height="38" alt="Аватар">
        <span class="me-3 fw-medium">${esc(user.name)}</span>
        <button class="btn btn-outline-secondary btn-sm" id="headerLogout">Выйти</button>
      </div>
    `;
    document.getElementById('headerLogout')?.addEventListener('click', () => {
      if (confirm('Выйти из аккаунта?')) {
        localStorage.removeItem(LS_USER);
        location.reload();
      }
    });
  } else {
    block.innerHTML = '';
  }
}

// ПРОФИЛЬ — только на profile.html
function updateProfilePage() {
  const profileName = qS('#profileName');
  if (!profileName) return;

  const user = getCurrentUser();
  if (user) {
    qS('#profileName').textContent = user.name;
    qS('#profileEmail').textContent = user.email;
    qS('#profileAvatar').src = user.avatar || 'assets/img/avatar-placeholder.jpg';
    qS('#guestView')?.classList.add('d-none');
    qS('#userView')?.classList.remove('d-none');

    const saved = JSON.parse(localStorage.getItem(LS_SAVED) || '{}')[user.email] || [];
    const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
    const allRecipes = [...RECIPES, ...custom];
    const grid = qS('#savedRecipes');

    if (saved.length === 0) {
      grid.innerHTML = '<div class="col-12 text-muted">Нет сохранённых рецептов</div>';
    } else {
      grid.innerHTML = saved
        .map(id => allRecipes.find(r => String(r.id) === String(id)))
        .filter(Boolean)
        .map(renderCard)
        .join('');
    }
  } else {
    qS('#profileName').textContent = 'Гость';
    qS('#profileEmail').textContent = 'Войдите, чтобы сохранять рецепты';
    qS('#profileAvatar').src = 'assets/img/avatar-placeholder.jpg';
    qS('#guestView')?.classList.remove('d-none');
    qS('#userView')?.classList.add('d-none');
    qS('#savedRecipes').innerHTML = '<div class="col-12 text-muted">Войдите, чтобы видеть сохранённые рецепты</div>';
  }
}

// Модальное окно входа/регистрации
if (qS('#authModal')) {
  const modal = qS('#authModal');
  const form = qS('#authForm');

  modal.addEventListener('show.bs.modal', () => {
    const user = getCurrentUser();
    if (user) {
      qS('#authModalTitle').textContent = 'Редактировать профиль';
      qS('#authName').value = user.name;
      qS('#authEmail').value = user.email;
      qS('#authPassword').value = user.password || '';
      qS('#authAvatarPreview').src = user.avatar || 'assets/img/avatar-placeholder.jpg';
      qS('#authSubmitBtn').textContent = 'Сохранить изменения';
    } else {
      qS('#authModalTitle').textContent = 'Вход или регистрация';
      qS('#authName').value = '';
      qS('#authEmail').value = '';
      qS('#authPassword').value = '';
      qS('#authAvatarPreview').src = 'assets/img/avatar-placeholder.jpg';
      qS('#authSubmitBtn').textContent = 'Войти или зарегистрироваться';
    }
  });

  qS('#authAvatar')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => qS('#authAvatarPreview').src = reader.result;
      reader.readAsDataURL(file);
    }
  });

  form.onsubmit = e => {
    e.preventDefault();
    const file = qS('#authAvatar').files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const user = {
        name: qS('#authName').value.trim(),
        email: qS('#authEmail').value.trim().toLowerCase(),
        password: qS('#authPassword').value,
        avatar: reader.result || qS('#authAvatarPreview').src
      };

      if (!user.name || !user.email || !user.password) {
        alert('Заполните все поля!');
        return;
      }

      saveUser(user);
      bootstrap.Modal.getInstance(modal).hide();
      updateHeaderUserInfo();
      updateProfilePage();
      alert('Добро пожаловать, ' + user.name + '!');
    };

    if (file) reader.readAsDataURL(file);
    else reader.onload();
  };
}

// Выход в профиле
qS('#logoutBtn')?.addEventListener('click', () => {
  if (confirm('Выйти из аккаунта?')) {
    localStorage.removeItem(LS_USER);
    location.reload();
  }
});

// Добавление своего рецепта
if (qS('#addRecipeForm')) {
  qS('#addRecipeForm').onsubmit = e => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) { alert('Войдите в аккаунт!'); return; }

    const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
    const newRecipe = {
      id: Date.now() + '',
      title: qS('#newTitle').value,
      short: qS('#newShort').value,
      time: +qS('#newTime').value,
      difficulty: qS('#newDifficulty').value,
      ingredients: qS('#newIngredients').value.split('\n').filter(Boolean),
      steps: qS('#newSteps').value.split('\n').filter(Boolean),
      author: user.name,
      published: new Date().toLocaleDateString('ru'),
      image: 'assets/img/example.jpg',
      tags: []
    };
    custom.push(newRecipe);
    localStorage.setItem(LS_CUSTOM, JSON.stringify(custom));
    bootstrap.Modal.getInstance(qS('#addRecipeModal')).hide();
    qS('#addRecipeForm').reset();

    renderGrid();
    updateProfilePage();
    alert('Рецепт добавлен!');
  };
}

// ЗАПУСК 
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
  updateProfilePage();
  renderGrid();
  renderRecipePage();
  if (qS('#searchInput')) applyFilters();
});