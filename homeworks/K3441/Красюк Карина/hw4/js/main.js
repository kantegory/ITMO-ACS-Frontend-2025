import { authAPI, jobsAPI, resumesAPI, applicationsAPI } from './api.js';
import { themeManager } from './theme.js';

(() => {
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
})();

function showMessage(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}

async function loadJobs() {
  const jobsList = document.getElementById('jobsList');
  if (!jobsList) return;

  try {
    const jobs = await jobsAPI.getAll();
    jobsList.innerHTML = '';

    if (jobs.length === 0) {
      jobsList.innerHTML = '<div class="list-group-item text-center text-muted">Вакансии не найдены</div>';
      const countLabel = document.getElementById('resultsCount');
      if (countLabel) countLabel.textContent = 'Найдено: 0 вакансий';
      return;
    }

    jobs.forEach((job) => {
      const jobItem = document.createElement('a');
      jobItem.href = `job-detail.html?id=${job.id}`;
      jobItem.className = 'list-group-item list-group-item-action job-item';
      jobItem.setAttribute('data-industry', job.industry);
      jobItem.setAttribute('data-experience', job.experience);
      jobItem.setAttribute('data-salary', job.salary);

      const publishedDate = new Date(job.publishedAt);
      const today = new Date();
      const diffDays = Math.floor((today - publishedDate) / (1000 * 60 * 60 * 24));
      let dateText = 'сегодня';
      if (diffDays === 1) dateText = 'вчера';
      else if (diffDays > 1) dateText = `${diffDays} дня назад`;

      const industryLabels = {
        it: 'IT',
        marketing: 'Маркетинг',
        finance: 'Финансы',
        sales: 'Продажи',
      };

      const expLabels = {
        junior: '0–1 год',
        middle: '1–3 года',
        senior: '3+ года',
      };

      jobItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <div>
            <h5 class="mb-1">${job.title}</h5>
            <p class="mb-1 text-muted">${job.company} • ${job.location} • ${job.employmentType}</p>
            <span class="badge bg-primary me-1">${industryLabels[job.industry] || job.industry}</span>
            <span class="badge bg-secondary me-1">${expLabels[job.experience] || job.experience}</span>
          </div>
          <div class="text-end">
            <div class="h5 mb-1">от ${job.salary.toLocaleString('ru-RU')} ₽</div>
            <small class="text-muted">Опубликовано: ${dateText}</small>
          </div>
        </div>
      `;
      jobsList.appendChild(jobItem);
    });

    const countLabel = document.getElementById('resultsCount');
    if (countLabel) {
      const word = jobs.length === 1 ? 'вакансия' : jobs.length > 1 && jobs.length < 5 ? 'вакансии' : 'вакансий';
      countLabel.textContent = `Найдено: ${jobs.length} ${word}`;
    }

    applyFilters();
  } catch (error) {
    console.error('Ошибка загрузки вакансий:', error);
    const errorMessage = error.message || 'Ошибка загрузки вакансий';
    
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
      jobsList.innerHTML = `
        <div class="list-group-item text-center">
          <div class="alert alert-warning mb-0" role="alert">
            <strong>Сервер не запущен</strong><br>
            <small>Убедитесь, что json-server запущен на порту 3000. Запустите команду:<br>
            <code>npx json-server --watch db.json --port 3000</code></small>
          </div>
        </div>
      `;
    } else {
      jobsList.innerHTML = `
        <div class="list-group-item text-center">
          <div class="alert alert-danger mb-0" role="alert">
            <strong>Ошибка загрузки вакансий</strong><br>
            <small>${errorMessage}</small>
          </div>
        </div>
      `;
    }
    
    const countLabel = document.getElementById('resultsCount');
    if (countLabel) countLabel.textContent = 'Ошибка загрузки';
    showMessage('Ошибка загрузки вакансий: ' + errorMessage, 'error');
  }
}

let jobItems = [];
function applyFilters() {
  const industrySelect = document.getElementById('filterIndustry');
  const expSelect = document.getElementById('filterExperience');
  const salaryInput = document.getElementById('filterSalary');
  const keywordInput = document.getElementById('searchKeyword');
  const countLabel = document.getElementById('resultsCount');

  const industry = industrySelect ? industrySelect.value : '';
  const exp = expSelect ? expSelect.value : '';
  const salary = salaryInput && salaryInput.value ? Number(salaryInput.value) : 0;
  const keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';

  let visibleCount = 0;

  jobItems.forEach((item) => {
    const itemIndustry = item.getAttribute('data-industry') || '';
    const itemExp = item.getAttribute('data-experience') || '';
    const itemSalary = Number(item.getAttribute('data-salary') || 0);
    const text = item.innerText.toLowerCase();

    let match = true;

    if (industry && industry !== itemIndustry) match = false;
    if (exp && exp !== itemExp) match = false;
    if (salary && itemSalary < salary) match = false;
    if (keyword && !text.includes(keyword)) match = false;

    item.style.display = match ? '' : 'none';
    if (match) visibleCount += 1;
  });

  if (countLabel) {
    const word = visibleCount === 1 ? 'вакансия' : visibleCount > 1 && visibleCount < 5 ? 'вакансии' : 'вакансий';
    countLabel.textContent = `Найдено: ${visibleCount} ${word}`;
  }
}

function initLoginForms() {
  const candidateForms = document.querySelectorAll('form[data-role="candidate-login"]');
  candidateForms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;

      try {
        const data = await authAPI.login(email, password, 'candidate');
        showMessage('Успешный вход!');
        setTimeout(() => {
          window.location.href = 'user-dashboard.html';
        }, 500);
      } catch (error) {
        showMessage(error.message || 'Ошибка входа', 'error');
      }
    });
  });

  const employerForms = document.querySelectorAll('form[data-role="employer-login"]');
  employerForms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      const email = form.querySelector('input[type="email"]').value;
      const password = form.querySelector('input[type="password"]').value;

      try {
        const data = await authAPI.login(email, password, 'employer');
        showMessage('Успешный вход!');
        setTimeout(() => {
          window.location.href = 'employer-dashboard.html';
        }, 500);
      } catch (error) {
        showMessage(error.message || 'Ошибка входа', 'error');
      }
    });
  });
}

function initRegisterForms() {
  const candidateForm = document.querySelector('#reg-candidate form');
  if (candidateForm) {
    candidateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!candidateForm.checkValidity()) {
        e.stopPropagation();
        candidateForm.classList.add('was-validated');
        return;
      }

      const inputs = candidateForm.querySelectorAll('input');
      const name = inputs[0].value;
      const email = inputs[1].value;
      const password = inputs[2].value;
      const position = inputs[3]?.value || '';

      try {
        await authAPI.register({
          email,
          password,
          role: 'candidate',
          name,
          position,
          city: 'Москва',
        });
        showMessage('Регистрация успешна! Выполняется вход...');
        setTimeout(async () => {
          await authAPI.login(email, password, 'candidate');
          window.location.href = 'user-dashboard.html';
        }, 1000);
      } catch (error) {
        showMessage(error.message || 'Ошибка регистрации', 'error');
      }
    });
  }

  const employerForm = document.querySelector('#reg-employer form');
  if (employerForm) {
    employerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!employerForm.checkValidity()) {
        e.stopPropagation();
        employerForm.classList.add('was-validated');
        return;
      }

      const inputs = employerForm.querySelectorAll('input, select');
      const companyName = inputs[0].value;
      const email = inputs[1].value;
      const password = inputs[2].value;
      const industry = inputs[3].value;

      try {
        await authAPI.register({
          email,
          password,
          role: 'employer',
          companyName,
          industry,
          city: 'Москва',
        });
        showMessage('Регистрация успешна! Выполняется вход...');
        setTimeout(async () => {
          await authAPI.login(email, password, 'employer');
          window.location.href = 'employer-dashboard.html';
        }, 1000);
      } catch (error) {
        showMessage(error.message || 'Ошибка регистрации', 'error');
      }
    });
  }
}

async function loadJobDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  if (!jobId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const job = await jobsAPI.getById(jobId);
    
    document.querySelector('h1.h3').textContent = job.title;
    document.querySelector('.text-muted.mb-2').textContent = 
      `${job.company} • ${job.location} • ${job.employmentType}`;
    document.querySelector('.h4.mb-1').textContent = `от ${job.salary.toLocaleString('ru-RU')} ₽`;
    
    const descriptionEl = document.querySelector('h5.mt-4.mb-2');
    if (descriptionEl && descriptionEl.nextElementSibling) {
      descriptionEl.nextElementSibling.textContent = job.description;
    }

    const responsibilitiesEl = document.querySelector('h5.mt-4.mb-2 + ul');
    if (responsibilitiesEl && job.responsibilities) {
      responsibilitiesEl.innerHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');
    }

    const requirementsEl = document.querySelectorAll('h5.mt-4.mb-2 + ul')[1];
    if (requirementsEl && job.requirements) {
      requirementsEl.innerHTML = job.requirements.map(r => `<li>${r}</li>`).join('');
    }

    const conditionsEl = document.querySelectorAll('h5.mt-4.mb-2 + ul')[2];
    if (conditionsEl && job.conditions) {
      conditionsEl.innerHTML = job.conditions.map(c => `<li>${c}</li>`).join('');
    }

    const applyBtn = document.querySelector('[data-bs-target="#applyModal"]');
    const applyModalBody = document.getElementById('applyModalBody');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const user = authAPI.getCurrentUser();
        if (user && user.role === 'candidate') {
          if (applyModalBody) {
            applyModalBody.innerHTML = `
              <p class="mb-3">Вы хотите откликнуться на вакансию "${job.title}"?</p>
              <button id="confirmApplyBtn" class="btn btn-primary w-100">Откликнуться</button>
            `;
            const confirmBtn = document.getElementById('confirmApplyBtn');
            if (confirmBtn) {
              confirmBtn.addEventListener('click', async () => {
                try {
                  await applicationsAPI.create(jobId);
                  showMessage('Отклик успешно отправлен!');
                  const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
                  if (modal) modal.hide();
                } catch (error) {
                  showMessage(error.message || 'Ошибка отправки отклика', 'error');
                }
              });
            }
          }
        } else {
          if (applyModalBody) {
            applyModalBody.innerHTML = `
              <p class="small text-muted">
                Чтобы откликнуться, войдите в личный кабинет соискателя или зарегистрируйтесь.
              </p>
              <div class="d-flex gap-2">
                <a href="login.html" class="btn btn-primary flex-grow-1">Войти</a>
                <a href="register.html" class="btn btn-outline-secondary flex-grow-1">Регистрация</a>
              </div>
            `;
          }
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки вакансии:', error);
    showMessage('Ошибка загрузки вакансии', 'error');
  }
}

async function loadUserDashboard() {
  const user = authAPI.getCurrentUser();
  if (!user || user.role !== 'candidate') {
    window.location.href = 'login.html';
    return;
  }

  // Обновляем имя в навбаре
  const navUser = document.querySelector('.navbar .text-light span');
  if (navUser) navUser.textContent = `Соискатель: ${user.name}`;

  const headerName = document.querySelector('.dashboard-header h2');
  if (headerName) headerName.textContent = user.name;
  const headerPosition = document.querySelector('.dashboard-header .small');
  if (headerPosition) headerPosition.textContent = `${user.position || ''} • ${user.city || ''}`;

  try {
    const resume = await resumesAPI.getByUserId(user.id);
    if (resume) {
      const positionEl = document.querySelector('.resume-block-title + div');
      if (positionEl) positionEl.textContent = resume.position || 'Не указано';

      const salaryEl = document.querySelectorAll('.resume-block-title + div')[1];
      if (salaryEl) salaryEl.textContent = resume.salary ? `от ${resume.salary.toLocaleString('ru-RU')} ₽` : 'Не указано';

      const employmentEl = document.querySelectorAll('.resume-block-title + div')[2];
      if (employmentEl) employmentEl.textContent = resume.employmentType || 'Не указано';

      const skillsContainer = document.querySelector('.badge.bg-primary')?.parentElement;
      if (skillsContainer && resume.skills) {
        skillsContainer.innerHTML = resume.skills.map(skill => 
          `<span class="badge bg-primary me-1">${skill}</span>`
        ).join('');
      }

      if (resume.experience && resume.experience.length > 0) {
        const expEl = document.querySelector('.fw-semibold.mb-1');
        if (expEl) {
          const exp = resume.experience[0];
          expEl.textContent = `${exp.position} — ${exp.company}`;
          const expDesc = expEl.nextElementSibling;
          if (expDesc) expDesc.textContent = `${exp.period} • ${exp.description}`;
        }
      }

      const eduEl = document.querySelector('.mb-0:last-child');
      if (eduEl && resume.education) eduEl.textContent = resume.education;
    }

    const applications = await applicationsAPI.getByUserId(user.id);
    const applicationsList = document.querySelector('.list-group.list-group-flush');
    if (applicationsList && applications.length > 0) {
      applicationsList.innerHTML = '';
      for (const app of applications) {
        const job = await jobsAPI.getById(app.jobId);
        const statusLabels = {
          pending: { text: 'Рассматривается', class: 'text-bg-warning' },
          invited: { text: 'Приглашение на собеседование', class: 'text-bg-success' },
          rejected: { text: 'Отклонено', class: 'text-bg-danger' },
        };
        const status = statusLabels[app.status] || { text: app.status, class: 'text-bg-secondary' };

        const item = document.createElement('a');
        item.href = `job-detail.html?id=${job.id}`;
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
          <div class="d-flex w-100 justify-content-between">
            <div>
              <h6 class="mb-1">${job.title}</h6>
              <small class="text-muted">${job.company} • ${job.location}</small>
            </div>
            <span class="badge rounded-pill ${status.class} align-self-start">${status.text}</span>
          </div>
        `;
        applicationsList.appendChild(item);
      }
    }

    const editResumeForm = document.querySelector('#editResumeModal form');
    if (editResumeForm) {
      editResumeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!editResumeForm.checkValidity()) {
          e.stopPropagation();
          editResumeForm.classList.add('was-validated');
          return;
        }

        const inputs = editResumeForm.querySelectorAll('input, textarea');
        const position = inputs[0].value;
        const salary = Number(inputs[1].value) || 0;
        const city = inputs[2].value;
        const skills = inputs[3].value.split(',').map(s => s.trim()).filter(s => s);
        const about = inputs[4].value;

        try {
          if (resume) {
            await resumesAPI.update(resume.id, {
              position,
              salary,
              city,
              skills,
              about,
            });
          } else {
            await resumesAPI.create({
              userId: user.id,
              position,
              salary,
              city,
              skills,
              about,
              employmentType: 'Полная',
              experience: [],
              education: '',
              isVisible: true,
            });
          }
          showMessage('Резюме успешно обновлено!');
          const modal = bootstrap.Modal.getInstance(document.getElementById('editResumeModal'));
          if (modal) modal.hide();
          setTimeout(() => location.reload(), 1000);
        } catch (error) {
          showMessage(error.message || 'Ошибка сохранения резюме', 'error');
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

async function loadEmployerDashboard() {
  const user = authAPI.getCurrentUser();
  if (!user || user.role !== 'employer') {
    window.location.href = 'login.html';
    return;
  }

  // Обновляем имя в навбаре
  const navUser = document.querySelector('.navbar .text-light span');
  if (navUser) navUser.textContent = `Работодатель: ${user.companyName}`;

  const headerName = document.querySelector('.dashboard-header h2');
  if (headerName) headerName.textContent = user.companyName;
  const headerPosition = document.querySelector('.dashboard-header .small');
  if (headerPosition) headerPosition.textContent = `${user.industry || ''} • ${user.city || ''}`;

  try {
    const allJobs = await jobsAPI.getAll();
    const myJobs = allJobs.filter(job => job.employerId === user.id);
    const jobsList = document.querySelector('.list-group.list-group-flush');
    
    if (jobsList) {
      jobsList.innerHTML = '';
      if (myJobs.length === 0) {
        jobsList.innerHTML = '<div class="list-group-item text-center text-muted">У вас пока нет вакансий</div>';
      } else {
        myJobs.forEach((job) => {
          const item = document.createElement('a');
          item.href = `job-detail.html?id=${job.id}`;
          item.className = 'list-group-item list-group-item-action';
          const statusLabels = {
            active: { text: 'Активна', class: 'text-bg-success' },
            paused: { text: 'На паузе', class: 'text-bg-secondary' },
            closed: { text: 'Закрыта', class: 'text-bg-danger' },
          };
          const status = statusLabels[job.status] || { text: job.status, class: 'text-bg-secondary' };

          item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
              <div>
                <h6 class="mb-1">${job.title}</h6>
                <small class="text-muted">${job.location} • от ${job.salary.toLocaleString('ru-RU')} ₽</small>
              </div>
              <div class="text-end">
                <span class="badge ${status.class} status-badge mb-1">${status.text}</span>
                <div class="small text-muted">Откликов: ${job.applicationsCount || 0}</div>
              </div>
            </div>
          `;
          jobsList.appendChild(item);
        });
      }
    }

    const allApplications = await fetch('http://localhost:3000/applications').then(r => r.json());
    const myJobIds = myJobs.map(j => j.id);
    const myApplications = allApplications.filter(app => myJobIds.includes(app.jobId));
    
    const applicationsTable = document.querySelector('table tbody');
    if (applicationsTable) {
      applicationsTable.innerHTML = '';
      if (myApplications.length === 0) {
        applicationsTable.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Нет откликов</td></tr>';
      } else {
        for (const app of myApplications) {
          try {
            const appUser = await fetch(`http://localhost:3000/users/${app.userId}`).then(r => r.json());
            const job = await jobsAPI.getById(app.jobId);
            const statusLabels = {
              pending: { text: 'Новый', class: 'text-bg-warning' },
              invited: { text: 'Приглашён', class: 'text-bg-success' },
              rejected: { text: 'Отклонён', class: 'text-bg-danger' },
            };
            const status = statusLabels[app.status] || { text: app.status, class: 'text-bg-secondary' };

            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${appUser.name || appUser.companyName}</td>
              <td>${job.title}</td>
              <td><span class="badge ${status.class} status-badge">${status.text}</span></td>
            `;
            applicationsTable.appendChild(row);
          } catch (error) {
            console.error('Ошибка загрузки отклика:', error);
          }
        }
      }
    }

    const newVacancyForm = document.querySelector('#newVacancyModal form');
    if (newVacancyForm) {
      newVacancyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!newVacancyForm.checkValidity()) {
          e.stopPropagation();
          newVacancyForm.classList.add('was-validated');
          return;
        }

        const inputs = newVacancyForm.querySelectorAll('input, select, textarea');
        const title = inputs[0].value;
        const salary = Number(inputs[1].value) || 0;
        const location = inputs[2].value;
        const industry = inputs[3].value.toLowerCase();
        const experience = inputs[4].value.toLowerCase();
        const description = inputs[5].value;

        try {
          await jobsAPI.create({
            title,
            company: user.companyName,
            location,
            salary,
            industry,
            experience,
            employmentType: 'Полная занятость',
            workFormat: 'Офис',
            description,
            responsibilities: [],
            requirements: [],
            conditions: [],
          });
          showMessage('Вакансия успешно создана!');
          const modal = bootstrap.Modal.getInstance(document.getElementById('newVacancyModal'));
          if (modal) modal.hide();
          newVacancyForm.reset();
          setTimeout(() => location.reload(), 1000);
        } catch (error) {
          showMessage(error.message || 'Ошибка создания вакансии', 'error');
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

function initLogout() {
  const logoutButtons = document.querySelectorAll('a[href="login.html"]');
  logoutButtons.forEach((btn) => {
    if (btn.textContent.includes('Выйти')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        authAPI.logout();
        window.location.href = 'login.html';
      });
    }
  });
}

function initFeedbackForm() {
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!feedbackForm.checkValidity()) {
        e.stopPropagation();
        feedbackForm.classList.add('was-validated');
        return;
      }

      showMessage('Спасибо за обратную связь! Мы свяжемся с вами в ближайшее время.');
      const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
      if (modal) modal.hide();
      feedbackForm.reset();
    });
  }
}

function initResetPasswordForm() {
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!resetPasswordForm.checkValidity()) {
        e.stopPropagation();
        resetPasswordForm.classList.add('was-validated');
        return;
      }

      showMessage('Ссылка для восстановления пароля отправлена на ваш email.');
      const modal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
      if (modal) modal.hide();
      resetPasswordForm.reset();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLoginForms();
  initRegisterForms();
  initLogout();
  initFeedbackForm();
  initResetPasswordForm();

  if (document.getElementById('jobsList')) {
    loadJobs().then(() => {
      const jobsList = document.getElementById('jobsList');
      if (jobsList) {
        jobItems = Array.from(jobsList.querySelectorAll('.job-item'));
        
        const industrySelect = document.getElementById('filterIndustry');
        const expSelect = document.getElementById('filterExperience');
        const salaryInput = document.getElementById('filterSalary');
        const keywordInput = document.getElementById('searchKeyword');
        const resetBtn = document.getElementById('resetFilters');
        const mainSearchForm = document.getElementById('mainSearchForm');
        const heroForm = document.getElementById('hero-search-form');

        industrySelect && industrySelect.addEventListener('change', applyFilters);
        expSelect && expSelect.addEventListener('change', applyFilters);
        salaryInput && salaryInput.addEventListener('input', applyFilters);
        keywordInput && keywordInput.addEventListener('input', applyFilters);

        if (resetBtn) {
          resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (industrySelect) industrySelect.value = '';
            if (expSelect) expSelect.value = '';
            if (salaryInput) salaryInput.value = '';
            if (keywordInput) keywordInput.value = '';
            applyFilters();
          });
        }

        if (mainSearchForm) {
          mainSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            applyFilters();
          });
        }

        if (heroForm) {
          heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const heroKeyword = document.getElementById('heroKeyword');
            if (heroKeyword && keywordInput) {
              keywordInput.value = heroKeyword.value;
              applyFilters();
              const target = document.getElementById('search-block');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        }
      }
    });
  }

  if (window.location.pathname.includes('job-detail.html')) {
    loadJobDetail();
  }

  if (window.location.pathname.includes('user-dashboard.html')) {
    loadUserDashboard();
  }

  if (window.location.pathname.includes('employer-dashboard.html')) {
    loadEmployerDashboard();
  }
});
