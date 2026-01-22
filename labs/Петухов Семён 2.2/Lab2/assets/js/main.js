// Shared JS: API data, auth, filtering, rendering, modals

const API_BASE_URL = 'http://localhost:3001';
const api = axios.create({ baseURL: API_BASE_URL, timeout: 5000 });
let advertisementCache = null;
let conversationsCache = new Map();
let transactionsCache = new Map();

function removeAdvertisementFromCache(id){
  const idStr = normalizeId(id);
  if(!idStr || !Array.isArray(advertisementCache)) return;
  advertisementCache = advertisementCache.filter(prop => prop.id !== idStr);
}

function normalizeId(value){
  if(value === undefined || value === null) return null;
  if(typeof value === 'string'){
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if(typeof value === 'number' && !Number.isNaN(value)){
    return String(value);
  }
  return null;
}

function withStringId(entity){
  if(!entity || typeof entity !== 'object') return null;
  const id = normalizeId(entity.id);
  if(!id) return null;
  if(entity.id === id) return entity;
  return { ...entity, id };
}

function normalizeAdv(prop){
  if(!prop || typeof prop !== 'object') return null;
  const id = normalizeId(prop.id);
  const ownerId = normalizeId(prop.ownerId);
  const tenantId = normalizeId(prop.tenantId);
  return {
    ...prop,
    id: id || prop.id,
    ownerId: ownerId || prop.ownerId,
    tenantId: tenantId || prop.tenantId
  };
}

function normalizeConversation(conv){
  if(!conv || typeof conv !== 'object') return null;
  return {
    ...conv,
    id: normalizeId(conv.id) || conv.id,
    userId: normalizeId(conv.userId) || conv.userId,
    propertyId: normalizeId(conv.propertyId) || conv.propertyId
  };
}

function normalizeTransaction(tx){
  if(!tx || typeof tx !== 'object') return null;
  return {
    ...tx,
    id: normalizeId(tx.id) || tx.id,
    userId: normalizeId(tx.userId) || tx.userId,
    propertyId: normalizeId(tx.propertyId) || tx.propertyId
  };
}

// Utility: get element
const $ = (sel) => document.querySelector(sel);

function handleApiError(message, error){
  console.error(message, error);
  alert(message);
}

async function fetchAdvertisement(forceRefresh = false){
  if(advertisementCache && !forceRefresh) return advertisementCache;
  try{
    const { data } = await api.get('/advertisement');
    const list = Array.isArray(data) ? data : [];
    advertisementCache = list.map(p => normalizeAdv(p) || p);
    return advertisementCache;
  } catch (error) {
    handleApiError('Не удалось загрузить объявления. Убедитесь, что JSON-server запущен.', error);
    return [];
  }
}

async function getAdvertisementById(id){
  const idStr = normalizeId(id);
  if(!idStr) return null;
  if(advertisementCache){
    const cached = advertisementCache.find(p=>p.id === idStr);
    if(cached) return cached;
  }
  try{
    const { data } = await api.get(`/advertisement/${idStr}`);
    if(data){
      const normalized = normalizeAdv(data) || data;
      advertisementCache = advertisementCache
        ? [...advertisementCache.filter(p=>p.id !== idStr), normalized]
        : [normalized];
      return normalized;
    }
    return data;
  } catch (error) {
    handleApiError('Не удалось загрузить объявление. Проверьте mock-server.', error);
    return null;
  }
}

async function deleteAdvertisement(id){
  const idStr = normalizeId(id);
  if(!idStr) return false;
  try{
    await api.delete(`/advertisement/${idStr}`);
    removeAdvertisementFromCache(idStr);
    return true;
  } catch (error) {
    handleApiError('Не удалось удалить объявление. Проверьте JSON-server.', error);
    return false;
  }
}

async function queryUserByCredentials(email, password){
  const params = { email, password };
  try{
    const { data } = await api.get('/users', { params });
    const user = Array.isArray(data) ? data[0] || null : null;
    return user ? withStringId(user) || user : null;
  } catch (error) {
    handleApiError('Ошибка входа. Проверьте подключение к JSON-server.', error);
    return null;
  }
}

async function findUserByEmail(email){
  try{
    const { data } = await api.get('/users', { params: { email } });
    const user = Array.isArray(data) ? data[0] || null : null;
    return user ? withStringId(user) || user : null;
  } catch (error) {
    handleApiError('Не удалось проверить наличие пользователя.', error);
    return null;
  }
}

async function createUser(payload){
  try{
    const { data } = await api.post('/users', payload);
    return withStringId(data) || data;
  } catch (error) {
    handleApiError('Не удалось создать пользователя. Проверьте JSON-server.', error);
    return null;
  }
}

async function updateUser(id, payload){
  const idStr = normalizeId(id);
  if(!idStr) return null;
  try{
    const { data } = await api.patch(`/users/${idStr}`, payload);
    return withStringId(data) || data;
  } catch (error) {
    handleApiError('Не удалось обновить профиль. Проверьте JSON-server.', error);
    return null;
  }
}

async function getUserById(id){
  const idStr = normalizeId(id);
  if(!idStr) return null;
  try{
    const { data } = await api.get(`/users/${idStr}`);
    return withStringId(data) || data;
  } catch (error) {
    if(error?.response?.status === 404){
      try {
        const { data: fallback } = await api.get('/users', { params: { id: idStr } });
        if(Array.isArray(fallback) && fallback.length){
          return withStringId(fallback[0]) || fallback[0];
        }
        alert(`Пользователь с ID ${idStr} не найден на сервере. Пожалуйста, войдите заново.`);
      } catch(fallbackErr){
        handleApiError('Fallback-запрос пользователя не удался. Проверьте JSON-server.', fallbackErr);
      }
    } else {
      handleApiError('Не удалось получить пользователя. Проверьте JSON-server.', error);
    }
    return null;
  }
}

async function fetchConversations(userId, forceRefresh = false){
  const idStr = normalizeId(userId);
  if(!idStr) return [];
  if(!forceRefresh && conversationsCache.has(idStr)){
    return conversationsCache.get(idStr);
  }
  try{
    const { data } = await api.get('/conversations', { params: { userId: idStr } });
    const list = Array.isArray(data) ? data : [];
    const normalized = list.map(c => normalizeConversation(c) || c);
    conversationsCache.set(idStr, normalized);
    return normalized;
  } catch (error) {
    handleApiError('Не удалось загрузить список сообщений.', error);
    return [];
  }
}

async function fetchTransactions(userId, forceRefresh = false){
  const idStr = normalizeId(userId);
  if(!idStr) return [];
  if(!forceRefresh && transactionsCache.has(idStr)){
    return transactionsCache.get(idStr);
  }
  try{
    const { data } = await api.get('/transactions', { params: { userId: idStr } });
    const list = Array.isArray(data) ? data : [];
    const normalized = list.map(t => normalizeTransaction(t) || t);
    transactionsCache.set(idStr, normalized);
    return normalized;
  } catch (error) {
    handleApiError('Не удалось загрузить историю платежей.', error);
    return [];
  }
}

function statusText(s){
  if(!s) return '';
  if(s === 'available') return 'Доступно';
  if(s === 'rented') return 'Арендовано';
  return s;
}

function getCurrentUser(){
  const raw = localStorage.getItem('rental_currentUser');
  if(!raw) return null;
  try{
    const parsed = JSON.parse(raw);
    const normalized = withStringId(parsed);
    if(normalized) return normalized;
  } catch(err){
    console.warn('Не удалось распарсить сохранённого пользователя', err);
  }
  localStorage.removeItem('rental_currentUser');
  return null;
}

function setCurrentUser(user){
  const normalized = withStringId(user);
  if(!normalized) return;
  localStorage.setItem('rental_currentUser', JSON.stringify(normalized));
}

function logout(){
  localStorage.removeItem('rental_currentUser');
  window.location = 'index.html';
}

// Render navbar user state
function renderNavbar(){
  const user = getCurrentUser();
  const navUser = document.getElementById('nav-user');
  if(!navUser) return;
  if(user){
    navUser.innerHTML = `
      <span class="me-3">${user.name}</span>
      <a href="profile.html" class="btn btn-sm btn-outline-primary me-2">Профиль</a>
      <a href="dashboard.html" class="btn btn-sm btn-outline-primary me-2">Объявления</a>
      <button id="logoutBtn" class="btn btn-sm btn-danger">Выйти</button>
    `;
    document.getElementById('logoutBtn').addEventListener('click', logout);
  } else {
    navUser.innerHTML = `<a href="login.html" class="btn btn-sm btn-primary">Войти</a>`;
  }
}

// Login handler
function handleLoginForm(){
  const form = document.getElementById('loginForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const pwd = form.password.value.trim();
    if(!email || !pwd){ alert('Пожалуйста, заполните все поля'); return; }
    const found = await queryUserByCredentials(email, pwd);
    if(found){
      setCurrentUser(found);
      window.location = 'dashboard.html';
    } else {
      alert('Неверные данные или сервер недоступен.');
    }
  });
}

// Registration handler
function handleRegisterForm(){
  const form = document.getElementById('registerForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const p1 = form.password.value.trim();
    const p2 = form.confirm.value.trim();
    if(!name || !email || !p1 || !p2){ alert('Пожалуйста, заполните все поля'); return;}
    if(p1 !== p2){ alert('Пароли не совпадают'); return; }
    const existing = await findUserByEmail(email);
    if(existing){ alert('Пользователь с такой эл. почтой уже существует'); return; }
    const username = email.split('@')[0];
    const payload = { name, email, password: p1, username };
    const created = await createUser(payload);
    if(!created){ return; }
    setCurrentUser(created);
    window.location = 'dashboard.html';
  });
}

// Render adv cards into container (used on index)
function renderAdvertisements(container, advertisements){
  if(!container) return;
  container.innerHTML = '';
  if(advertisements.length === 0){
    container.innerHTML = `<div class="text-muted p-4 bg-white card-custom">Объявления не найдены.</div>`;
    return;
  }
  advertisements.forEach(prop=>{
    const cover = prop.images && prop.images.length ? prop.images[0] : 'https://via.placeholder.com/600x400?text=No+image';
    const propId = normalizeId(prop.id) || prop.id;
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card card-custom h-100">
        <img src="${cover}" class="property-img w-100" alt="${prop.title}">
        <div class="property-card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h6 class="mb-1">${prop.title}</h6>
              <div class="property-meta">${prop.location} • ${prop.type} • ${prop.beds} спал. • ${prop.baths} ван.</div>
            </div>
            <div class="text-end">
              <div class="h6 mb-1">₽${prop.price}/мес</div>
              <div class="badge-ghost">${statusText(prop.status)}</div>
            </div>
          </div>
          <p class="mt-2 mb-2 text-muted small">${(prop.description||'').slice(0,90)}...</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${propId}">Посмотреть</button>
            <button class="btn btn-sm btn-primary book-btn" data-id="${propId}" ${prop.status !== 'available' ? 'disabled' : ''}>Забронировать</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // attach listeners
  container.querySelectorAll('.view-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = normalizeId(btn.getAttribute('data-id'));
      if(!id) return;
      window.location = `property.html?id=${id}`;
    });
  });
  container.querySelectorAll('.book-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = normalizeId(btn.getAttribute('data-id'));
      if(!id) return;
      const modalEl = document.getElementById('bookModal');
      if(!modalEl) return;
      const bookModal = new bootstrap.Modal(modalEl);
      document.getElementById('bookModalLabel').textContent = `Бронирование объявления #${id}`;
      document.getElementById('bookPropertyId').value = id;
      bookModal.show();
    });
  });
}

// Search + filter logic (index)
async function initSearchPage(){
  const container = document.getElementById('propertiesContainer');
  const searchInput = document.getElementById('searchInput');
  const typeSelect = document.getElementById('filterType');
  const priceRange = document.getElementById('filterPrice');
  const locationSelect = document.getElementById('filterLocation');
  const priceLabel = document.getElementById('priceLabel');

  let allProperties = await fetchAdvertisement();

  // Populate filter options
  const types = Array.from(new Set(allProperties.map(p=>p.type).filter(Boolean)));
  types.forEach(t => typeSelect.appendChild(new Option(t,t)));
  const locs = Array.from(new Set(allProperties.map(p=>p.location).filter(Boolean)));
  locs.forEach(l => locationSelect.appendChild(new Option(l,l)));

  const maxPriceValue = allProperties.reduce((acc,p)=>Math.max(acc, Number(p.price)||0), 0) || 5000;
  priceRange.min = 0;
  priceRange.max = Math.max(maxPriceValue, 1000);
  if(!priceRange.value){
    priceRange.value = Math.min(3000, priceRange.max);
  } else if(Number(priceRange.value) > priceRange.max){
    priceRange.value = priceRange.max;
  }
  if(priceLabel){ priceLabel.textContent = `₽${priceRange.value}`; }

  function applyFilters(){
    const q = searchInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    const loc = locationSelect.value;
    const maxPrice = parseInt(priceRange.value,10) || 10000;
    const filtered = allProperties.filter(p=>{
      if(type && p.type !== type) return false;
      if(loc && p.location !== loc) return false;
      if(p.price > maxPrice) return false;
      if(q){
        const hay = `${p.title} ${p.description} ${p.location}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
    renderAdvertisements(container, filtered);
    document.getElementById('resultCount').textContent = filtered.length;
  }

  // events
  [searchInput, typeSelect, priceRange, locationSelect].forEach(el=>{
    el.addEventListener('input', applyFilters);
  });

  applyFilters();
}

// Booking form demo
function initBooking(){
  const form = document.getElementById('bookForm');
  if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const currentUser = getCurrentUser();
    if(!currentUser){ alert('Пожалуйста, войдите, чтобы забронировать.'); window.location='login.html'; return; }
    const id = normalizeId(form.propertyId?.value);
    if(!id){ alert('Некорректное объявление для бронирования.'); return; }
    const prop = await getPropertyById(id);
    if(!prop) return alert('Объявление не найдено');
    alert(`Запрос на бронирование "${prop.title}" отправлен. Владелец свяжется с вами.`);
    const bmodal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
    if(bmodal) bmodal.hide();
  });
}

// Dashboard rendering
async function initDashboard(){
  const user = getCurrentUser();
  if(!user){ window.location = 'login.html'; return; }
  const userId = normalizeId(user.id);
  if(!userId){ logout(); return; }
  const welcomeEl = document.getElementById('dashWelcome');
  if(welcomeEl) welcomeEl.textContent = `Добро пожаловать, ${user.name}`;
  const ownedCt = document.getElementById('ownedList');
  const rentedCt = document.getElementById('rentedList');
  let props = await fetchAdvertisement();

  const renderLists = () => {
    if(ownedCt){
      ownedCt.innerHTML = '';
      props
        .filter(p=>normalizeId(p.ownerId) === userId)
        .forEach(p=>ownedCt.appendChild(makeItem(p, true)));
    }
    if(rentedCt){
      rentedCt.innerHTML = '';
      props
        .filter(p=>normalizeId(p.tenantId) === userId)
        .forEach(p=>rentedCt.appendChild(makeItem(p, false)));
    }
  };

  async function handleDelete(AdvId){
    const confirmed = confirm('Удалить объявление? Действие нельзя отменить.');
    if(!confirmed) return;
    const ok = await deleteAdvertisement(AdvId);
    if(ok){
      props = props.filter(p=>p.id !== AdvId);
      renderLists();
      alert('Объявление удалено.');
    }
  }

  function makeItem(p, isOwner){
    const propId = normalizeId(p.id) || p.id;
    const cover = Array.isArray(p.images) && p.images.length ? p.images[0] : 'https://via.placeholder.com/100x70?text=No+image';
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <img src="${cover}" style="width:100px;height:70px;object-fit:cover;border-radius:8px;">
      <div class="flex-fill">
          <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${p.title}</strong>
            <div class="text-muted small">${p.location} • ${p.type}</div>
          </div>
          <div class="text-end">
            <div class="fw-semibold">₽${p.price}/мес</div>
            <small class="text-muted">${statusText(p.status)}</small>
          </div>
        </div>
        <div class="mt-2">
          <a href="property.html?id=${propId}" class="btn btn-sm btn-outline-primary me-2">Просмотр</a>
          ${isOwner ? `<button class="btn btn-sm btn-danger remove-btn" data-id="${propId}">Удалить</button>` : ''}
        </div>
      </div>
    `;
    if(isOwner){
      const btn = div.querySelector('.remove-btn');
      if(btn){
        btn.addEventListener('click', ()=>{
          handleDelete(propId);
        });
      }
    }
    return div;
  }

  renderLists();
}

// Property detail page init
async function initPropertyPage(){
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');
  const propId = normalizeId(idParam);
  if(!propId){ document.body.innerHTML = '<div class="container py-5"><h3>Объявление не найдено.</h3></div>'; return; }
  const prop = await getPropertyById(propId);
  if(!prop){ document.body.innerHTML = '<div class="container py-5"><h3>Объявление не найдено.</h3></div>'; return; }
  document.getElementById('propTitle').textContent = prop.title;
  document.getElementById('propLocation').textContent = `${prop.location} • ${prop.type}`;
  document.getElementById('propPrice').textContent = `₽${prop.price}/мес`;
  document.getElementById('propDesc').textContent = prop.description;
  document.getElementById('propTerms').textContent = prop.rentTerms;
  document.getElementById('propMeta').textContent = `${prop.beds} спал. • ${prop.baths} ван.`;

  // carousel images
  const carouselInner = document.getElementById('carouselInner');
  carouselInner.innerHTML = '';
  const gallery = Array.isArray(prop.images) && prop.images.length ? prop.images : ['https://via.placeholder.com/800x420?text=No+image'];
  gallery.forEach((img, idx)=>{
    const item = document.createElement('div');
    item.className = 'carousel-item' + (idx===0 ? ' active': '');
    item.innerHTML = `<img src="${img}" class="d-block w-100" style="height:420px;object-fit:cover;">`;
    carouselInner.appendChild(item);
  });

  // book button
  document.getElementById('bookPropBtn').addEventListener('click', ()=>{
    const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
    document.getElementById('bookModalLabel').textContent = `Бронирование: ${prop.title}`;
    document.getElementById('bookPropertyId').value = prop.id;
    bookModal.show();
  });

  // contact owner fetch (demo)
  document.getElementById('contactBtn').addEventListener('click', ()=>{
    const user = getCurrentUser();
    if(!user){ alert('Пожалуйста, войдите, чтобы связаться с владельцем'); window.location='login.html'; return; }
    const msg = prompt('Напишите сообщение владельцу:');
    if(msg) alert('Сообщение отправлено (демо).');
  });
}

// Messages page
async function initMessages(){
  const user = getCurrentUser();
  if(!user){ window.location='login.html'; return; }
  const convCt = document.getElementById('conversations');
  const txCt = document.getElementById('transactions');
  if(convCt) convCt.innerHTML = '';
  if(txCt) txCt.innerHTML = '';

  const [convs, txs, props] = await Promise.all([
    fetchConversations(user.id),
    fetchTransactions(user.id),
    fetchAdvertisement()
  ]);
  const propById = new Map(props.map(p => [normalizeId(p.id) || String(p.id), p]));
  const resolveProp = (id) => propById.get(normalizeId(id) || id);

  if(convCt){
    if(convs.length === 0){
      convCt.innerHTML = '<div class="text-muted">Нет сообщений.</div>';
    } else {
      convs.forEach(c=>{
        const prop = resolveProp(c.propertyId);
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
          <div class="flex-fill">
            <div class="d-flex justify-content-between">
              <div>
                <strong>${c.with}</strong>
                <div class="text-muted small">${prop ? prop.title : 'Объявление удалено'}</div>
              </div>
              <div class="text-muted small">${c.date}</div>
            </div>
            <div class="mt-2 text-muted small">${c.lastMessage || ''}</div>
          </div>
        `;
        convCt.appendChild(div);
      });
    }
  }

  if(txCt){
    if(txs.length === 0){
      txCt.innerHTML = '<div class="text-muted">Транзакции отсутствуют.</div>';
    } else {
      txs.forEach(t=>{
        const prop = resolveProp(t.propertyId);
        const d = document.createElement('div');
        d.className = 'list-item';
        d.innerHTML = `
          <div class="flex-fill d-flex justify-content-between">
            <div>
              <strong>${prop ? prop.title : 'Объявление удалено'}</strong>
              <div class="text-muted small">${t.date}</div>
            </div>
            <div class="text-end">
              <div class="fw-semibold">₽${t.amount}</div>
              <small class="text-muted">${t.status || ''}</small>
            </div>
          </div>
        `;
        txCt.appendChild(d);
      });
    }
  }
}

// Profile page initializer
async function initProfile(){
  let user = getCurrentUser();
  if(!user){ window.location = 'login.html'; return; }
  const fresh = await getUserById(user.id);
  if(!fresh){
    localStorage.removeItem('rental_currentUser');
    window.location = 'login.html';
    return;
  }
  setCurrentUser(fresh);
  user = fresh;
  // Populate UI
  const nameEl = document.getElementById('profileName');
  const emailEl = document.getElementById('profileEmail');
  const usernameEl = document.getElementById('profileUsername');
  const locationEl = document.getElementById('profileLocation');
  const aboutEl = document.getElementById('profileAbout');
  const avatarEl = document.getElementById('profileAvatar');
  if(nameEl) nameEl.textContent = user.name || '';
  if(emailEl) emailEl.textContent = user.email || '';
  if(usernameEl) usernameEl.textContent = user.username || (user.email ? user.email.split('@')[0] : '');
  if(locationEl) locationEl.textContent = user.location || '—';
  if(aboutEl) aboutEl.textContent = user.about || '';
  if(avatarEl && user.avatar) avatarEl.src = user.avatar;

  // Edit profile modal
  const editBtn = document.getElementById('editProfileBtn');
  const modalEl = document.getElementById('profileModal');
  if(editBtn && modalEl){
    const profileModal = new bootstrap.Modal(modalEl);
    editBtn.addEventListener('click', ()=>{
      const form = document.getElementById('profileForm');
      if(!form) return;
      form.name.value = user.name || '';
      form.email.value = user.email || '';
      form.username.value = user.username || '';
      form.location.value = user.location || '';
      form.avatar.value = user.avatar || '';
      form.about.value = user.about || '';
      profileModal.show();
    });

    const form = document.getElementById('profileForm');
    if(!form) return;
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const username = form.username.value.trim();
      const location = form.location.value.trim();
      const avatar = form.avatar.value.trim();
      const about = form.about.value.trim();
      if(!name || !email){ alert('Имя и эл. почта обязательны'); return; }
      const cur = getCurrentUser();
      const curId = normalizeId(cur?.id);
      if(!curId){ logout(); return; }
      const updated = await updateUser(curId, { name, email, username, location, avatar, about });
      if(!updated) return;
      setCurrentUser(updated);
      // Update UI
      if(nameEl) nameEl.textContent = updated.name;
      if(emailEl) emailEl.textContent = updated.email;
      if(usernameEl) usernameEl.textContent = updated.username || updated.email.split('@')[0];
      if(locationEl) locationEl.textContent = updated.location || '—';
      if(aboutEl) aboutEl.textContent = updated.about || '';
      if(avatarEl && updated.avatar) avatarEl.src = updated.avatar;
      profileModal.hide();
    });
  }
}

// Initialize common things on each page
document.addEventListener('DOMContentLoaded', async ()=>{
  renderNavbar();
  handleLoginForm();
  handleRegisterForm();
  initBooking();

  // page-specific initializers
  const bodyPage = document.body.getAttribute('data-page');
  if(bodyPage === 'search') await initSearchPage();
  if(bodyPage === 'dashboard') await initDashboard();
  if(bodyPage === 'profile') await initProfile();
  if(bodyPage === 'property') await initPropertyPage();
  if(bodyPage === 'messages') await initMessages();
});
