const urlApiOverride = new URLSearchParams(window.location.search).get('api');
if (urlApiOverride) {
  localStorage.setItem('careerApiBase', urlApiOverride);
}
const API_BASE = urlApiOverride || localStorage.getItem('careerApiBase') || 'http://localhost:3001';
const TOKEN_KEY = 'careerAuthToken';
const api = axios.create({ baseURL: API_BASE, timeout: 6000 });
const savedToken = localStorage.getItem(TOKEN_KEY);
if (savedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
}

const fallbackVacancies = [];

const fallbackApplications = [];

const fallbackEmployerVacancies = [];

const state = {
  vacancies: [...fallbackVacancies],
  applications: [...fallbackApplications],
  employerVacancies: [...fallbackEmployerVacancies],
  resumes: [],
  currentResume: null,
  currentUser: null
};

function applyEmployerStatuses() {
  const employerMap = new Map(
    (state.employerVacancies || []).map((v) => [String(v.id), v.status || 'опубликована'])
  );
  state.vacancies = state.vacancies.map((v) => {
    const status = employerMap.get(String(v.id));
    return { ...v, status: status || v.status || 'опубликована' };
  });
}

const vacancyList = document.getElementById('vacancyList');
const vacancyDetailCard = document.getElementById('vacancyDetailCard');
const detailApplyBtn = document.getElementById('detailApplyBtn');

const filterForm = document.getElementById('filterForm');
const searchQuery = document.getElementById('searchQuery');
const industryFilter = document.getElementById('industryFilter');
const experienceFilter = document.getElementById('experienceFilter');
const salaryFilter = document.getElementById('salaryFilter');
const salaryValue = document.getElementById('salaryValue');

const candidateAppsContainer = document.getElementById('candidateApplications');
const employerVacanciesContainer = document.getElementById('employerVacancies');
const employerApplicationsContainer = document.getElementById('employerApplications');
const addResumeBtn = document.getElementById('addResumeBtn');
const resumeModalElement = document.getElementById('resumeModal');
const resumeModal = resumeModalElement ? new bootstrap.Modal(resumeModalElement) : null;
const resumeForm = document.getElementById('resumeForm');
const resumeIdField = document.getElementById('resumeId');
const resumeTitleInput = document.getElementById('resumeTitle');
const resumeCityInput = document.getElementById('resumeCity');
const resumeYearsInput = document.getElementById('resumeYears');
const resumeSummaryInput = document.getElementById('resumeSummary');
const resumeSkillsInput = document.getElementById('resumeSkillsInput');

const applicationModalElement = document.getElementById('applicationModal');
const applicationModal = new bootstrap.Modal(applicationModalElement);

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionTriggers = document.querySelectorAll('[data-section-target]');

const resumeList = document.getElementById('resumeList');
const userBadge = document.getElementById('userBadge');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const employerForm = document.getElementById('employerForm');

function salaryText(v) {
  const from = v.salaryFrom || 0;
  const to = v.salaryTo || 0;
  if (!from && !to) return 'По договорённости';
  if (from && to && from !== to) return `${from}–${to} тыс`;
  return `${from || to} тыс`;
}

function renderVacancies(list) {
  vacancyList.innerHTML = list
    .map(
      (vacancy) => `
        <div class="col-md-6">
          <div class="vacancy-card h-100 d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <p class="mb-1 text-muted small">${vacancy.company}</p>
                <h5 class="mb-1">${vacancy.title}</h5>
              </div>
              <span class="pill">${vacancy.posted}</span>
            </div>
            <p class="text-muted small mb-2">${vacancy.city} · ${vacancy.format}</p>
            <div class="d-flex flex-wrap gap-2 mb-3">
              ${(vacancy.tags || []).map((tag) => `<span class="tag"><i></i>${tag}</span>`).join('')}
            </div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <span class="fw-semibold">${salaryText(vacancy)}</span>
              <span class="text-muted small">${vacancy.experienceYears}+ лет · ${vacancy.level}</span>
            </div>
            <p class="text-muted small flex-grow-1">${vacancy.description}</p>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-outline-light flex-grow-1" data-id="${vacancy.id}">Смотреть детали</button>
              <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#applicationModal" data-vacancy="${vacancy.title}">Откликнуться</button>
            </div>
          </div>
        </div>
      `
    )
    .join('');
}

function renderDetail(vacancy) {
  if (!vacancy) {
    vacancyDetailCard.innerHTML = '<p class="text-muted mb-0">Выберите вакансию, чтобы увидеть подробности.</p>';
    detailApplyBtn.dataset.vacancy = '';
    return;
  }

  detailApplyBtn.dataset.vacancy = vacancy.title;

  vacancyDetailCard.innerHTML = `
    <div class="d-flex justify-content-between flex-wrap gap-2 mb-2">
      <div>
        <h4 class="mb-1">${vacancy.title}</h4>
        <p class="text-muted mb-0">${vacancy.company} • ${vacancy.city}</p>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <span class="pill">${salaryText(vacancy)}</span>
        <span class="pill">${vacancy.level}</span>
      </div>
    </div>
    <div class="d-flex flex-wrap gap-2 mb-3">
      ${(vacancy.tags || []).map((tag) => `<span class="tag"><i></i>${tag}</span>`).join('')}
    </div>
    <p class="mb-3">${vacancy.description}</p>
    <div class="row g-3">
      <div class="col-md-6">
        <h6 class="mb-2">Требования</h6>
        <ul class="text-muted small ps-3 mb-0">
          ${(vacancy.requirements || []).map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="col-md-6">
        <h6 class="mb-2">Предлагаем</h6>
        <ul class="text-muted small ps-3 mb-0">
          ${(vacancy.benefits || []).map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function filterVacancies() {
  const query = searchQuery.value.trim().toLowerCase();
  const industry = industryFilter.value;
  const experience = experienceFilter.value;
  const salaryMin = Number(salaryFilter.value);

  return state.vacancies.filter((vacancy) => {
    if ((vacancy.status || 'опубликована') !== 'опубликована') return false;
    const combined = `${vacancy.title} ${vacancy.company} ${(vacancy.tags || []).join(' ')}`.toLowerCase();
    const matchesQuery = !query || combined.includes(query);
    const matchesIndustry = !industry || vacancy.industry === industry;
    const matchesExperience =
      !experience ||
      vacancy.level === experience ||
      (experience === 'senior' && vacancy.experienceYears >= 5) ||
      (experience === 'middle' && vacancy.experienceYears >= 2 && vacancy.experienceYears < 5) ||
      (experience === 'junior' && vacancy.experienceYears < 2);
    const matchesSalary = !salaryMin || (vacancy.salaryFrom || 0) >= salaryMin;
    return matchesQuery && matchesIndustry && matchesExperience && matchesSalary;
  });
}

function renderResumes() {
  if (!resumeList) return;
  if (!state.resumes.length) {
    resumeList.innerHTML = '<div class="col-12 text-muted">Резюме пока нет. Добавьте первое.</div>';
    return;
  }
  resumeList.innerHTML = state.resumes
    .map((resume, idx) => {
      const skills = Array.isArray(resume.skills)
        ? resume.skills
        : (resume.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
      const skillsHtml = skills.length
        ? skills.map((skill) => `<span class="tag"><i></i>${skill}</span>`).join('')
        : '<span class="tag"><i></i>Навыки не указаны</span>';
      return `
        <div class="col-12">
          <div class="glass-panel p-4 resume-card h-100">
            <div class="header-row">
              <div>
                <h5 class="mb-1">${resume.title || 'Моё резюме'}</h5>
                <p class="text-muted small mb-0">${resume.city || '—'} · ${resume.experienceYears || 0}+ лет</p>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <span class="status-chip">открыта к предложениям</span>
                <button class="btn btn-primary btn-sm" data-action="edit-resume" data-index="${idx}">Редактировать</button>
              </div>
            </div>
            <p class="text-muted resume-summary mb-3">${resume.summary || 'Добавьте описание резюме.'}</p>
            <div class="row g-3">
              <div class="col-sm-6">
                <h6 class="mb-1">Навыки</h6>
                <div class="tag-row">${skillsHtml}</div>
              </div>
              <div class="col-sm-6">
                <h6 class="mb-1">Опыт</h6>
                <ul class="text-muted small mb-0 ps-3">
                  <li>${resume.experienceYears || 0}+ лет опыта</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderCandidateApplications() {
  const valid = state.applications.filter((a) => a.title);
  candidateAppsContainer.innerHTML = valid
    .map(
      (item) => `
        <div class="application-card">
          <div class="min-w-0">
            <p class="title text-truncate mb-1">${item.title}</p>
            <p class="meta mb-0 text-truncate">${item.candidate || ''}</p>
          </div>
          <span class="pill">${item.status || 'статус не указан'}</span>
        </div>
      `
    )
    .join('');
}

function renderEmployerApplications() {
  if (!employerApplicationsContainer) return;
  const valid = state.applications.filter((a) => a.title);
  employerApplicationsContainer.innerHTML = valid
    .map(
      (item, idx) => `
        <div class="application-card">
          <div class="min-w-0">
            <p class="title text-truncate mb-1">${item.title}</p>
            <p class="meta mb-0 text-truncate">${item.candidate || 'Кандидат'}</p>
          </div>
          <button class="pill buttonish" data-action="employer-app-status" data-index="${idx}">
            ${item.status || 'статус не указан'}
          </button>
        </div>
      `
    )
    .join('');
}

function renderEmployerVacancies() {
  employerVacanciesContainer.innerHTML = state.employerVacancies
    .map(
      (item, index) => `
        <div class="d-flex justify-content-between align-items-center p-3 glass-panel">
          <div>
            <strong>${item.title}</strong>
            <p class="text-muted small mb-0">${item.industry.toUpperCase()} • от ${item.salaryFrom} тыс • ${item.level}</p>
          </div>
          <button class="pill status-btn" data-index="${index}">${item.status}</button>
        </div>
      `
    )
    .join('');
}

vacancyList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const vacancyId = button.dataset.id;
  const vacancy = state.vacancies.find((v) => String(v.id) === String(vacancyId));
  renderDetail(vacancy);
  document.getElementById('vacancyDetailCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderVacancies(filterVacancies());
});

salaryFilter.addEventListener('input', () => {
  salaryValue.textContent = `${salaryFilter.value} тыс`;
});

document.querySelectorAll('[data-bs-target="#applicationModal"]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    const vacancy = event.currentTarget.getAttribute('data-vacancy') || 'Свободная заявка';
    detailApplyBtn.dataset.vacancy = vacancy;
  });
});

const applicationForm = document.getElementById('applicationForm');
applicationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('applicantName').value;
  const email = document.getElementById('applicantEmail').value;
  const vacancyTitle = detailApplyBtn.dataset.vacancy || 'Свободная заявка';
  const message = document.getElementById('applicationMessage').value;

  const payload = {
    name,
    email,
    vacancy: vacancyTitle,
    title: vacancyTitle,
    candidate: name,
    status: 'В рассмотрении',
    message
  };

  api
    .post('/applications', payload)
    .then((res) => {
      const saved = res?.data || { ...payload, id: Date.now().toString() };
      state.applications = [saved, ...state.applications];
      renderCandidateApplications();
      renderEmployerApplications();
    })
    .catch(() => {
      const saved = { ...payload, id: Date.now().toString() };
      state.applications = [saved, ...state.applications];
      renderCandidateApplications();
      renderEmployerApplications();
    })
    .finally(() => {
      showInlineSuccess('Отклик сохранён. Мы свяжемся в течение рабочего дня.');
      applicationForm.reset();
      applicationModal.hide();
    });
});

function showInlineSuccess(text) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-success mt-3';
  alert.textContent = text;
  applicationForm.parentElement.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}

function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = '1080';
    container.style.display = 'grid';
    container.style.gap = '8px';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(text, type = 'info') {
  const container = ensureToastContainer();
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} shadow-sm mb-0`;
  alert.textContent = text;
  container.appendChild(alert);
  setTimeout(() => alert.remove(), 3200);
}

function showFormStatus(form, text, type = 'info') {
  if (!form) return;
  let status = form.querySelector('[data-role="form-status"]');
  if (!status) {
    status = document.createElement('div');
    status.dataset.role = 'form-status';
    form.prepend(status);
  }
  status.className = `small mt-1 text-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'info'}`;
  status.textContent = text;
  clearTimeout(status._hideTimeout);
  status._hideTimeout = setTimeout(() => status.remove(), 4500);
}

async function checkApiAvailability() {
  try {
    await api.get('/vacancies');
    return true;
  } catch {
    return false;
  }
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1] || '';
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function resolveUserFromToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  try {
    if (payload.sub) {
      const { data } = await api.get(`/users/${payload.sub}`);
      return data;
    }
  } catch (error) {
    if (error?.response?.status === 401) return null;
  }
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name || payload.fullName || payload.username
  };
}

function clearAuth() {
  setAuthToken('');
  setCurrentUser(null);
}

function setCurrentUser(user) {
  state.currentUser = user;
  if (userBadge) {
    userBadge.textContent = user ? `Вы вошли: ${user.email || user.name || user.id}` : 'Не авторизован';
    userBadge.classList.toggle('success', Boolean(user));
    userBadge.classList.toggle('error', !user);
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const passwordInput = event.target.querySelector('input[type="password"]');
  const email = (emailInput?.value || '').trim();
  const password = (passwordInput?.value || '').trim();
  if (!email || !password) {
    showFormStatus(loginForm, 'Введите email и пароль.', 'danger');
    return;
  }
  try {
    const { data } = await api.post('/login', { email, password });
    const token = data?.accessToken;
    if (!token) throw new Error('Token missing');
    setAuthToken(token);
    const profile = data?.user || (await resolveUserFromToken(token)) || { email };
    setCurrentUser(profile);
    showFormStatus(loginForm, 'Вход выполнен.', 'success');
    showToast('Вход выполнен.', 'success');
  } catch (error) {
    clearAuth();
    const status = error?.response?.status;
    const message = status === 401 ? 'Неверный логин или пароль.' : 'Сервер недоступен, вход не выполнен.';
    showFormStatus(loginForm, message, 'danger');
    showToast(message, 'danger');
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const textInputs = event.target.querySelectorAll('input[type="text"]');
  const firstName = textInputs[0]?.value.trim() || '';
  const lastName = textInputs[1]?.value.trim() || '';
  const email = event.target.querySelector('input[type="email"]')?.value.trim() || '';
  const password = event.target.querySelector('input[type="password"]')?.value.trim() || '';
  const role = event.target.querySelector('input[name="regRole"]:checked')?.value || 'job_seeker';
  const fullName = `${firstName} ${lastName}`.trim();
  const username = (email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_.-]/g, '') || `user${Date.now()}`;

  if (!email || !password || !fullName) {
    showFormStatus(registerForm, 'Заполните имя, фамилию, email и пароль.', 'danger');
    return;
  }

  try {
    const { data } = await api.post('/register', { email, password, fullName, username, role });
    const token = data?.accessToken;
    if (!token) throw new Error('Token missing');
    setAuthToken(token);
    const profile = data?.user || (await resolveUserFromToken(token)) || { email, name: fullName };
    setCurrentUser(profile);
    showFormStatus(registerForm, 'Регистрация успешна. Вы вошли.', 'success');
    showToast('Регистрация успешна. Вы вошли.', 'success');
  } catch (error) {
    clearAuth();
    const status = error?.response?.status;
    const message =
      status === 409
        ? 'Такой email или username уже заняты.'
        : 'Сервер недоступен, регистрация не сохранена.';
    showFormStatus(registerForm, message, 'danger');
    showToast(message, 'danger');
  }
});

employerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('empTitle').value;
  const industry = document.getElementById('empIndustry').value;
  const salaryFrom = Number(document.getElementById('empSalary').value) || 0;
  const level = document.getElementById('empLevel').value;
  const generatedId = Date.now().toString();
  const newVacancy = {
    id: generatedId,
    title,
    company: 'Моя компания',
    city: '—',
    industry,
    format: 'office',
    salaryFrom,
    salaryTo: 0,
    level,
    experienceYears: level === 'senior' ? 5 : level === 'middle' ? 3 : 1,
    posted: 'сегодня',
    status: 'опубликована',
    tags: [],
    description: 'Новая вакансия работодателя',
    requirements: [],
    benefits: ['Гибкий график', 'Медстраховка', 'Команда']
  };
  state.employerVacancies = [newVacancy, ...state.employerVacancies];
  state.vacancies = [newVacancy, ...state.vacancies];
  applyEmployerStatuses();
  renderEmployerVacancies();
  renderVacancies(filterVacancies());
  event.target.reset();
  showToast('Вакансия добавлена в список работодателя.');
  api.post('/employerVacancies', newVacancy).catch(() => null);
  api.post('/vacancies', newVacancy).catch(() => null);
});

employerApplicationsContainer?.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action="employer-app-status"]');
  if (!btn) return;
  const idx = Number(btn.dataset.index);
  const statusOrder = ['В рассмотрении', 'Интервью назначено', 'Оффер', 'Отклонено'];
  const current = state.applications[idx]?.status || statusOrder[0];
  const next = statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length];
  if (!state.applications[idx]) return;
  state.applications[idx].status = next;
  renderEmployerApplications();
  renderCandidateApplications();
  const id = state.applications[idx].id;
  if (id) {
    api.patch(`/applications/${id}`, { status: next }).catch(() => null);
  }
});

employerVacanciesContainer.addEventListener('click', (event) => {
  const btn = event.target.closest('.status-btn');
  if (!btn) return;
  const idx = Number(btn.dataset.index);
  const statusOrder = ['опубликована', 'в работе', 'черновик'];
  const current = state.employerVacancies[idx].status;
  const next = statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length];
  state.employerVacancies[idx].status = next;
  applyEmployerStatuses();
  renderEmployerVacancies();
  renderVacancies(filterVacancies());
  const apiId = state.employerVacancies[idx].id || '';
  api.patch(`/employerVacancies/${apiId}`, { status: next }).catch(() => null);
  if (apiId) api.patch(`/vacancies/${apiId}`, { status: next }).catch(() => null);
});

if (addResumeBtn && resumeModal) {
  addResumeBtn.addEventListener('click', () => {
    resumeModal.show();
    resumeIdField.value = '';
    resumeTitleInput.value = '';
    resumeCityInput.value = '';
    resumeYearsInput.value = '0';
    resumeSummaryInput.value = '';
    resumeSkillsInput.value = '';
  });
}

resumeList?.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action="edit-resume"]');
  if (!btn) return;
  const idx = Number(btn.dataset.index);
  const resume = state.resumes[idx];
  if (!resume) return;
  resumeIdField.value = resume.id || '';
  resumeTitleInput.value = resume.title || '';
  resumeCityInput.value = resume.city || '';
  resumeYearsInput.value = resume.experienceYears || 0;
  resumeSummaryInput.value = resume.summary || '';
  resumeSkillsInput.value = Array.isArray(resume.skills)
    ? resume.skills.join(', ')
    : resume.skills || '';
  resumeModal.show();
});

if (resumeForm && resumeModal) {
  resumeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = {
      title: resumeTitleInput.value,
      city: resumeCityInput.value,
      experienceYears: Number(resumeYearsInput.value) || 0,
      summary: resumeSummaryInput.value,
      skills: resumeSkillsInput.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };
    const id = resumeIdField.value;
    const saveRequest = id
      ? api.put(`/resumes/${id}`, { ...payload, id })
      : api.post('/resumes', payload);

    saveRequest
      .then((res) => {
        const saved = res?.data || { ...payload, id: id || Date.now().toString() };
        if (id) {
          state.resumes = state.resumes.map((r) => (String(r.id) === String(id) ? saved : r));
        } else {
          state.resumes = [saved, ...state.resumes];
        }
        renderResumes();
      })
      .catch(() => {
        const saved = { ...payload, id: id || Date.now().toString() };
        if (id) {
          state.resumes = state.resumes.map((r) => (String(r.id) === String(id) ? saved : r));
        } else {
          state.resumes = [saved, ...state.resumes];
        }
        renderResumes();
      })
      .finally(() => {
        showToast('Резюме сохранено.');
        resumeForm.reset();
        resumeIdField.value = '';
        resumeModal.hide();
      });
  });
}

function showSection(section) {
  pages.forEach((p) => p.classList.toggle('active', p.dataset.section === section));
  navLinks.forEach((link) =>
    link.classList.toggle('active', link.getAttribute('data-section-target') === section)
  );
}

sectionTriggers.forEach((el) => {
  el.addEventListener('click', (event) => {
    const target = el.getAttribute('data-section-target');
    if (!target) return;
    event.preventDefault();
    showSection(target);
  });
});

async function loadFromApi() {
  try {
    const { data } = await api.get('/vacancies');
    state.vacancies = Array.isArray(data) ? data : fallbackVacancies;
  } catch {
    state.vacancies = fallbackVacancies;
  }

  try {
    const { data } = await api.get('/applications');
    state.applications = Array.isArray(data)
      ? data.map((a) => ({
          ...a,
          title: a.title || a.vacancy || 'Без названия',
          status: a.status || 'В рассмотрении',
          candidate: a.candidate || a.name || ''
        }))
      : fallbackApplications;
  } catch {
    state.applications = fallbackApplications;
  }

  try {
    const { data } = await api.get('/resumes');
    state.resumes = Array.isArray(data) ? data : [];
  } catch {
    state.resumes = [];
  }

  try {
    const { data } = await api.get('/employerVacancies');
    state.employerVacancies = Array.isArray(data) ? data : fallbackEmployerVacancies;
  } catch {
    state.employerVacancies = fallbackEmployerVacancies;
  }

  // объединяем статусы работодателя в общий список вакансий по id
  applyEmployerStatuses();
}

document.addEventListener('DOMContentLoaded', async () => {
  salaryValue.textContent = `${salaryFilter.value} тыс`;
  const apiOk = await checkApiAvailability();
  if (!apiOk) {
    showToast(`API недоступен: ${API_BASE}. Убедитесь, что бэкенд запущен.`, 'danger');
  } else {
    showToast(`Подключено к API: ${API_BASE}`, 'info');
  }
  const initialToken = localStorage.getItem(TOKEN_KEY);
  if (initialToken) {
    setAuthToken(initialToken);
    const profile = await resolveUserFromToken(initialToken);
    if (profile) {
      setCurrentUser(profile);
    } else {
      clearAuth();
    }
  }
  await loadFromApi();
  renderVacancies(filterVacancies());
  renderDetail(state.vacancies[0]);
  renderCandidateApplications();
  renderEmployerVacancies();
  renderEmployerApplications();
  renderResumes();
  showSection('vacancy');
});
