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
// ----- LS: пользователи, сохранённые, кастомные рецепты -----
const LS_USER = 'recipes_user';
const LS_USERS = 'recipes_users';
const LS_SAVED = 'recipes_saved';
const LS_CUSTOM = 'recipes_custom';

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
 
// ----- РЕНДЕР КАРТОЧЕК -----
function renderCard(recipe, options = {}) {
  const likes = getLikes()[recipe.id] || 0;
  const mainImg = recipe.image || (recipe.images && recipe.images[0]) || 'assets/img/example.jpg';
  const user = getCurrentUser();

  // Кнопка удаления — только если это рецепт пользователя
  const deleteBtn = (user && recipe.author === user.name)
    ? `<button class="btn btn-danger btn-sm delete-recipe" data-id="${recipe.id}">Удалить</button>`
    : '';

  // => УБРАНА КНОПКА "сохранить" из карточки (требование: кнопка сохранения — только на странице recipe.html)

  return `
    <div class="col-12 col-sm-6 col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${mainImg}" class="card-img-top" alt="${esc(recipe.title)}"
             onerror="this.src='assets/img/example.jpg'">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${esc(recipe.title)}</h5>
          <p class="card-text text-truncate">${esc(recipe.short || '')}</p>
          <small class="text-muted">Автор: ${esc(recipe.author || 'Неизвестен')}</small>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted">${recipe.time || '-'} мин</small>
              <span class="badge bg-secondary ms-2">${esc(recipe.difficulty || '')}</span>
            </div>
            <div>
              <a href="recipe.html?id=${recipe.id}" class="btn btn-sm btn-primary me-2">Просмотр</a>
              <button class="btn btn-outline-danger btn-sm like-btn" data-id="${recipe.id}">Лайк</button>
              <small class="ms-1">${likes}</small>
              ${deleteBtn}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ----- РЕНДЕР КАРТОЧЕК (главная и поиск) -----
function renderGrid() {
  const container = document.getElementById('recipesGrid');
  if (!container) return;

  const q = (getParam('q') || '').toLowerCase();
  const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const all = [...RECIPES, ...custom];

  let list = all;
  if (q) {
    list = all.filter(r =>
      r.title.toLowerCase().includes(q) ||
      (r.short && r.short.toLowerCase().includes(q))
    );
  }

  container.innerHTML = list.map(r => renderCard(r)).join('');
  attachLikeAndDeleteHandlers();
}

function applyFilters() {
  const text = (qS('#searchInput')?.value || '').toLowerCase();
  const cats = Array.from(qSA('.category-filter:checked')).map(c => c.value);
  const diff = qS('#difficultyFilter')?.value || '';
  const time = qS('#timeFilter')?.value ? Number(qS('#timeFilter').value) : null;

  const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const all = [...RECIPES, ...custom];

  const filtered = all.filter(r => {
    if (text && !r.title.toLowerCase().includes(text) && !(r.short && r.short.toLowerCase().includes(text))) return false;
    if (cats.length && !r.tags?.some(t => cats.includes(t))) return false;
    if (diff && r.difficulty !== diff) return false;
    if (time !== null && r.time > time) return false;
    return true;
  });

  const grid = qS('#recipesGrid');
  grid.innerHTML = filtered.length === 0
    ? '<div class="col-12 text-center text-muted">Ничего не найдено</div>'
    : filtered.map(r => renderCard(r)).join('');

  attachLikeAndDeleteHandlers();
}

// ----- ОБРАБОТЧИКИ (лайк, удалить) -----
// Note: обработчик карточечной кнопки "сохранить" удалён — кнопка сохранения существует только на странице recipe.html
function attachLikeAndDeleteHandlers() {
  // Обработчик лайков
  qSA('.like-btn').forEach(btn => {
    btn.onclick = () => {
      const id = String(btn.dataset.id);
      const count = likeRecipe(id);
      const group = btn.parentElement;
      if (group) {
        const small = group.querySelector('small');
        if (small) small.textContent = count;
      }
      if (location.pathname.includes('recipe.html')) renderRecipePage();
    };
  });

  // Удаление рецепта (работаем со строковыми id)
  qSA('.delete-recipe').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Удалить этот рецепт навсегда?')) return;
      const id = String(btn.dataset.id);
      let custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
      custom = custom.filter(r => String(r.id) !== id);
      localStorage.setItem(LS_CUSTOM, JSON.stringify(custom));
      renderGrid();
      updateProfilePage();
      if (location.pathname.includes('recipe.html')) renderRecipePage();
    };
  });
}

// ----- СТРАНИЦА РЕЦЕПТА -----
function renderRecipePage() {
  const titleEl = qS('#recipeTitle');
  if (!titleEl) return;

  const id = getParam('id');
  if (!id) { titleEl.textContent = 'Рецепт не найден'; return; }

  const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const all = [...RECIPES, ...custom];
  const recipe = all.find(r => String(r.id) === id);
  if (!recipe) { titleEl.textContent = 'Рецепт не найден'; return; }

  titleEl.textContent = recipe.title;
  qS('#recipeSubtitle').textContent = recipe.short || '';
  qS('#timeInfo').textContent = (recipe.time || '-') + ' мин';
  qS('#difficultyInfo').textContent = recipe.difficulty || '-';
  qS('#authorInfo').textContent = recipe.author || 'Неизвестен';
  qS('#publishedInfo').textContent = recipe.published || '';

  const mainImg = qS('#mainRecipeImage');
  const thumbs = qS('#thumbs');
  const images = recipe.images || [recipe.image || 'assets/img/example.jpg'];
  mainImg.src = images[0];
  mainImg.alt = recipe.title;
  thumbs.innerHTML = images.map((src, i) =>
    `<img src="${src}" class="rounded" style="width:80px;height:80px;object-fit:cover;cursor:pointer;border:${i===0?'3px solid #0d6efd':'2px solid #ddd'}"
          onclick="document.getElementById('mainRecipeImage').src=this.src">`
  ).join(' ');

  const ingList = qS('#ingredientsList');
  const savedChecks = JSON.parse(localStorage.getItem(`ingredients_${id}`) || '{}');
  ingList.innerHTML = recipe.ingredients.map((ing, i) => {
    const checked = savedChecks[i] ? 'checked' : '';
    return `<li class="ingredient-item mb-2">
              <input type="checkbox" id="ing${i}" ${checked} onchange="saveIngredient('${id}', ${i}, this.checked)">
              <label for="ing${i}" style="cursor:pointer">${esc(ing)}</label>
            </li>`;
  }).join('');

  qS('#stepsList').innerHTML = recipe.steps.map(s => `<li class="mb-3">${esc(s)}</li>`).join('');

  const likeBtn = qS('#likeBtn');
  const currentLikes = getLikes()[id] || 0;
  if (likeBtn) {
    likeBtn.innerHTML = `Лайк Нравится (${currentLikes})`;
    likeBtn.onclick = () => {
      const newCount = likeRecipe(id);
      likeBtn.innerHTML = `Лайк Нравится (${newCount})`;
    };
  }

  // СОХРАНЕНИЕ В ИЗБРАННОЕ (кнопка на странице рецепта — единственная точка сохранения)
  const saveBtn = qS('#saveBtn');
  const user = getCurrentUser();
  const savedObjAll = JSON.parse(localStorage.getItem(LS_SAVED) || '{}');
  const isSaved = user && Array.isArray(savedObjAll[user.email]) && savedObjAll[user.email].includes(id);

  if (saveBtn) {
    saveBtn.textContent = isSaved ? 'В избранном' : 'Сохранить в избранное';
    saveBtn.className = isSaved ? 'btn btn-success' : 'btn btn-outline-primary';

    saveBtn.onclick = e => {
      e.preventDefault();
      if (!user) {
        alert('Войдите в аккаунт!');
        return;
      }

      const savedObj = JSON.parse(localStorage.getItem(LS_SAVED) || '{}');
      if (!Array.isArray(savedObj[user.email])) savedObj[user.email] = [];

      const index = savedObj[user.email].indexOf(id);
      if (index === -1) {
        // Добавление
        savedObj[user.email].push(id);
        saveBtn.textContent = 'В избранном';
        saveBtn.className = 'btn btn-success';
      } else {
        // Удаление
        savedObj[user.email].splice(index, 1);
        saveBtn.textContent = 'Сохранить в избранное';
        saveBtn.className = 'btn btn-outline-primary';
      }

      localStorage.setItem(LS_SAVED, JSON.stringify(savedObj));
      updateProfilePage();
      renderGrid();
    };
  }

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
}

function saveIngredient(recipeId, index, checked) {
  const key = `ingredients_${recipeId}`;
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  data[index] = checked;
  localStorage.setItem(key, JSON.stringify(data));
}

// ----- ПРОФИЛЬ: МОИ РЕЦЕПТЫ + ИЗБРАННОЕ -----
function updateProfilePage() {
  const profileName = qS('#profileName');
  if (!profileName) return;

  const user = getCurrentUser();

  if (!user) {
    qS('#profileName').textContent = 'Гость';
    qS('#profileEmail').textContent = 'Войдите, чтобы видеть свои рецепты';
    qS('#profileAvatar').src = 'assets/img/avatar-placeholder.jpg';
    qS('#guestView')?.classList.remove('d-none');
    qS('#userView')?.classList.add('d-none');
    return;
  }

  // Авторизован
  qS('#profileName').textContent = user.name;
  qS('#profileEmail').textContent = user.email;
  qS('#profileAvatar').src = user.avatar || 'assets/img/avatar-placeholder.jpg';
  qS('#guestView')?.classList.add('d-none');
  qS('#userView')?.classList.remove('d-none');

  const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
  const myRecipes = custom.filter(r => r.author === user.name);

  const savedIds = (JSON.parse(localStorage.getItem(LS_SAVED) || '{}')[user.email] || []);
  const all = [...RECIPES, ...custom];
  const savedRecipes = savedIds
    .map(id => all.find(r => String(r.id) === String(id)))
    .filter(Boolean);

  // Сохранённые
  const savedContainer = qS('#savedRecipes');
  if (savedContainer) {
    savedContainer.innerHTML = savedRecipes.length === 0
      ? '<div class="col-12 text-muted">Нет сохранённых рецептов</div>'
      : savedRecipes.map(r => renderCard(r)).join('');
  }

  // Мои рецепты
  const myContainer = qS('#myRecipes');
  if (myContainer) {
    myContainer.innerHTML = myRecipes.length === 0
      ? '<div class="col-12 text-muted">Вы ещё не добавили ни одного рецепта</div>'
      : myRecipes.map(r => renderCard(r)).join('');
  }

  attachLikeAndDeleteHandlers();
}

// ----- АВТОРИЗАЦИЯ С ПРОВЕРКОЙ ПАРОЛЯ -----
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; }
}

function saveUser(user) {
  const users = JSON.parse(localStorage.getItem(LS_USERS) || '{}');
  users[user.email] = user;
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_USER, JSON.stringify(user));
}

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
      if (confirm('Выйти?')) {
        localStorage.removeItem(LS_USER);
        location.reload();
      }
    });
  } else {
    block.innerHTML = '';
  }
}

if (qS('#authModal')) {
  const modal = qS('#authModal');
  const form = qS('#authForm');

  modal.addEventListener('show.bs.modal', () => {
    const user = getCurrentUser();
    qS('#passwordRepeatGroup')?.classList.toggle('d-none', !!user);
    if (user) {
      qS('#authModalTitle').textContent = 'Редактировать профиль';
      qS('#authName').value = user.name;
      qS('#authEmail').value = user.email;
      qS('#authPassword').value = user.password || '';
      qS('#authPasswordRepeat').value = user.password || '';
      qS('#authAvatarPreview').src = user.avatar || 'assets/img/avatar-placeholder.jpg';
      qS('#authSubmitBtn').textContent = 'Сохранить';
    } else {
      qS('#authModalTitle').textContent = 'Регистрация / Вход';
      form.reset();
      qS('#authAvatarPreview').src = 'assets/img/avatar-placeholder.jpg';
      qS('#authSubmitBtn').textContent = 'Зарегистрироваться';
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
    const isEdit = !!getCurrentUser();
    const password = qS('#authPassword').value;
    const repeat = qS('#authPasswordRepeat').value;

    if (!isEdit && password !== repeat) {
      alert('Пароли не совпадают!');
      return;
    }

    const file = qS('#authAvatar').files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const user = {
        name: qS('#authName').value.trim(),
        email: qS('#authEmail').value.trim().toLowerCase(),
        password: password,
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
      alert(isEdit ? 'Профиль обновлён!' : 'Добро пожаловать, ' + user.name + '!');
    };

    if (file) reader.readAsDataURL(file);
    else reader.onload();
  };
}

// Добавление рецепта
document.querySelectorAll('#addRecipeForm, #addRecipeFormInline').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      alert('Войдите в аккаунт!');
      return;
    }

    const getField = (name) => {
      return this.querySelector(`#${name}`) || this.querySelector(`#${name}Inline`);
    };

    const titleEl = getField('newTitle');
    const shortEl = getField('newShort');
    const timeEl = getField('newTime');
    const diffEl = getField('newDifficulty');
    const ingredientsEl = getField('newIngredients');
    const stepsEl = getField('newSteps');

    const title = (titleEl?.value || '').trim();
    const short = (shortEl?.value || '').trim();
    const time = parseInt(timeEl?.value) || 0;
    const difficulty = (diffEl?.value) || 'Легко';
    const ingredients = (ingredientsEl?.value || '').split('\n').map(s => s.trim()).filter(Boolean);
    const steps = (stepsEl?.value || '').split('\n').map(s => s.trim()).filter(Boolean);

    if (!title || ingredients.length === 0 || steps.length === 0) {
      alert('Заполните все обязательные поля!');
      return;
    }

    const custom = JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]');
    const newId = String(Date.now() + Math.random().toString(36).substr(2, 9));

    custom.push({
      id: newId,
      title,
      short,
      time,
      difficulty,
      ingredients,
      steps,
      author: user.name,
      published: new Date().toLocaleDateString('ru'),
      image: 'assets/img/example.jpg',
      images: ['assets/img/example.jpg'],
      tags: []
    });

    localStorage.setItem(LS_CUSTOM, JSON.stringify(custom));
    this.reset();

    // Закрыть модалку, если открыта
    const modal = this.closest('.modal');
    if (modal) {
      bootstrap.Modal.getInstance(modal)?.hide();
    }

    // Обновление
    renderGrid();
    updateProfilePage();
    if (location.pathname.includes('search.html')) applyFilters();

    // Модалка публикации рецепта
    const successModalEl = document.getElementById('successRecipeModal');
    if (successModalEl) {
      bootstrap.Modal.getOrCreateInstance(successModalEl).show();
    } else {
      alert('Рецепт опубликован!');
    }
  });
});

// Выход из аккаунта с профиля
qS('#logoutBtn')?.addEventListener('click', () => {
  if (confirm('Выйти из аккаунта?')) {
    localStorage.removeItem(LS_USER);
    location.reload();
  }
});

// ----- ЗАПУСК -----
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderUserInfo();
  updateProfilePage();
  renderGrid();
  renderRecipePage();
  if (qS('#searchInput')) {
    ['#searchInput', '.category-filter', '#difficultyFilter', '#timeFilter'].forEach(sel => {
      qSA(sel).forEach(el => el.addEventListener('input', applyFilters));
      qSA(sel).forEach(el => el.addEventListener('change', applyFilters));
    });
    qS('#resetFilters')?.addEventListener('click', () => {
      qS('#searchInput').value = '';
      qSA('.category-filter').forEach(c => c.checked = false);
      qS('#difficultyFilter').value = '';
      qS('#timeFilter').value = '';
      applyFilters();
    });
    applyFilters();
  }
});
