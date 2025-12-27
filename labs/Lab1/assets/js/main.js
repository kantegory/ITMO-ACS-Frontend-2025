// Shared JS: sample data, auth, filtering, rendering, modals

// Sample property data
const PROPERTIES = [
  {
    id: 1,
    title: "Современный дом на окраине Саратова",
    type: "Аппартаменты",
    price: 1200,
    location: "Саратовская область",
    beds: 2,
    baths: 1,
    ownerId: 101,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=60&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=60&auto=format&fit=crop"
    ],
    description: "Светлые современные апартаменты с быстрым доступом к магазинам, остановкам и кафе. Полностью меблированы: гостиная, кухня и две спальни.",
    rentTerms: "Минимальный срок аренды — 6 месяцев. Залог: стоимость одного месяца."
  },
{
  id: 2,
  title: "Уютная студия в Мурино",
  type: "Студия",
  price: 850,
  location: "Мурино",
  beds: 0,
  baths: 1,
  ownerId: 102,
  status: "rented",
  tenantId: 201,
  images: [
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=60&auto=format&fit=crop"
  ],
  description: "Тихая и светлая студия, расположенная рядом с зелёной зоной. Отлично подходит для тех, кто любит бегать или гулять в парке.",
  rentTerms: "Помесячная аренда. Залог — половина месячной стоимости."
}
];

// Simple user store
const USERS = [
  { id: 101, name: "admin", email: "admin@mail.ru", password: "admin" },
];

// Utility: get element
const $ = (sel) => document.querySelector(sel);

// Human-readable status
function statusText(s){
  if(!s) return '';
  if(s === 'available') return 'Доступно';
  if(s === 'rented') return 'Арендовано';
  return s;
}

// Auth helpers (localStorage-based for demo)
function getCurrentUser(){
  const raw = localStorage.getItem('rental_currentUser');
  return raw ? JSON.parse(raw) : null;
}
function setCurrentUser(user){
  localStorage.setItem('rental_currentUser', JSON.stringify(user));
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
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const pwd = form.password.value.trim();
    if(!email || !pwd){ alert('Пожалуйста, заполните все поля'); return; }
    const found = USERS.find(u => u.email === email && u.password === pwd);
    if(found){
      setCurrentUser({id: found.id, name: found.name, email: found.email});
      window.location = 'dashboard.html';
    } else {
      alert('Неверные данные (демо).');
    }
  });
}

// Registration handler
function handleRegisterForm(){
  const form = document.getElementById('registerForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const p1 = form.password.value.trim();
    const p2 = form.confirm.value.trim();
    if(!name || !email || !p1 || !p2){ alert('Пожалуйста, заполните все поля'); return;}
    if(p1 !== p2){ alert('Пароли не совпадают'); return; }
    // simulate user creation
    const newId = Date.now();
    USERS.push({id:newId,name,email,password:p1});
    setCurrentUser({id:newId,name,email});
    window.location = 'dashboard.html';
  });
}

// Render property cards into container (used on index)
function renderProperties(container, properties){
  if(!container) return;
  container.innerHTML = '';
  if(properties.length === 0){
    container.innerHTML = `<div class="text-muted p-4 bg-white card-custom">Объявления не найдены.</div>`;
    return;
  }
  properties.forEach(prop=>{
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card card-custom h-100">
        <img src="${prop.images[0]}" class="property-img w-100" alt="${prop.title}">
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
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${prop.id}">Посмотреть</button>
            <button class="btn btn-sm btn-primary book-btn" data-id="${prop.id}" ${prop.status !== 'available' ? 'disabled' : ''}>Забронировать</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  // attach listeners
  container.querySelectorAll('.view-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = btn.getAttribute('data-id');
      window.location = `property.html?id=${id}`;
    });
  });
  container.querySelectorAll('.book-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = btn.getAttribute('data-id');
      // open booking modal
      const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
      document.getElementById('bookModalLabel').textContent = `Бронирование объявления #${id}`;
      document.getElementById('bookPropertyId').value = id;
      bookModal.show();
    });
  });
}

// Search + filter logic (index)
function initSearchPage(){
  const container = document.getElementById('propertiesContainer');
  const searchInput = document.getElementById('searchInput');
  const typeSelect = document.getElementById('filterType');
  const priceRange = document.getElementById('filterPrice');
  const locationSelect = document.getElementById('filterLocation');

  // Populate filter options
  const types = Array.from(new Set(PROPERTIES.map(p=>p.type)));
  types.forEach(t => typeSelect.appendChild(new Option(t,t)));
  const locs = Array.from(new Set(PROPERTIES.map(p=>p.location)));
  locs.forEach(l => locationSelect.appendChild(new Option(l,l)));

  function applyFilters(){
    const q = searchInput.value.trim().toLowerCase();
    const type = typeSelect.value;
    const loc = locationSelect.value;
    const maxPrice = parseInt(priceRange.value,10) || 10000;
    const filtered = PROPERTIES.filter(p=>{
      if(type && p.type !== type) return false;
      if(loc && p.location !== loc) return false;
      if(p.price > maxPrice) return false;
      if(q){
        const hay = `${p.title} ${p.description} ${p.location}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
    renderProperties(container, filtered);
    document.getElementById('resultCount').textContent = filtered.length;
  }

  // events
  [searchInput, typeSelect, priceRange, locationSelect].forEach(el=>{
    el.addEventListener('input', applyFilters);
  });

  // initial
  priceRange.min = 0;
  priceRange.max = 5000;
  priceRange.value = 3000;
  applyFilters();
}

// Booking form demo
function initBooking(){
  const form = document.getElementById('bookForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const uid = getCurrentUser();
    if(!uid){ alert('Пожалуйста, войдите, чтобы забронировать.'); window.location='login.html'; return; }
    const id = parseInt(form.propertyId.value,10);
    // For demo: just show confirmation
    const prop = PROPERTIES.find(p=>p.id===id);
    if(!prop) return alert('Объявление не найдено');
    alert(`Запрос на бронирование "${prop.title}" отправлен. Владелец свяжется с вами.`);
    const bmodal = bootstrap.Modal.getInstance(document.getElementById('bookModal'));
    bmodal.hide();
  });
}

// Dashboard rendering
function initDashboard(){
  const user = getCurrentUser();
  if(!user){ window.location = 'login.html'; return; }
  document.getElementById('dashWelcome').textContent = `Добро пожаловать, ${user.name}`;
  const ownedCt = document.getElementById('ownedList');
  const rentedCt = document.getElementById('rentedList');
  const owned = PROPERTIES.filter(p=>p.ownerId === user.id);
  const rented = PROPERTIES.filter(p=>p.tenantId === user.id || p.status === 'rented' && p.tenantId === user.id);
  // For demo, treat any 'rented' with tenantId same as user
  function makeItem(p){
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <img src="${p.images[0]}" style="width:100px;height:70px;object-fit:cover;border-radius:8px;">
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
          <a href="property.html?id=${p.id}" class="btn btn-sm btn-outline-primary me-2">Просмотр</a>
          <button class="btn btn-sm btn-danger remove-btn" data-id="${p.id}">Удалить</button>
        </div>
      </div>
    `;
    // remove demo
    div.querySelectorAll('.remove-btn').forEach(b=>{
      b.addEventListener('click', ()=>{
        alert('Действие удаления (демо).');
      });
    });
    return div;
  }
  ownedCt.innerHTML = '';
  rentedCt.innerHTML = '';
  owned.forEach(p=>ownedCt.appendChild(makeItem(p)));
  rented.forEach(p=>rentedCt.appendChild(makeItem(p)));
}

// Property detail page init
function initPropertyPage(){
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'),10);
  const prop = PROPERTIES.find(p=>p.id===id);
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
  prop.images.forEach((img, idx)=>{
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

// Messages page demo
function initMessages(){
  const user = getCurrentUser();
  if(!user){ window.location='login.html'; return; }
  const convCt = document.getElementById('conversations');
  convCt.innerHTML = '';
  const sampleConvs = [
    {id:1,with:'Владелец A', last:'Жду заселения.', date:'2025-10-18', prop:'Современный дом на окраине Саратова'},
    {id:2,with:'Владелец B', last:'Залог получен.', date:'2025-08-10', prop:'Уютная студия в Мурино'}
  ];
  sampleConvs.forEach(c=>{
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <div class="flex-fill">
        <div class="d-flex justify-content-between">
          <div>
            <strong>${c.with}</strong>
            <div class="text-muted small">${c.prop}</div>
          </div>
          <div class="text-muted small">${c.date}</div>
        </div>
        <div class="mt-2 text-muted small">${c.last}</div>
      </div>
    `;
    convCt.appendChild(div);
  });

  // transactions
  const txCt = document.getElementById('transactions');
  txCt.innerHTML = '';
  const sampleTx = [
    {id:1,prop:'Уютная студия в Мурино',amount:850,date:'2025-09-01',status:'Завершено'},
    {id:2,prop:'Современный дом на окраине Саратова',amount:1200,date:'2025-06-01',status:'Завершено'}
  ];
  sampleTx.forEach(t=>{
    const d = document.createElement('div');
    d.className = 'list-item';
    d.innerHTML = `
      <div class="flex-fill d-flex justify-content-between">
        <div>
          <strong>${t.prop}</strong>
          <div class="text-muted small">${t.date}</div>
        </div>
        <div class="text-end">
          <div class="fw-semibold">₽${t.amount}</div>
          <small class="text-muted">${t.status}</small>
        </div>
      </div>
    `;
    txCt.appendChild(d);
  });
}

// Profile page initializer
function initProfile(){
  const user = getCurrentUser();
  if(!user){ window.location = 'login.html'; return; }
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
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const username = form.username.value.trim();
      const location = form.location.value.trim();
      const avatar = form.avatar.value.trim();
      const about = form.about.value.trim();
      if(!name || !email){ alert('Имя и эл. почта обязательны'); return; }
      // update demo current user
      const cur = getCurrentUser();
      cur.name = name; cur.email = email; cur.username = username; cur.location = location; cur.avatar = avatar; cur.about = about;
      setCurrentUser(cur);
      // update USERS demo store if present
      const i = USERS.findIndex(u=>u.id === cur.id);
      if(i !== -1){
        USERS[i] = { ...USERS[i], name, email, username, location, avatar, about };
      }
      // Update UI
      if(nameEl) nameEl.textContent = name;
      if(emailEl) emailEl.textContent = email;
      if(usernameEl) usernameEl.textContent = username || email.split('@')[0];
      if(locationEl) locationEl.textContent = location || '—';
      if(aboutEl) aboutEl.textContent = about;
      if(avatarEl && avatar) avatarEl.src = avatar;
      profileModal.hide();
    });
  }
}

// Initialize common things on each page
document.addEventListener('DOMContentLoaded', ()=>{
  renderNavbar();
  handleLoginForm();
  handleRegisterForm();
  initBooking();

  // page-specific initializers
  const bodyPage = document.body.getAttribute('data-page');
  if(bodyPage === 'search') initSearchPage();
  if(bodyPage === 'dashboard') initDashboard();
  if(bodyPage === 'profile') initProfile();
  if(bodyPage === 'property') initPropertyPage();
  if(bodyPage === 'messages') initMessages();
});