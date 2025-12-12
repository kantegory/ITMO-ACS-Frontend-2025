(() => {
  const API_BASE = localStorage.getItem('jobApiBase') || 'http://localhost:3001';
  const api = axios.create({ baseURL: API_BASE });

  const INDUSTRIES = [
    { value: 'technology', label: 'Технологии' },
    { value: 'finance', label: 'Финансы' },
    { value: 'healthcare', label: 'Здравоохранение' },
    { value: 'education', label: 'Образование' },
    { value: 'manufacturing', label: 'Производство' },
    { value: 'other', label: 'Другое' },
  ];
  const INDUSTRY_LABELS = INDUSTRIES.reduce((acc, item) => ({ ...acc, [item.value]: item.label }), {});

  const FALLBACK_COMPANIES = [
    { id: 1, name: 'DataPulse', location: 'Москва' },
    { id: 2, name: 'NovaTech', location: 'Санкт-Петербург' },
    { id: 3, name: 'Cloudy', location: 'Удалённо' },
    { id: 4, name: 'Metric Labs', location: 'Москва' },
    { id: 5, name: 'Shiftly', location: 'Казань' },
    { id: 6, name: 'FinRise', location: 'Екатеринбург' },
    { id: 7, name: 'JobBridge', location: 'Новосибирск' },
  ];

  const FALLBACK_VACANCIES = [
    {
      id: 1,
      title: 'Senior React разработчик для аналитической платформы',
      company: { id: 1, name: 'DataPulse', location: 'Москва' },
      industry: 'technology',
      salaryMin: 180000,
      salaryMax: 240000,
      experienceRequired: 4,
      format: 'hybrid',
      location: 'Москва',
      description: 'Строим новый дашборд для продуктовой аналитики. Работа с микрофронтендами, дизайн-системой и графиками.',
      requirements: ['React 18, TypeScript', 'Опыт построения дизайн-системы', 'CI/CD, code review'],
      tags: ['React', 'TypeScript', 'Microfrontends'],
    },
    {
      id: 2,
      title: 'Frontend стажёр / junior',
      company: { id: 2, name: 'NovaTech', location: 'Санкт-Петербург' },
      industry: 'technology',
      salaryMin: 60000,
      salaryMax: 90000,
      experienceRequired: 0,
      format: 'office',
      location: 'Санкт-Петербург',
      description: 'Поможем прокачаться в верстке и JS. Ставим задачи с наставником и ревью.',
      requirements: ['HTML, CSS, базовый JS', 'Понимание Git', 'Желание учиться'],
      tags: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 3,
      title: 'Product designer (UX/UI)',
      company: { id: 3, name: 'Cloudy', location: 'Удалённо' },
      industry: 'other',
      salaryMin: 160000,
      salaryMax: 200000,
      experienceRequired: 4,
      format: 'remote',
      location: 'Удалённо',
      description: 'Проектируем сложные сценарии и интерфейсы. Много работы с текстами и состояниями.',
      requirements: ['Figma, прототипы', 'Работа с UI-китом', 'Исследования'],
      tags: ['UX', 'UI', 'Figma'],
    },
    {
      id: 4,
      title: 'Data engineer (ETL/DWH)',
      company: { id: 4, name: 'Metric Labs', location: 'Москва' },
      industry: 'finance',
      salaryMin: 190000,
      salaryMax: 250000,
      experienceRequired: 4,
      format: 'hybrid',
      location: 'Москва',
      description: 'Поднимаем пайплайны, наводим порядок в данных, строим витрины.',
      requirements: ['SQL, Python, Airflow', 'Kafka/очереди', 'Опыт с облаками'],
      tags: ['Data', 'Python', 'Airflow'],
    },
  ];

  // Храним избранное как строки, чтобы не путаться с числами/строками id.
  const favorites = new Set((JSON.parse(localStorage.getItem('jobFavorites') || '[]') || []).map(String));
  const state = {
    token: localStorage.getItem('accessToken') || '',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    companies: [],
    vacancies: [],
    employer: null,
    profile: null,
  };

  if (state.token) api.defaults.headers.common.Authorization = `Bearer ${state.token}`;

  const filtersForm = document.getElementById('filtersForm');
  const industrySelect = document.getElementById('industrySelect');
  const salaryInput = document.getElementById('salaryInput');
  const experienceSelect = document.getElementById('experienceSelect');
  const formatSelect = document.getElementById('formatSelect');
  const keywordInput = document.getElementById('keywordInput');
  const activeFilters = document.getElementById('activeFilters');
  const vacanciesList = document.getElementById('vacanciesList');
  const vacancyDetail = document.getElementById('vacancyDetail');
  const favoritesList = document.getElementById('favoritesList');
  const favoritesCounter = document.getElementById('favoritesCounter');
  const employerTable = document.getElementById('employerTable');
  const employerStatus = document.getElementById('employerStatus');
  const quickSearchForm = document.getElementById('quickSearchForm');
  const quickSearchInput = document.getElementById('quickSearch');
  const quickCityInput = document.getElementById('quickCity');
  const profileSaveBtn = document.getElementById('profileSaveBtn');
  const profilePosition = document.getElementById('profilePosition');
  const profileCity = document.getElementById('profileCity');
  const profileAbout = document.getElementById('profileAbout');
  const profileSkills = document.getElementById('profileSkills');
  const createVacancyBtn = document.getElementById('createVacancyBtn');
  const vacancyForm = document.getElementById('vacancyForm');
  const vacancyModal = new bootstrap.Modal(document.getElementById('vacancyModal'));
  const vacancyModalTitle = document.getElementById('vacancyModalTitle');
  const vacancyIdInput = document.getElementById('vacancyIdInput');
  const vacancyTitleInput = document.getElementById('vacancyTitleInput');
  const vacancyIndustryInput = document.getElementById('vacancyIndustryInput');
  const vacancyExperienceInput = document.getElementById('vacancyExperienceInput');
  const vacancySalaryFromInput = document.getElementById('vacancySalaryFromInput');
  const vacancySalaryToInput = document.getElementById('vacancySalaryToInput');
  const vacancyDescriptionInput = document.getElementById('vacancyDescriptionInput');
  const vacancyRequirementsInput = document.getElementById('vacancyRequirementsInput');
  const employerForm = document.getElementById('employerForm');
  const employerCompanySelect = document.getElementById('employerCompanySelect');
  const employerPhoneInput = document.getElementById('employerPhoneInput');
  const employerModal = new bootstrap.Modal(document.getElementById('employerModal'));
  const resumeTitleEl = document.getElementById('resumeTitle');
  const resumeMetaEl = document.getElementById('resumeMeta');
  const resumeSkillsEl = document.getElementById('resumeSkills');
  const resumeAboutEl = document.getElementById('resumeAbout');

  const selectors = {
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    profileExportBtn: document.getElementById('profileExportBtn'),
    resumeRefreshBtn: document.getElementById('resumeRefreshBtn'),
  };

  const toExperienceBucket = (value) => {
    const num = Number(value) || 0;
    if (num <= 0) return 'no';
    if (num <= 3) return '1-3';
    if (num <= 6) return '3-6';
    return '6+';
  };
  const experienceLabel = (bucket) => ({ no: 'Нет опыта', '1-3': '1–3 года', '3-6': '3–6 лет', '6+': '6+ лет' }[bucket] || 'Любой опыт');
  const formatLabel = (f) => ({ hybrid: 'Гибрид', remote: 'Удалённо', office: 'Офис' }[f] || 'Не указано');

  function normalizeVacancy(v) {
    const company = v.company || FALLBACK_COMPANIES.find((c) => String(c.id) === String(v.companyId)) || { name: 'Без компании', location: '—' };
    const requirements = Array.isArray(v.requirements)
      ? v.requirements
      : typeof v.requirements === 'string'
        ? v.requirements.split(/\n|;/).map((s) => s.trim()).filter(Boolean)
        : [];
    return {
      id: v.id,
      title: v.title,
      company: company.name,
      companyId: company.id,
      industry: v.industry || 'other',
      industryLabel: INDUSTRY_LABELS[v.industry] || v.industry || 'other',
      salaryFrom: v.salaryMin ?? 0,
      salaryTo: v.salaryMax ?? 0,
      experienceBucket: toExperienceBucket(v.experienceRequired),
      format: v.format || 'office',
      location: v.location || company.location || '—',
      description: v.description || '',
      requirements,
      tags: v.tags || requirements.slice(0, 3),
    };
  }

  function setAuth(token, user) {
    state.token = token || '';
    state.user = user || null;
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      employerStatus.textContent = 'Загружаем профиль работодателя…';
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      employerStatus.textContent = 'Требуется авторизация';
    }
  }

  const saveFavorites = () => localStorage.setItem('jobFavorites', JSON.stringify([...favorites]));
  const saveFilters = (f) => localStorage.setItem('jobFilters', JSON.stringify(f));
  function loadFilters() {
    const saved = JSON.parse(localStorage.getItem('jobFilters') || '{}');
    industrySelect.value = saved.industry || '';
    salaryInput.value = saved.salary || '';
    experienceSelect.value = saved.experience || '';
    formatSelect.value = saved.format || '';
    keywordInput.value = saved.keyword || '';
  }

  function populateIndustries() {
    industrySelect.innerHTML = '<option value="">Любая</option>';
    vacancyIndustryInput.innerHTML = '<option value="" disabled selected>Выберите</option>';
    INDUSTRIES.forEach(({ value, label }) => {
      const opt = document.createElement('option');
      opt.value = value; opt.textContent = label;
      industrySelect.appendChild(opt);
      vacancyIndustryInput.appendChild(opt.cloneNode(true));
    });
  }

  function populateCompanies() {
    employerCompanySelect.innerHTML = '';
    state.companies.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id; opt.textContent = c.name;
      employerCompanySelect.appendChild(opt);
    });
  }

  const getFilters = () => ({
    industry: industrySelect.value,
    salary: Number(salaryInput.value) || 0,
    experience: experienceSelect.value,
    format: formatSelect.value,
    keyword: keywordInput.value.trim().toLowerCase(),
  });

  function matches(v, f) {
    const salaryOk = !f.salary || (v.salaryTo || v.salaryFrom) >= f.salary;
    const industryOk = !f.industry || v.industry === f.industry;
    const experienceOk = !f.experience || v.experienceBucket === f.experience;
    const formatOk = !f.format || v.format === f.format;
    const textOk = `${v.title} ${v.company} ${v.description} ${v.location}`.toLowerCase().includes(f.keyword);
    return salaryOk && industryOk && experienceOk && formatOk && (f.keyword ? textOk : true);
  }

  function renderActiveFilters(filters) {
    activeFilters.innerHTML = '';
    const items = [];
    if (filters.industry) items.push(INDUSTRY_LABELS[filters.industry] || filters.industry);
    if (filters.salary) items.push(`от ${filters.salary.toLocaleString('ru-RU')} ₽`);
    if (filters.experience) items.push(experienceLabel(filters.experience));
    if (filters.format) items.push(formatLabel(filters.format));
    if (filters.keyword) items.push(`Поиск: ${filters.keyword}`);
    if (!items.length) {
      activeFilters.innerHTML = '<span class="text-muted small">Фильтры не выбраны</span>';
      return;
    }
    items.forEach((label) => {
      const pill = document.createElement('span'); pill.className = 'pill pill--muted'; pill.textContent = label; activeFilters.appendChild(pill);
    });
  }

  function renderVacancies() {
    const filters = getFilters();
    saveFilters(filters);
    renderActiveFilters(filters);
    const filtered = state.vacancies.filter((v) => matches(v, filters));
    vacanciesList.innerHTML = '';
    if (!filtered.length) {
      vacanciesList.innerHTML = '<p class="text-muted">Ничего не нашлось, попробуйте ослабить фильтры.</p>';
      return;
    }
    filtered.forEach((vacancy) => {
      const col = document.createElement('div'); col.className = 'col-md-6';
      col.innerHTML = `
        <div class="job-card h-100 p-3 d-flex flex-column" data-id="${vacancy.id}">
          <div class="d-flex align-items-start justify-content-between gap-2 mb-2 min-w-0">
            <h3 class="job-card__title flex-grow-1">${vacancy.title}</h3>
            <span class="badge bg-light text-dark border">${vacancy.industryLabel}</span>
          </div>
          <p class="job-card__meta mb-2">${vacancy.company} • ${vacancy.location} • ${formatLabel(vacancy.format)}</p>
          <p class="job-card__description mb-3">${vacancy.description}</p>
          <div class="job-card__footer mt-auto">
            <div class="d-flex flex-wrap align-items-center gap-2">
              <span class="badge bg-primary-subtle text-primary fw-semibold">${vacancy.salaryFrom ? `от ${vacancy.salaryFrom.toLocaleString('ru-RU')} ₽` : 'По договоренности'}</span>
              ${vacancy.salaryTo ? `<span class="badge bg-success-subtle text-success fw-semibold">до ${vacancy.salaryTo.toLocaleString('ru-RU')} ₽</span>` : ''}
              <span class="badge bg-secondary-subtle text-secondary">${experienceLabel(vacancy.experienceBucket)}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm" data-action="details" data-id="${vacancy.id}">Подробнее</button>
              <button class="btn btn-warning btn-sm" data-action="favorite" data-id="${vacancy.id}">
                ${favorites.has(String(vacancy.id)) ? 'Убрать' : 'В избранное'}
              </button>
            </div>
          </div>
        </div>`;
      vacanciesList.appendChild(col);
    });
  }

  function renderVacancyDetail(v) {
    vacancyDetail.innerHTML = `
      <div class="card-body d-flex flex-column gap-2">
        <p class="text-muted mb-0">${v.company} • ${v.location} • ${formatLabel(v.format)}</p>
        <h3 class="vacancy__title">${v.title}</h3>
        <p class="vacancy__text">Зарплата: ${v.salaryFrom ? v.salaryFrom.toLocaleString('ru-RU') : '—'} — ${v.salaryTo ? v.salaryTo.toLocaleString('ru-RU') : '—'} ₽ • Опыт: ${experienceLabel(v.experienceBucket)}</p>
        <p class="vacancy__text">${v.description}</p>
        <ul class="vacancy__list">${v.requirements.map((i) => `<li>${i}</li>`).join('')}</ul>
        <div class="d-flex flex-wrap gap-2">${v.tags.map((tag) => `<span class="pill pill--muted">${tag}</span>`).join('')}</div>
      </div>`;
  }

  function renderFavorites() {
    favoritesList.innerHTML = '';
    const favs = state.vacancies.filter((v) => favorites.has(String(v.id)));
    favoritesCounter.textContent = favs.length;
    if (!favs.length) { favoritesList.innerHTML = '<li class="list-group-item text-muted">Пока пусто</li>'; return; }
    favs.forEach((v) => {
      const item = document.createElement('li'); item.className = 'list-group-item';
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="min-w-0"><p class="job-card__title mb-1">${v.title}</p><p class="job-card__meta mb-0">${v.company} • ${v.location}</p></div>
          <button class="btn btn-link btn-sm p-0" data-action="remove-favorite" data-id="${v.id}">Убрать</button>
        </div>`;
      favoritesList.appendChild(item);
    });
  }

  function renderEmployerTable() {
    if (!state.user || !state.employer) {
      employerTable.innerHTML = '<tr><td colspan="4" class="text-muted">Авторизуйтесь и создайте профиль работодателя</td></tr>';
      return;
    }
    const myVacancies = state.vacancies.filter((v) => String(v.companyId) === String(state.employer.companyId));
    if (!myVacancies.length) {
      employerTable.innerHTML = '<tr><td colspan="4" class="text-muted">У компании пока нет вакансий.</td></tr>';
      return;
    }
    employerTable.innerHTML = '';
    myVacancies.forEach((v) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-truncate" style="max-width: 260px;">${v.title}</td>
        <td><span class="badge bg-success">Активна</span></td>
        <td>${v.responses || 0}</td>
        <td class="text-end d-flex gap-2 justify-content-end flex-wrap">
          <button class="btn btn-outline-primary btn-sm minw-140" data-action="edit" data-id="${v.id}">Редактировать</button>
          <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${v.id}">Удалить</button>
        </td>`;
      employerTable.appendChild(tr);
    });
  }

  function toggleFavorite(id) {
    const key = String(id);
    if (favorites.has(key)) favorites.delete(key);
    else favorites.add(key);
    saveFavorites();
    renderFavorites();
    renderVacancies();
  }

  function handleVacancyClick(event) {
    const button = event.target.closest('button[data-action]'); if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'details') {
      const v = state.vacancies.find((x) => String(x.id) === String(id));
      if (v) { renderVacancyDetail(v); window.location.hash = '#vacancy-detail'; }
    }
    if (action === 'favorite') toggleFavorite(String(id));
  }

  const handleFavoritesClick = (e) => { const b = e.target.closest('button[data-action="remove-favorite"]'); if (b) toggleFavorite(String(b.dataset.id)); };
  const handleEmployerClick = (e) => { const b = e.target.closest('button[data-action]'); if (!b) return; const { action, id } = b.dataset; if (action === 'edit') openVacancyModal(state.vacancies.find((v) => String(v.id) === String(id))); if (action === 'delete') deleteVacancy(id); };

  async function handleAuthForm(event) {
    event.preventDefault();
    const form = event.target;
    const isRegister = form.id === 'registerForm';
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const nameInput = form.querySelector('input[type="text"]');
    const payload = {
      email: emailInput?.value,
      password: passwordInput?.value,
    };
    if (isRegister) payload.fullName = nameInput?.value;

    try {
      const url = isRegister ? '/register' : '/login';
      const { data } = await api.post(url, payload);
      setAuth(data.accessToken, data.user);
      bootstrap.Modal.getInstance(form.closest('.modal'))?.hide();
      await loadEmployerProfile();
      await loadProfile();
    } catch (err) {
      alert('Ошибка авторизации.');
    }
  }

  function handleQuickSearch(event) {
    event.preventDefault();
    const prefs = { keyword: quickSearchInput.value.trim(), city: quickCityInput.value.trim() };
    localStorage.setItem('quickSearch', JSON.stringify(prefs));
    keywordInput.value = prefs.keyword;
    renderVacancies();
    window.location.hash = '#jobs';
  }

  const loadQuickSearch = () => {
    const saved = JSON.parse(localStorage.getItem('quickSearch') || '{}');
    if (saved.keyword) quickSearchInput.value = saved.keyword;
    if (saved.city) quickCityInput.value = saved.city;
  };

  async function saveProfile() {
    if (!state.user) { alert('Нужно авторизоваться'); return; }
    const body = {
      userId: state.user.id,
      fullName: profilePosition.value || 'Мой профиль',
      position: profilePosition.value || 'Мой профиль',
      city: profileCity?.value || '',
      about: profileAbout?.value || '',
      skills: profileSkills?.value || '',
    };
    try {
      const { data } = await api.get('/profiles', { params: { userId: state.user.id } });
      if (data?.length) await api.put(`/profiles/${data[0].id}`, { ...data[0], ...body });
      else await api.post('/profiles', body);
      state.profile = body;
      updateResumeCard();
      alert('Профиль сохранён (mock API)');
    } catch (err) { alert('Не удалось сохранить профиль (mock API).'); }
  }

  const resetFilters = () => { filtersForm.reset(); saveFilters(getFilters()); renderVacancies(); };

  function clearVacancyModal() {
    [vacancyIdInput, vacancyTitleInput, vacancyIndustryInput, vacancyExperienceInput, vacancySalaryFromInput, vacancySalaryToInput].forEach((i) => i.value = '');
    vacancyDescriptionInput.value = '';
    vacancyRequirementsInput.value = '';
  }

  function openVacancyModal(vacancy) {
    if (!state.user) { alert('Нужно авторизоваться'); return; }
    if (!state.employer) { alert('Сначала создайте профиль работодателя'); employerModal.show(); return; }
    clearVacancyModal();
    if (vacancy) {
      vacancyModalTitle.textContent = 'Редактировать вакансию';
      vacancyIdInput.value = vacancy.id;
      vacancyTitleInput.value = vacancy.title;
      vacancyIndustryInput.value = vacancy.industry;
      vacancyExperienceInput.value = vacancy.experienceBucket === 'no' ? '' : vacancy.experienceBucket.split('-')[0] === '6+' ? 6 : vacancy.experienceBucket.split('-')[0];
      vacancySalaryFromInput.value = vacancy.salaryFrom || '';
      vacancySalaryToInput.value = vacancy.salaryTo || '';
      vacancyDescriptionInput.value = vacancy.description;
      vacancyRequirementsInput.value = vacancy.requirements.join('\n');
    } else {
      vacancyModalTitle.textContent = 'Создать вакансию';
    }
    vacancyModal.show();
  }

  async function createEmployerProfile(event) {
    event.preventDefault();
    if (!state.user) { alert('Нужно авторизоваться'); return; }
    const companyId = employerCompanySelect.value;
    const phone = employerPhoneInput.value;
    if (!companyId || !phone) { alert('Заполните данные'); return; }
    try {
      const { data } = await api.post('/employers', { userId: state.user.id, companyId: Number(companyId), phone });
      state.employer = data;
      employerStatus.textContent = `Компания: ${state.companies.find((c) => String(c.id) === String(companyId))?.name || ''}`;
      employerModal.hide();
      renderEmployerTable();
    } catch (err) { alert('Не удалось сохранить профиль работодателя.'); }
  }

  async function saveVacancy(event) {
    event.preventDefault();
    if (!state.user || !state.employer) { alert('Нужно авторизоваться и создать профиль работодателя'); return; }
    const payload = {
      title: vacancyTitleInput.value,
      description: vacancyDescriptionInput.value,
      requirements: vacancyRequirementsInput.value,
      salaryMin: vacancySalaryFromInput.value ? Number(vacancySalaryFromInput.value) : undefined,
      salaryMax: vacancySalaryToInput.value ? Number(vacancySalaryToInput.value) : undefined,
      industry: vacancyIndustryInput.value,
      experienceRequired: vacancyExperienceInput.value ? Number(vacancyExperienceInput.value) : undefined,
      format: 'office',
      location: state.companies.find((c) => String(c.id) === String(state.employer.companyId))?.location || '—',
      companyId: Number(state.employer.companyId),
    };
    const id = vacancyIdInput.value;
    try {
      if (id) await api.put(`/vacancies/${id}`, { ...payload, id: Number(id) });
      else await api.post('/vacancies', payload);
      vacancyModal.hide();
      await loadVacancies();
      renderEmployerTable();
    } catch (err) { alert('Не удалось сохранить вакансию.'); }
  }

  async function deleteVacancy(id) {
    if (!state.user) { alert('Нужно авторизоваться'); return; }
    if (!confirm('Удалить вакансию?')) return;
    try { await api.delete(`/vacancies/${id}`); await loadVacancies(); renderEmployerTable(); }
    catch { alert('Не удалось удалить вакансию'); }
  }

  async function loadCompanies() {
    try { const { data } = await api.get('/companies'); state.companies = data; }
    catch { state.companies = FALLBACK_COMPANIES; }
    populateCompanies();
  }

  async function loadVacancies() {
    try {
      const { data } = await api.get('/vacancies', { params: { _expand: 'company' } });
      state.vacancies = data.map(normalizeVacancy);
    } catch {
      state.vacancies = FALLBACK_VACANCIES.map(normalizeVacancy);
    }
    renderVacancies();
    renderFavorites();
    renderEmployerTable();
  }

  async function loadEmployerProfile() {
    if (!state.user) return;
    try {
      const { data } = await api.get('/employers', { params: { userId: state.user.id } });
      state.employer = data[0] || null;
      if (state.employer) employerStatus.textContent = `Компания: ${state.companies.find((c) => String(c.id) === String(state.employer.companyId))?.name || '—'}`;
      else employerStatus.textContent = 'Профиль работодателя не найден';
    } catch {
      employerStatus.textContent = 'Ошибка загрузки профиля работодателя';
    }
    renderEmployerTable();
  }

  async function loadProfile() {
    if (!state.user) return;
    try {
      const { data } = await api.get('/profiles', { params: { userId: state.user.id } });
      const profile = data[0];
      state.profile = profile;
      if (profile) {
        profilePosition.value = profile.position || profile.fullName || '';
        if (profileCity) profileCity.value = profile.city || '';
        if (profileAbout) profileAbout.value = profile.about || '';
        if (profileSkills) profileSkills.value = profile.skills || '';
      }
      updateResumeCard();
    } catch {/* ignore */}
  }

  function updateResumeCard() {
    const p = state.profile;
    if (!p) return;
    const title = p.position || p.fullName || 'Моё резюме';
    const skillsText = p.skills || '';
    if (resumeTitleEl) resumeTitleEl.textContent = title;
    if (resumeMetaEl) resumeMetaEl.textContent = skillsText || 'Навыки не указаны';
    if (resumeSkillsEl) {
      resumeSkillsEl.innerHTML = '';
      if (skillsText) {
        skillsText.split(/[,;]/).map((s) => s.trim()).filter(Boolean).forEach((skill, idx) => {
          const pill = document.createElement('span');
          pill.className = 'pill' + (idx === 0 ? ' pill--accent' : ' pill--muted');
          pill.textContent = skill;
          resumeSkillsEl.appendChild(pill);
        });
      } else {
        const pill = document.createElement('span');
        pill.className = 'pill pill--muted';
        pill.textContent = 'Навыки не указаны';
        resumeSkillsEl.appendChild(pill);
      }
    }
    if (resumeAboutEl) resumeAboutEl.textContent = p.about || 'Добавьте описание в профиле';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    state.vacancies = FALLBACK_VACANCIES.map(normalizeVacancy);
    populateIndustries();
    loadFilters();
    loadQuickSearch();
    renderActiveFilters(getFilters());

    quickSearchForm.addEventListener('submit', handleQuickSearch);
    filtersForm.addEventListener('input', renderVacancies);
    filtersForm.addEventListener('change', renderVacancies);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    vacanciesList.addEventListener('click', handleVacancyClick);
    favoritesList.addEventListener('click', handleFavoritesClick);
    employerTable.addEventListener('click', handleEmployerClick);
    selectors.loginForm.addEventListener('submit', handleAuthForm);
    selectors.registerForm.addEventListener('submit', handleAuthForm);
    profileSaveBtn.addEventListener('click', saveProfile);
    selectors.profileExportBtn.addEventListener('click', () => alert('Тут можно дернуть экспорт PDF'));
    if (selectors.resumeRefreshBtn) {
      selectors.resumeRefreshBtn.addEventListener('click', () => {
        const anchor = document.getElementById('user');
        if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
      });
    }
    createVacancyBtn.addEventListener('click', () => openVacancyModal());
    vacancyForm.addEventListener('submit', saveVacancy);
    employerForm.addEventListener('submit', createEmployerProfile);

    await loadCompanies();
    await loadVacancies();
    await loadEmployerProfile();
    await loadProfile();
  });
})();
