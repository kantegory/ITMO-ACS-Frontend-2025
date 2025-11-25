(() => {
  const INDUSTRIES = [
    { value: 'technology', label: 'Технологии' },
    { value: 'finance', label: 'Финансы' },
    { value: 'healthcare', label: 'Здравоохранение' },
    { value: 'education', label: 'Образование' },
    { value: 'manufacturing', label: 'Производство' },
    { value: 'other', label: 'Другое' },
  ];
  const INDUSTRY_LABELS = INDUSTRIES.reduce((acc, item) => ({ ...acc, [item.value]: item.label }), {});

  const STATIC_VACANCIES = [
    {
      id: 'f1',
      title: 'Senior React разработчик для аналитической платформы с длинным названием, которое мы аккуратно обрежем',
      company: 'DataPulse',
      companyId: 'c1',
      industry: 'technology',
      salaryFrom: 180000,
      salaryTo: 240000,
      experience: 4,
      format: 'hybrid',
      location: 'Москва',
      description: 'Строим новый дашборд для продуктовой аналитики. Работа с микрофронтендами, дизайн-системой и графиками.',
      requirements: [
        'React 18, TypeScript, Zustand или Redux',
        'Опыт построения дизайн-системы',
        'CI/CD, code review и метрики качества',
      ],
      tags: ['React', 'TypeScript', 'Microfrontends'],
    },
    {
      id: 'f2',
      title: 'Frontend стажёр / junior',
      company: 'NovaTech',
      companyId: 'c2',
      industry: 'technology',
      salaryFrom: 60000,
      salaryTo: 90000,
      experience: 0,
      format: 'office',
      location: 'Санкт-Петербург',
      description: 'Поможем прокачаться в верстке и JS. Ставим задачи с наставником и ревью.',
      requirements: ['HTML, CSS, базовый JS', 'Понимание Git', 'Желание учиться и задавать вопросы'],
      tags: ['HTML', 'CSS', 'JavaScript'],
    },
    {
      id: 'f3',
      title: 'Product designer (UX/UI)',
      company: 'Cloudy',
      companyId: 'c3',
      industry: 'other',
      salaryFrom: 160000,
      salaryTo: 200000,
      experience: 4,
      format: 'remote',
      location: 'Удалённо',
      description: 'Проектируем сложные сценарии и интерфейсы. Много работы с текстами и состояниями.',
      requirements: ['Figma, прототипы, дизайн-системы', 'Работа с UI-китом', 'Умение вести исследования'],
      tags: ['UX', 'UI', 'Figma'],
    },
    {
      id: 'f4',
      title: 'Data engineer (ETL/DWH)',
      company: 'Metric Labs',
      companyId: 'c4',
      industry: 'finance',
      salaryFrom: 190000,
      salaryTo: 250000,
      experience: 4,
      format: 'hybrid',
      location: 'Москва',
      description: 'Поднимаем пайплайны, наводим порядок в данных, строим витрины. Много общения с аналитиками.',
      requirements: ['SQL, Python, Airflow', 'Kafka или очереди', 'Опыт работы с облаками'],
      tags: ['Data', 'Python', 'Airflow'],
    },
    {
      id: 'f5',
      title: 'QA Automation инженер',
      company: 'Shiftly',
      companyId: 'c5',
      industry: 'technology',
      salaryFrom: 150000,
      salaryTo: 190000,
      experience: 2,
      format: 'remote',
      location: 'Казань / удалённо',
      description: 'Покрываем сервисы автотестами. Много регрессов, помогаем разработке улучшить DX.',
      requirements: ['JS/TS или Python', 'Playwright/Selenium', 'Разбор логов и мониторинга'],
      tags: ['QA', 'Automation', 'Playwright'],
    },
    {
      id: 'f6',
      title: 'Product manager',
      company: 'FinRise',
      companyId: 'c6',
      industry: 'finance',
      salaryFrom: 170000,
      salaryTo: 230000,
      experience: 4,
      format: 'hybrid',
      location: 'Екатеринбург',
      description: 'Работаем над финтех-продуктом. Выстраиваем гипотезы, CJM, следим за метриками.',
      requirements: ['JTBD, CustDev, CJM', 'Работа с аналитикой', 'Навыки презентации'],
      tags: ['Product', 'Analytics'],
    },
    {
      id: 'f7',
      title: 'Backend Node.js разработчик',
      company: 'JobBridge',
      companyId: 'c7',
      industry: 'technology',
      salaryFrom: 160000,
      salaryTo: 210000,
      experience: 2,
      format: 'office',
      location: 'Новосибирск',
      description: 'API для поисковой платформы: аутентификация, профили, вакансии. Работаем с микросервисами.',
      requirements: ['Node.js, TypeScript', 'PostgreSQL, Redis', 'Unit-тесты и CI'],
      tags: ['Node.js', 'PostgreSQL', 'TypeScript'],
    },
  ];

  const favorites = new Set(JSON.parse(localStorage.getItem('jobFavorites') || '[]'));
  const state = {
    vacancies: [],
    companies: [
      { id: 'c1', name: 'DataPulse' },
      { id: 'c2', name: 'NovaTech' },
      { id: 'c3', name: 'Cloudy' },
      { id: 'c4', name: 'Metric Labs' },
      { id: 'c5', name: 'Shiftly' },
      { id: 'c6', name: 'FinRise' },
      { id: 'c7', name: 'JobBridge' },
    ],
  };

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

  function saveFavorites() {
    localStorage.setItem('jobFavorites', JSON.stringify(Array.from(favorites)));
  }

  function saveFilters(filters) {
    localStorage.setItem('jobFilters', JSON.stringify(filters));
  }

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
      opt.value = value;
      opt.textContent = label;
      industrySelect.appendChild(opt);

      const opt2 = opt.cloneNode(true);
      vacancyIndustryInput.appendChild(opt2);
    });
  }

  function populateCompanies() {
    employerCompanySelect.innerHTML = '';
    state.companies.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      employerCompanySelect.appendChild(opt);
    });
  }

  function toExperienceBucket(value) {
    if (typeof value === 'string' && value.includes('-')) return value;
    if (value === 'no') return 'no';
    if (value === '6+') return '6+';
    const num = typeof value === 'number' ? value : Number(value) || 0;
    if (num <= 0) return 'no';
    if (num <= 3) return '1-3';
    if (num <= 6) return '3-6';
    return '6+';
  }

  function experienceLabel(bucket) {
    if (bucket === 'no') return 'Нет опыта';
    if (bucket === '1-3') return '1–3 года';
    if (bucket === '3-6') return '3–6 лет';
    if (bucket === '6+') return '6+ лет';
    return 'Любой опыт';
  }

  function formatLabel(format) {
    if (format === 'hybrid') return 'Гибрид';
    if (format === 'remote') return 'Удалённо';
    if (format === 'office') return 'Офис';
    return 'Не указано';
  }

  function normalizeVacancy(v) {
    const requirements = Array.isArray(v.requirements)
      ? v.requirements
      : typeof v.requirements === 'string'
        ? v.requirements.split(/\n|;/).map((s) => s.trim()).filter(Boolean)
        : [];
    const industry = v.industry || 'other';
    const experience = v.experienceRequired ?? v.experience;
    const company = typeof v.company === 'string' ? { name: v.company, id: v.companyId } : v.company;
    return {
      id: v.id,
      title: v.title,
      company: company?.name || 'Без компании',
      companyId: company?.id,
      industry,
      industryLabel: INDUSTRY_LABELS[industry] || industry,
      salaryFrom: v.salaryMin ?? v.salaryFrom ?? 0,
      salaryTo: v.salaryMax ?? v.salaryTo ?? 0,
      experienceBucket: toExperienceBucket(experience),
      format: v.format || 'office',
      location: v.location || company?.address || '—',
      description: v.description || '',
      requirements,
      tags: v.tags || requirements.slice(0, 3),
    };
  }

  function getFilters() {
    return {
      industry: industrySelect.value,
      salary: Number(salaryInput.value) || 0,
      experience: experienceSelect.value,
      format: formatSelect.value,
      keyword: keywordInput.value.trim().toLowerCase(),
    };
  }

  function matchesFilters(vacancy, filters) {
    const salaryOk = !filters.salary || (vacancy.salaryTo || vacancy.salaryFrom) >= filters.salary;
    const industryOk = !filters.industry || vacancy.industry === filters.industry;
    const experienceOk = !filters.experience || vacancy.experienceBucket === filters.experience;
    const formatOk = !filters.format || vacancy.format === filters.format;
    const inText = `${vacancy.title} ${vacancy.company} ${vacancy.description} ${vacancy.location}`
      .toLowerCase()
      .includes(filters.keyword);
    return salaryOk && industryOk && experienceOk && formatOk && (filters.keyword ? inText : true);
  }

  function renderActiveFilters(filters) {
    activeFilters.innerHTML = '';
    const items = [];
    if (filters.industry) items.push({ label: INDUSTRY_LABELS[filters.industry] || filters.industry });
    if (filters.salary) items.push({ label: `от ${filters.salary.toLocaleString('ru-RU')} ₽` });
    if (filters.experience) items.push({ label: experienceLabel(filters.experience) });
    if (filters.format) items.push({ label: formatLabel(filters.format) });
    if (filters.keyword) items.push({ label: `Поиск: ${filters.keyword}` });

    if (!items.length) {
      activeFilters.innerHTML = '<span class="text-muted small">Фильтры не выбраны</span>';
      return;
    }
    items.forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'pill pill--muted';
      pill.textContent = item.label;
      activeFilters.appendChild(pill);
    });
  }

  function renderVacancies() {
    const filters = getFilters();
    saveFilters(filters);
    renderActiveFilters(filters);
    const filtered = state.vacancies.filter((v) => matchesFilters(v, filters));
    vacanciesList.innerHTML = '';

    if (!filtered.length) {
      vacanciesList.innerHTML = '<p class="text-muted">Ничего не нашлось, попробуйте ослабить фильтры.</p>';
      return;
    }

    filtered.forEach((vacancy) => {
      const col = document.createElement('div');
      col.className = 'col-md-6';
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
                ${favorites.has(vacancy.id) ? 'Убрать' : 'В избранное'}
              </button>
            </div>
          </div>
        </div>
      `;
      vacanciesList.appendChild(col);
    });
  }

  function renderVacancyDetail(vacancy) {
    vacancyDetail.innerHTML = `
      <div class="card-body d-flex flex-column gap-2">
        <p class="text-muted mb-0">${vacancy.company} • ${vacancy.location} • ${formatLabel(vacancy.format)}</p>
        <h3 class="vacancy__title">${vacancy.title}</h3>
        <p class="vacancy__text">Зарплата: ${vacancy.salaryFrom ? vacancy.salaryFrom.toLocaleString('ru-RU') : '—'} — ${vacancy.salaryTo ? vacancy.salaryTo.toLocaleString('ru-RU') : '—'} ₽ • Опыт: ${experienceLabel(vacancy.experienceBucket)}</p>
        <p class="vacancy__text">${vacancy.description}</p>
        <ul class="vacancy__list">
          ${vacancy.requirements.map((item) => `<li>${item}</li>`).join('')}
        </ul>
        <div class="d-flex flex-wrap gap-2">
          ${vacancy.tags.map((tag) => `<span class="pill pill--muted">${tag}</span>`).join('')}
        </div>
      </div>
    `;
  }

  function toggleFavorite(id) {
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    saveFavorites();
    renderFavorites();
    renderVacancies();
  }

  function renderFavorites() {
    favoritesList.innerHTML = '';
    const favoriteVacancies = state.vacancies.filter((v) => favorites.has(v.id));
    favoritesCounter.textContent = favoriteVacancies.length;
    if (!favoriteVacancies.length) {
      favoritesList.innerHTML = '<li class="list-group-item text-muted">Пока пусто</li>';
      return;
    }
    favoriteVacancies.forEach((v) => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="min-w-0">
            <p class="job-card__title mb-1">${v.title}</p>
            <p class="job-card__meta mb-0">${v.company} • ${v.location}</p>
          </div>
          <button class="btn btn-link btn-sm p-0" data-action="remove-favorite" data-id="${v.id}">Убрать</button>
        </div>
      `;
      favoritesList.appendChild(item);
    });
  }

  function renderEmployerTable() {
    employerTable.innerHTML = '<tr><td colspan="4" class="text-muted">Демо: управление вакансиями доступно в следующих работах.</td></tr>';
    employerStatus.textContent = 'Демо: без авторизации';
  }

  function handleVacancyClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (action === 'details') {
      const vacancy = state.vacancies.find((v) => v.id === id);
      if (vacancy) {
        renderVacancyDetail(vacancy);
        window.location.hash = '#vacancy-detail';
      }
    }
    if (action === 'favorite') toggleFavorite(id);
  }

  function handleFavoritesClick(event) {
    const button = event.target.closest('button[data-action="remove-favorite"]');
    if (!button) return;
    toggleFavorite(button.dataset.id);
  }

  function handleEmployerClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'edit' || action === 'delete') {
      alert('Демо: редактирование и удаление вакансий появится в следующих работах');
    }
  }

  function handleAuthForm(event) {
    event.preventDefault();
    bootstrap.Modal.getInstance(event.target.closest('.modal'))?.hide();
    alert('Демо: авторизация отключена в ЛР1');
  }

  function handleQuickSearch(event) {
    event.preventDefault();
    const prefs = {
      keyword: quickSearchInput.value.trim(),
      city: quickCityInput.value.trim(),
    };
    localStorage.setItem('quickSearch', JSON.stringify(prefs));
    keywordInput.value = prefs.keyword;
    renderVacancies();
    window.location.hash = '#jobs';
  }

  function loadQuickSearch() {
    const saved = JSON.parse(localStorage.getItem('quickSearch') || '{}');
    if (saved.keyword) quickSearchInput.value = saved.keyword;
    if (saved.city) quickCityInput.value = saved.city;
  }

  function saveProfile() {
    alert('Демо: сохранение профиля будет подключено позже');
  }

  function resetFilters() {
    filtersForm.reset();
    saveFilters(getFilters());
    renderVacancies();
  }

  function clearVacancyModal() {
    vacancyIdInput.value = '';
    vacancyTitleInput.value = '';
    vacancyIndustryInput.value = '';
    vacancyExperienceInput.value = '';
    vacancySalaryFromInput.value = '';
    vacancySalaryToInput.value = '';
    vacancyDescriptionInput.value = '';
    vacancyRequirementsInput.value = '';
  }

  function openVacancyModal(vacancy) {
    clearVacancyModal();
    vacancyModalTitle.textContent = vacancy ? 'Редактировать вакансию (демо)' : 'Создать вакансию (демо)';
    vacancyModal.show();
  }

  function createEmployerProfile(event) {
    event.preventDefault();
    alert('Демо: профиль работодателя будет подключён позже');
  }

  function saveVacancy(event) {
    event.preventDefault();
    alert('Демо: создание/редактирование вакансий будет доступно в следующих работах');
  }

  function deleteVacancy() {
    alert('Демо: удаление вакансий будет доступно позже');
  }

  document.addEventListener('DOMContentLoaded', () => {
    state.vacancies = STATIC_VACANCIES.map(normalizeVacancy);
    populateIndustries();
    populateCompanies();
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
    document.getElementById('loginForm').addEventListener('submit', handleAuthForm);
    document.getElementById('registerForm').addEventListener('submit', handleAuthForm);
    profileSaveBtn.addEventListener('click', saveProfile);
    document.getElementById('profileExportBtn').addEventListener('click', () => alert('Демо экспорт PDF'));
    createVacancyBtn.addEventListener('click', () => openVacancyModal());
    vacancyForm.addEventListener('submit', saveVacancy);
    employerForm.addEventListener('submit', createEmployerProfile);

    renderVacancies();
    renderFavorites();
    renderEmployerTable();
  });
})();
