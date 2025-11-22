// ---- Helpers ----
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s == null ? '' : String(s);
  return d.innerHTML;
}
function qS(selector) { return document.querySelector(selector); }
function qSA(selector) { return Array.from(document.querySelectorAll(selector)); }
function getParam(name) { return new URLSearchParams(window.location.search).get(name); }

// ---- LocalStorage для лайков ----
const LS_LIKES = 'recipes_likes_v1';
function loadLikes() {
  try { return JSON.parse(localStorage.getItem(LS_LIKES)) || {}; }
  catch { return {}; }
}
function saveLikes(obj) {
  try { localStorage.setItem(LS_LIKES, JSON.stringify(obj)); }
  catch(e) { console.warn('LS save failed', e); }
}
function incLike(id) {
  const m = loadLikes();
  const k = String(id);
  m[k] = (m[k] || 0) + 1;
  saveLikes(m);
  return m[k];
}
function getLikeCount(id) {
  const m = loadLikes();
  return m[String(id)] ?? 0;
}

// ---- Image fallback (помощь при проблемах) ----
window.handleImageError = function(imgEl, fallback = 'assets/img/example.jpg') {
  if (!imgEl) return;
  imgEl.onerror = null;
  imgEl.src = fallback;
  imgEl.classList.add('img-fallback');
};

// ---- Card template ----
function renderCard(recipe) {
  const likes = getLikeCount(recipe.id) || recipe.likes || 0;
  return `
    <div class="col-12 col-sm-6 col-md-4">
      <div class="card h-100 shadow-sm">
        <img src="${esc(recipe.image)}"
             class="card-img-top"
             alt="${esc(recipe.title)}"
             onerror="handleImageError(this)">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${esc(recipe.title)}</h5>
          <p class="card-text text-truncate">${esc(recipe.short || '')}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <small class="text-muted">${esc(String(recipe.time || '—'))} мин</small>
              <span class="badge bg-secondary ms-2">${esc(recipe.difficulty || '')}</span>
            </div>
            <div class="d-flex align-items-center">
              <a href="recipe.html?id=${encodeURIComponent(String(recipe.id))}" class="btn btn-sm btn-primary me-2">Просмотр</a>
              <button class="btn btn-outline-danger btn-sm like-btn" data-id="${esc(String(recipe.id))}">❤</button>
              <small class="text-muted ms-2 likes-count" data-id="${esc(String(recipe.id))}">${esc(String(likes))}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- Render grid ----
function renderGrid(filterQ = '') {
  const container = document.getElementById('recipesGrid');
  if (!container) return;
  if (typeof RECIPES === 'undefined' || !Array.isArray(RECIPES)) {
    container.innerHTML = '<div class="col-12"><div class="alert alert-danger">Recipes not found (js/data.js)</div></div>';
    return;
  }

  const q = (filterQ || '').trim().toLowerCase();
  const list = q ? RECIPES.filter(r => (r.title||'').toLowerCase().includes(q) || (r.short||'').toLowerCase().includes(q)) : RECIPES;

  container.innerHTML = list.map(renderCard).join('\n');

  // bind like buttons
  qSA('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const newCount = incLike(id);
      qSA(`.likes-count[data-id="${CSS.escape(String(id))}"]`).forEach(el => el.textContent = String(newCount));
    });
  });
}

// ---- Render details (recipe.html) ----
function renderRecipeDetails() {
  const titleEl = document.getElementById('recipeTitle');
  if (!titleEl) return; // нет на странице рецептов
  const id = getParam('id');
  if (!id) { titleEl.textContent = 'Рецепт не выбран'; return; }
  const recipe = RECIPES.find(r => String(r.id) === String(id));
  if (!recipe) { titleEl.textContent = 'Рецепт не найден'; return; }

  // наполнение
  titleEl.textContent = recipe.title || '';
  const subtitle = qS('#recipeSubtitle'); if (subtitle) subtitle.textContent = recipe.short || '';
  const img = qS('#recipeImage'); if (img) { img.onerror = function(){ handleImageError(this); }; img.src = recipe.image || 'assets/img/example.jpg'; img.alt = recipe.title || ''; }
  const ingredientsList = qS('#ingredientsList'); if (ingredientsList) {
    if (Array.isArray(recipe.ingredients) && recipe.ingredients.length) ingredientsList.innerHTML = recipe.ingredients.map(i => `<li>${esc(i)}</li>`).join('');
    else ingredientsList.innerHTML = '<li>—</li>';
  }
  const stepsList = qS('#stepsList'); if (stepsList) {
    if (Array.isArray(recipe.steps) && recipe.steps.length) stepsList.innerHTML = recipe.steps.map(s => `<li>${esc(s)}</li>`).join('');
    else stepsList.innerHTML = '<li>—</li>';
  }

  // кнопка лайков при просмотре рецепта
  const likeBtn = qS('#likeBtn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const newCount = incLike(id);
      // update card-like counters (if any)
      qSA(`.likes-count[data-id="${CSS.escape(String(id))}"]`).forEach(el => el.textContent = String(newCount));
    });
  }
}

// ---- Init on DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', function() {
  // рендер grid если есть котейнер
  if (document.getElementById('recipesGrid')) {
    // if search page with q param, pass it
    const q = new URLSearchParams(window.location.search).get('q') || '';
    renderGrid(q);
  }
  // рендер
  renderRecipeDetails();
});
