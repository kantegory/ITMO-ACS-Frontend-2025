const vacancies = [
  {
    id: 'v1',
    title: 'Product Analyst',
    company: 'Northwind R&D',
    city: 'Казань',
    industry: 'it',
    format: 'hybrid',
    salaryFrom: 220,
    salaryTo: 280,
    level: 'middle',
    experienceYears: 3,
    posted: 'сегодня',
    tags: ['A/B', 'SQL', 'Amplitude'],
    description:
      'Работаем с продуктовой аналитикой: формулировка гипотез, A/B тесты, рекомендации по монетизации.',
    requirements: [
      'Уверенный SQL, Python будет плюсом',
      'Опыт A/B тестирования и дашбордов',
      'Умение общаться с продуктовой командой'
    ],
    benefits: ['Гибридный график', 'Бюджет на обучение', 'Команда, которая слушает аналитику']
  },
  {
    id: 'v2',
    title: 'Data Engineer',
    company: 'Cloudtail',
    city: 'Удалённо',
    industry: 'finance',
    format: 'remote',
    salaryFrom: 300,
    salaryTo: 380,
    level: 'senior',
    experienceYears: 5,
    posted: '2 дня назад',
    tags: ['Airflow', 'DBT', 'GCP'],
    description:
      'Собираем пайплайны для платёжной аналитики, внедряем мониторинг качества данных.',
    requirements: ['Airflow/DBT', 'Python + SQL', 'Опыт с облаками GCP/AWS'],
    benefits: ['Полная удалёнка', 'Минимум бюрократии', 'Конференции и сертификации']
  },
  {
    id: 'v3',
    title: 'Product Designer',
    company: 'Neon Kitchen',
    city: 'Москва',
    industry: 'retail',
    format: 'hybrid',
    salaryFrom: 210,
    salaryTo: 260,
    level: 'middle',
    experienceYears: 3,
    posted: 'вчера',
    tags: ['Figma', 'UX research', 'Design system'],
    description:
      'B2C продукт для доставок: сценарии, дизайн-система, эксперименты вместе с аналитикой.',
    requirements: ['Сильные UX кейсы', 'Опыт end-to-end фичей', 'Работа с метриками'],
    benefits: ['Офис на Art Play', 'Ресёрч поддержка', 'Тестовые лаборатории']
  },
  {
    id: 'v4',
    title: 'QA Automation Engineer',
    company: 'Beta Ops',
    city: 'Санкт-Петербург',
    industry: 'it',
    format: 'hybrid',
    salaryFrom: 190,
    salaryTo: 230,
    level: 'middle',
    experienceYears: 2,
    posted: '3 дня назад',
    tags: ['Playwright', 'TypeScript', 'CI/CD'],
    description:
      'Автотесты для devtools-платформы, быстрый фидбек в CI, совместная работа с разработкой.',
    requirements: ['Playwright/Cypress', 'TypeScript/JS', 'Понимание CI/CD'],
    benefits: ['Релизы каждую неделю', 'Оплачиваем софт', 'Наставничество']
  },
  {
    id: 'v5',
    title: 'HR Operations',
    company: 'Bright Lab',
    city: 'Самара',
    industry: 'education',
    format: 'office',
    salaryFrom: 110,
    salaryTo: 140,
    level: 'middle',
    experienceYears: 1,
    posted: 'сегодня',
    tags: ['HRIS', 'Onboarding', 'People care'],
    description:
      'Нанимаем и онбордим технические команды, настраиваем HR-процессы и автоматизацию.',
    requirements: ['Опыт HR generalist/ops', 'Работа с HRIS', 'Коммуникации с тимлидами'],
    benefits: ['Обучение у HR-директора', 'Прозрачный грейдинг', 'Фокус на wellbeing']
  },
  {
    id: 'v6',
    title: 'Backend Intern (Go)',
    company: 'Northwind R&D',
    city: 'Казань',
    industry: 'it',
    format: 'internship',
    salaryFrom: 50,
    salaryTo: 50,
    level: 'intern',
    experienceYears: 0,
    posted: '5 дней назад',
    tags: ['Go', 'PostgreSQL', 'Docker'],
    description:
      'Практика с менторами: пишем сервисы, тесты и учимся ревьюить код на Go.',
    requirements: ['Базовый Go', 'SQL и Docker на базовом уровне', 'Желание учиться'],
    benefits: ['Наставник 1:1', 'Шанс на джун оффер', 'Внутренние лекции']
  }
];

const candidateApplications = [
  { title: 'Product Analyst — Northwind', status: 'В рассмотрении' },
  { title: 'QA Automation — Beta Ops', status: 'Интервью назначено' },
  { title: 'Product Designer — Neon Kitchen', status: 'Есть оффер' }
];

let employerVacancies = [
  { title: 'Middle Frontend', industry: 'it', salaryFrom: 180, level: 'middle', status: 'опубликована' },
  { title: 'HR Operations', industry: 'education', salaryFrom: 110, level: 'middle', status: 'в работе' }
];

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
const addResumeBtn = document.getElementById('addResumeBtn');
const resumeModalElement = document.getElementById('resumeModal');
const resumeModal = resumeModalElement ? new bootstrap.Modal(resumeModalElement) : null;

const applicationModalElement = document.getElementById('applicationModal');
const applicationModal = new bootstrap.Modal(applicationModalElement);

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionTriggers = document.querySelectorAll('[data-section-target]');

function salaryText(v) {
  return v.salaryFrom === v.salaryTo ? `${v.salaryFrom} тыс` : `${v.salaryFrom}–${v.salaryTo} тыс`;
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
              ${vacancy.tags.map((tag) => `<span class="tag"><i></i>${tag}</span>`).join('')}
            </div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <span class="fw-semibold">${salaryText(vacancy)}</span>
              <span class="text-muted small">${vacancy.experienceYears}+ лет · ${vacancy.level}</span>
            </div>
            <p class="text-muted small flex-grow-1">${vacancy.description}</p>
            <button class="btn btn-outline-light mt-3" data-id="${vacancy.id}">Смотреть детали</button>
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
      ${vacancy.tags.map((tag) => `<span class="tag"><i></i>${tag}</span>`).join('')}
    </div>
    <p class="mb-3">${vacancy.description}</p>
    <div class="row g-3">
      <div class="col-md-6">
        <h6 class="mb-2">Требования</h6>
        <ul class="text-muted small ps-3 mb-0">
          ${vacancy.requirements.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      <div class="col-md-6">
        <h6 class="mb-2">Предлагаем</h6>
        <ul class="text-muted small ps-3 mb-0">
          ${vacancy.benefits.map((item) => `<li>${item}</li>`).join('')}
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

  return vacancies.filter((vacancy) => {
    const combined = `${vacancy.title} ${vacancy.company} ${vacancy.tags.join(' ')}`.toLowerCase();
    const matchesQuery = !query || combined.includes(query);
    const matchesIndustry = !industry || vacancy.industry === industry;
    const matchesExperience =
      !experience ||
      vacancy.level === experience ||
      (experience === 'senior' && vacancy.experienceYears >= 5) ||
      (experience === 'middle' && vacancy.experienceYears >= 2 && vacancy.experienceYears < 5) ||
      (experience === 'junior' && vacancy.experienceYears < 2);
    const matchesSalary = !salaryMin || vacancy.salaryFrom >= salaryMin;
    return matchesQuery && matchesIndustry && matchesExperience && matchesSalary;
  });
}

function renderCandidateApplications() {
  candidateAppsContainer.innerHTML = candidateApplications
    .map(
      (item) => `
        <div class="d-flex justify-content-between align-items-center p-3 glass-panel">
          <span>${item.title}</span>
          <span class="pill">${item.status}</span>
        </div>
      `
    )
    .join('');
}

function renderEmployerVacancies() {
  employerVacanciesContainer.innerHTML = employerVacancies
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
  const vacancy = vacancies.find((v) => v.id === vacancyId);
  renderDetail(vacancy);
  document.getElementById('applicationVacancy').value = vacancy.title;
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
    document.getElementById('applicationVacancy').value = vacancy;
  });
});

const applicationForm = document.getElementById('applicationForm');
applicationForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('applicantName').value;
  const email = document.getElementById('applicantEmail').value;
  const vacancyTitle = document.getElementById('applicationVacancy').value;
  const message = document.getElementById('applicationMessage').value;

  console.info('Demo payload:', { name, email, vacancy: vacancyTitle, message });
  showInlineSuccess('Отклик сохранён. Мы свяжемся в течение рабочего дня.');
  applicationForm.reset();
  applicationModal.hide();
});

function showInlineSuccess(text) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-success mt-3';
  alert.textContent = text;
  applicationForm.parentElement.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('Вход выполнен (демо), профиль обновлён.');
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('Регистрация сохранена (демо). Теперь можно войти.');
});

document.getElementById('employerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('empTitle').value;
  const industry = document.getElementById('empIndustry').value;
  const salaryFrom = Number(document.getElementById('empSalary').value) || 0;
  const level = document.getElementById('empLevel').value;
  employerVacancies = [{ title, industry, salaryFrom, level, status: 'опубликована' }, ...employerVacancies];
  renderEmployerVacancies();
  event.target.reset();
  showToast('Вакансия добавлена в список работодателя.');
});

employerVacanciesContainer.addEventListener('click', (event) => {
  const btn = event.target.closest('.status-btn');
  if (!btn) return;
  const idx = Number(btn.dataset.index);
  const statusOrder = ['опубликована', 'в работе', 'черновик'];
  const current = employerVacancies[idx].status;
  const next = statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length];
  employerVacancies[idx].status = next;
  renderEmployerVacancies();
});

function showToast(text) {
  const alert = document.createElement('div');
  alert.className = 'alert alert-info mt-3';
  alert.textContent = text;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 2600);
}

if (addResumeBtn && resumeModal) {
  addResumeBtn.addEventListener('click', () => resumeModal.show());
}

const resumeForm = document.getElementById('resumeForm');
if (resumeForm && resumeModal) {
  resumeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Резюме сохранено (демо).');
    resumeForm.reset();
    resumeModal.hide();
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

renderVacancies(vacancies);
renderDetail(null);
renderCandidateApplications();
renderEmployerVacancies();
salaryValue.textContent = `${salaryFilter.value} тыс`;
showSection('vacancy');
