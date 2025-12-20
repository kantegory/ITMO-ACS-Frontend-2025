document.addEventListener('DOMContentLoaded', () => {
  
  const recipes = [
    {
      id: 'r1', title: 'Шоколадные кексы', author: {id:'a1', name:'Анна'}, type:'dessert', difficulty:'easy',
      time:35, image:'images/cakes.webp',
      ingredients: ['мука','яйцо','сахар','какао'], steps: ['Смешать ингредиенты','Выпекать 20-25 минут'], video:'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'r2', title: 'Паста с соусом', author:{id:'a2', name:'Иван'}, type:'main', difficulty:'medium',
      time:25, image:'images/pasta.jpeg',
      ingredients:['паста','помидор','чеснок','сыр'], steps:['Отварить пасту','Приготовить соус','Смешать и подавать'], video:''
    },
    {
      id: 'r3', title: 'Ягодный пирог', author:{id:'a1', name:'Анна'}, type:'dessert', difficulty:'hard',
      time:90, image:'images/pie.jpeg',
      ingredients:['мука','масло','ягоды','сахар'], steps:['Тесто','Начинка','Выпекание'], video:''
    }
  ];

  const LS_USERS = 'cs_users';
  const LS_SESSION = 'cs_session';
  const LS_LIKES = 'cs_likes';       // {recipeId: true}
  const LS_SAVED = 'cs_saved';       // [recipeId,...]
  const LS_SUBS = 'cs_subs';         // {authorId: true}
  const LS_COMMENTS = 'cs_comments'; // {recipeId: [{name,text,date}, ...]}

  const $ = id => document.getElementById(id);
  const getLS = (k, def) => JSON.parse(localStorage.getItem(k) || JSON.stringify(def));
  const setLS = (k,v) => localStorage.setItem(k, JSON.stringify(v));


  function registerUser(name, email, pass) {
    const users = getLS(LS_USERS, []);
    if (users.find(u=>u.email===email)) return {ok:false, msg:'Почта уже занята'};
    users.push({id: 'u'+Date.now(), name, email, pass});
    setLS(LS_USERS, users);
    return {ok:true};
  }

  function loginUser(email, pass) {
    const users = getLS(LS_USERS, []);
    const u = users.find(x=>x.email===email && x.pass===pass);
    if (!u) return {ok:false, msg:'Неверный email или пароль'};
    setLS(LS_SESSION, u);
    return {ok:true, user:u};
  }

  function logout() { localStorage.removeItem(LS_SESSION); location.href='index.html'; }

  const registerForm = $('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('regName').value.trim();
      const email = $('regEmail').value.trim();
      const p1 = $('regPassword').value;
      const p2 = $('regPassword2').value;
      if (p1 !== p2) { $('registerMsg').innerHTML = `<div class="text-danger">Пароли не совпадают</div>`; return; }
      const res = registerUser(name,email,p1);
      if (!res.ok) { $('registerMsg').innerHTML = `<div class="text-danger">${res.msg}</div>`; return; }
      $('registerMsg').innerHTML = `<div class="text-success">Успешно! Перейдите к входу.</div>`;
      setTimeout(()=> location.href='index.html', 900);
    });
  }

  const loginForm = $('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = $('loginEmail').value.trim();
      const pass = $('loginPassword').value;
      const r = loginUser(email, pass);
      if (!r.ok) { $('loginMsg').innerHTML = `<div class="text-danger">${r.msg}</div>`; return; }
      location.href = 'profile.html';
    });
  }

  if ($('logoutBtn')) $('logoutBtn').addEventListener('click', logout);

  function renderProfile() {
    const session = getLS(LS_SESSION, null);
    if (!session) {
      if ($('profileName')) $('profileName').textContent = 'Гость';
      if ($('profileEmail')) $('profileEmail').textContent = '—';
      if ($('savedGrid')) $('savedGrid').innerHTML = `<div class="col-12"><p>Вы не вошли. Пожалуйста, <a href="index.html">войдите</a>.</p></div>`;
      return;
    }
    if ($('profileName')) $('profileName').textContent = session.name;
    if ($('profileEmail')) $('profileEmail').textContent = session.email;

    if ($('savedGrid')) {
      const saved = getLS(LS_SAVED, []);
      if (saved.length === 0) {
        $('savedGrid').innerHTML = '<div class="col-12"><p class="small-muted">Пока нет сохранённых рецептов.</p></div>';
      } else {
        const nodes = saved.map(id => {
          const r = recipes.find(x=>x.id===id);
          if (!r) return '';
          return `<div class="col-sm-6"><div class="card"><img src="${r.image}" class="card-img-top"><div class="card-body">
            <h6>${r.title}</h6>
            <p class="small text-muted">${r.time} мин • ${r.difficulty}</p>
            <a class="btn btn-sm btn-primary" href="recipe.html?id=${r.id}">Открыть</a>
            </div></div></div>`;
        }).join('');
        $('savedGrid').innerHTML = nodes;
      }
    }
  }

  if (location.pathname.endsWith('profile.html')) renderProfile();

  function renderCard(r) {
    const likes = getLS(LS_LIKES, {});
    const saved = getLS(LS_SAVED, []);
    const isLiked = likes[r.id];
    const isSaved = saved.includes(r.id);
    return `<div class="col-sm-6 col-md-4">
      <div class="card h-100">
        <img src="${r.image}" class="card-img-top" alt="${r.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${r.title}</h5>
          <p class="card-text small text-muted">${r.time} мин • ${r.difficulty}</p>
          <p class="small">Автор: <span class="tag">${r.author.name}</span></p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <button class="btn btn-sm btn-outline-primary like-toggle" data-id="${r.id}">${isLiked? '♥' : '♡'}</button>
              <button class="btn btn-sm btn-outline-secondary save-toggle" data-id="${r.id}">${isSaved? 'Saved' : 'Save'}</button>
            </div>
            <a class="btn btn-sm btn-primary" href="recipe.html?id=${r.id}">Открыть</a>
          </div>
        </div>
      </div>
    </div>`;
  }

  if (location.pathname.endsWith('search.html')) {
    const results = $('results');
    const applyBtn = $('apply');
    const clearBtn = $('clear');

    function doRender(list) {
      if (!results) return;
      if (list.length === 0) results.innerHTML = '<div class="col-12"><p>Рецепты не найдены</p></div>';
      else results.innerHTML = list.map(renderCard).join('');
    }

    function applyFilters() {
      const q = ($('q').value || '').toLowerCase().trim();
      const t = $('type').value;
      const d = $('difficulty').value;
      const ingr = ($('ingredients').value || '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
      let list = recipes.filter(r=>
        (q === '' || r.title.toLowerCase().includes(q)) &&
        (t === '' || r.type === t) &&
        (d === '' || r.difficulty === d)
      );
      if (ingr.length) {
        list = list.filter(r => ingr.every(i => r.ingredients.join(' ').toLowerCase().includes(i)));
      }
      doRender(list);
    }

    applyBtn.addEventListener('click', applyFilters);
    clearBtn.addEventListener('click', () => {
      $('q').value = ''; $('type').value = ''; $('difficulty').value = ''; $('ingredients').value = '';
      doRender(recipes);
    });

    results.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.like-toggle');
      const saveBtn = e.target.closest('.save-toggle');
      if (likeBtn) {
        const id = likeBtn.dataset.id;
        const likes = getLS(LS_LIKES, {});
        likes[id] = !likes[id];
        setLS(LS_LIKES, likes);
        applyFilters();
      } else if (saveBtn) {
        const id = saveBtn.dataset.id;
        const saved = getLS(LS_SAVED, []);
        if (saved.includes(id)) {
          setLS(LS_SAVED, saved.filter(x=>x!==id));
        } else { saved.push(id); setLS(LS_SAVED, saved); }
        applyFilters();
      }
    });

    doRender(recipes);
  }

  if (location.pathname.endsWith('recipe.html')) {
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || recipes[0].id;
    const r = recipes.find(x=>x.id===id);

    const container = $('recipeContainer');
    if (!r || !container) {
      if (container) container.innerHTML = '<p>Рецепт не найден</p>';
    } else {
      container.innerHTML = `
        <div class="card mb-3 recipe-hero">
          <img src="${r.image}" class="card-img-top" alt="${r.title}">
          <div class="card-body">
            <h2>${r.title}</h2>
            <p class="small text-muted">Автор: <a class="author-link" data-author="${r.author.id}" href="#">${r.author.name}</a> • ${r.time} мин • ${r.difficulty}</p>
            <div class="mb-2">
              <button id="likeBtn" class="btn btn-outline-primary">${getLS(LS_LIKES, {})[r.id] ? '♥' : '♡'}</button>
              <button id="saveBtn" class="btn btn-outline-secondary">${(getLS(LS_SAVED,[]).includes(r.id)) ? 'Saved' : 'Save'}</button>
              <button id="subBtn" class="btn btn-outline-success">${getLS(LS_SUBS,{})[r.author.id] ? 'Отписаться' : 'Подписаться'}</button>
            </div>
            <div class="row">
              <div class="col-md-6">
                <h5>Ингредиенты</h5>
                <ul id="ingList">${r.ingredients.map(i=>`<li>${i}</li>`).join('')}</ul>
              </div>
              <div class="col-md-6">
                <h5>Шаги</h5>
                <ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
              </div>
            </div>

            ${r.video ? `<div class="ratio ratio-16x9 mt-3"><iframe src="${r.video}" title="Видео" allowfullscreen></iframe></div>` : ''}
          </div>
        </div>

        <div class="card p-3 mb-3">
          <h5>Комментарии</h5>
          <div id="commentsList"></div>
          <form id="commentForm" class="mt-2">
            <div class="mb-2"><input id="commentName" class="form-control" placeholder="Имя" required></div>
            <div class="mb-2"><textarea id="commentText" class="form-control" rows="2" placeholder="Написать комментарий" required></textarea></div>
            <button class="btn btn-primary" type="submit">Отправить</button>
          </form>
        </div>
      `;

      const likeBtn = $('likeBtn');
      const saveBtn = $('saveBtn');
      const subBtn = $('subBtn');
      const commentsList = $('commentsList');
      const commentForm = $('commentForm');

      likeBtn.addEventListener('click', () => {
        const likes = getLS(LS_LIKES,{});
        likes[r.id] = !likes[r.id];
        setLS(LS_LIKES, likes);
        likeBtn.textContent = likes[r.id] ? '♥' : '♡';
      });

      saveBtn.addEventListener('click', () => {
        const saved = getLS(LS_SAVED, []);
        if (saved.includes(r.id)) {
          setLS(LS_SAVED, saved.filter(x=>x!==r.id));
          saveBtn.textContent = 'Save';
        } else {
          saved.push(r.id); setLS(LS_SAVED, saved); saveBtn.textContent = 'Saved';
        }
      });

      subBtn.addEventListener('click', () => {
        const subs = getLS(LS_SUBS, {});
        subs[r.author.id] = !subs[r.author.id];
        setLS(LS_SUBS, subs);
        subBtn.textContent = subs[r.author.id] ? 'Отписаться' : 'Подписаться';
      });

      function renderComments() {
        const comments = getLS(LS_COMMENTS, {});
        const list = comments[r.id] || [];
        if (list.length===0) commentsList.innerHTML = '<p class="small-muted">Нет комментариев.</p>';
        else commentsList.innerHTML = list.map(c => `<div class="comment"><strong>${escapeHtml(c.name)}</strong> <span class="small text-muted">• ${new Date(c.date).toLocaleString()}</span><p>${escapeHtml(c.text)}</p></div>`).join('');
      }

      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('commentName').value.trim();
        const text = $('commentText').value.trim();
        if (!name || !text) return;
        const comments = getLS(LS_COMMENTS, {});
        if (!comments[r.id]) comments[r.id] = [];
        comments[r.id].push({name, text, date: new Date().toISOString()});
        setLS(LS_COMMENTS, comments);
        $('commentName').value = ''; $('commentText').value = '';
        renderComments();
      });

      renderComments();

      document.querySelectorAll('.author-link').forEach(el=>{
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const authorId = el.dataset.author;
          location.href = `search.html?q=author:${authorId}`;
        });
      });
    }
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  if (location.pathname.endsWith('search.html')) {
    const p = new URLSearchParams(location.search);
    const q = p.get('q') || '';
    if (q.startsWith('author:')) {
      const id = q.split(':')[1];
      const list = recipes.filter(r=>r.author.id === id);
      const results = $('results');
      results.innerHTML = list.map(renderCard).join('');
    }
  }

  (function socialModule() {
    if (!location.pathname.endsWith('social.html')) return;

    const recentCommentsDiv = document.getElementById('recentComments');
    const trendingDiv = document.getElementById('trendingList');
    const subsDiv = document.getElementById('subscriptionsList');
    const qcForm = document.getElementById('quickCommentForm');

    function renderRecentComments() {
      const comments = getLS(LS_COMMENTS, {});
      const arr = [];
      Object.keys(comments).forEach(rid => {
        comments[rid].forEach(c => arr.push({...c, recipeId: rid}));
      });
      arr.sort((a,b)=> new Date(b.date) - new Date(a.date));
      const list = arr.slice(0, 10);
      if (!recentCommentsDiv) return;
      if (list.length === 0) recentCommentsDiv.innerHTML = '<p class="small-muted">Пока нет комментариев.</p>';
      else recentCommentsDiv.innerHTML = list.map(c => {
        const title = (recipes.find(r=>r.id===c.recipeId) || {title:'(удалённый рецепт)'}).title;
        return `<div class="activity-item">
          <div><strong>${escapeHtml(c.name)}</strong> <span class="small text-muted">• ${new Date(c.date).toLocaleString()}</span></div>
          <div class="small">${escapeHtml(c.text)}</div>
          <div class="small text-muted">Рецепт: <a href="recipe.html?id=${c.recipeId}">${escapeHtml(title)}</a></div>
        </div>`;
      }).join('');
    }

    function renderTrending() {
      const likes = getLS(LS_LIKES, {});
      const scored = recipes.map(r => ({...r, score: likes[r.id] ? 1 : 0}));
      scored.sort((a,b) => b.score - a.score || a.title.localeCompare(b.title));
      const top = scored.slice(0,6);
      if (!trendingDiv) return;
      trendingDiv.innerHTML = top.map(r => `
        <div class="col-12">
          <div class="d-flex gap-2 align-items-center trend-card">
            <img src="${r.image}" width="120" alt="${r.title}">
            <div>
              <div><a href="recipe.html?id=${r.id}"><strong>${r.title}</strong></a></div>
              <div class="small text-muted">${r.time} мин • ${r.difficulty}</div>
            </div>
            <div class="ms-auto">
              <button class="btn btn-sm btn-outline-primary like-from-trend" data-id="${r.id}">${getLS(LS_LIKES, {})[r.id] ? '♥' : '♡'}</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    function renderSubs() {
      const subs = getLS(LS_SUBS, {});
      const authors = {};
      recipes.forEach(r => { authors[r.author.id] = r.author.name; });
      const items = Object.keys(authors).map(id => ({id, name: authors[id], subscribed: !!subs[id]}));
      if (!subsDiv) return;
      subsDiv.innerHTML = items.map(a => `
        <div class="sub-item">
          <div><strong>${escapeHtml(a.name)}</strong></div>
          <div>
            <button class="btn btn-sm ${a.subscribed ? 'btn-outline-danger' : 'btn-outline-success'} sub-toggle" data-id="${a.id}">
              ${a.subscribed ? 'Отписаться' : 'Подписаться'}
            </button>
          </div>
        </div>
      `).join('');
    }

    document.addEventListener('click', (e) => {
      const likeBtn = e.target.closest('.like-from-trend');
      const subBtn = e.target.closest('.sub-toggle');
      if (likeBtn) {
        const id = likeBtn.dataset.id;
        const likes = getLS(LS_LIKES, {});
        likes[id] = !likes[id];
        setLS(LS_LIKES, likes);
        renderTrending();
      } else if (subBtn) {
        const id = subBtn.dataset.id;
        const subs = getLS(LS_SUBS, {});
        subs[id] = !subs[id];
        setLS(LS_SUBS, subs);
        renderSubs();
      }
    });

    if (qcForm) {
      qcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rid = document.getElementById('qcRecipeId').value.trim();
        const name = document.getElementById('qcName').value.trim();
        const text = document.getElementById('qcText').value.trim();
        const qcMsg = document.getElementById('qcMsg');
        if (!rid || !name || !text) { if (qcMsg) qcMsg.innerHTML = '<div class="text-danger">Заполните все поля</div>'; return; }
        const comments = getLS(LS_COMMENTS, {});
        if (!comments[rid]) comments[rid] = [];
        comments[rid].push({name, text, date: new Date().toISOString()});
        setLS(LS_COMMENTS, comments);
        if (qcMsg) qcMsg.innerHTML = '<div class="text-success">Комментарий добавлен</div>';
        qcForm.reset();
        renderRecentComments();
      });
      document.getElementById('qcClear').addEventListener('click', () => qcForm.reset());
    }

    renderRecentComments();
    renderTrending();
    renderSubs();

  })();

});
