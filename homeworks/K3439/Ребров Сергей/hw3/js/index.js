$(document).ready(function() {
  var api_url = "http://localhost:3001";

  if ($("#vacancy-list").length) {
    loadVacancies(false);
  }

  if ($("#vacancy-list-full").length) {
    loadVacancies(true);
  }

  if ($("#contact-info").length) {
    loadContactInfo();
  }

  function getAuthToken() {
    return localStorage.getItem('token');
  }

  async function login(email, password) {
    const res = await fetch(api_url + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) throw new Error('Login failed')
  
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data.user
  }

  async function register(name, email, password, role) {
    const res = await fetch(api_url + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role })
    })
    
    const data = await res.json()

    if (!res.ok) throw new Error('Registration failed')
  
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    return data.user
  }

  async function createVacancy(name, company, salary, experience, description, userId) {
    await fetch(api_url + '/vacancies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        name, company, salary, experience, description, userId
      })
    });
  }

  async function deleteVacancy(id) {
    await fetch(api_url + `/vacancies/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
  }

  function getVacancy({ id, name, company, salary, experience }) {
      return `<div class="vacancy-card" data-id="${id}">
          <h5><a href="vacancy.html">${name}</a></h5>
          <p><strong>Компания:</strong> ${company}</p>
          <p><strong>Зарплата:</strong> ${salary}</p>
          <p><strong>Требуемый опыт:</strong> ${experience}</p>
      </div>`
  }

  function getFullVacancy({ id, name, company, salary, experience }) {
      return `<div class="vacancy-card" data-id="${id}">
          <h5><a href="vacancy.html">${name}</a></h5>
          <p><strong>Компания:</strong> ${company}</p>
          <p><strong>Зарплата:</strong> ${salary}</p>
          <p><strong>Требуемый опыт:</strong> ${experience}</p>
          <div>
              <button class="delete-vacancy-btn btn btn-danger btn-sm">Удалить</button>
          </div>
      </div>`
  }

  function getContactInfo({ name, email, role }) {
      return `<div class="row">
          <div class="сol mt-4">
             <div class="resume-section">
                 <h5>Личные данные</h5>
                 <p><strong>Имя:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Роль:</strong> ${role == 1 ? 'Соискатель' : 'Работодатель'}</p>
              </div>
          </div>
      </div>`
  }

  async function loadVacancies(forProfile, searchText) {
    let path = forProfile ? (api_url + `/vacancies?userId=${JSON.parse(localStorage.getItem('user')).id}`) : (api_url + '/vacancies')
    if (searchText) {
      path += `?q=${searchText}`;
    }

    const res = await fetch(path, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    })

    const data = await res.json()

    let html = '';
    for (const x of data) {
      html += forProfile ? getFullVacancy(x) : getVacancy(x) ;
    }

    if (forProfile) {
      $('#vacancy-list-full').html(html);
    } else {
      $('#vacancy-list').html(html);
    }
  }

  async function loadContactInfo() {
    let path = api_url + `/users/${JSON.parse(localStorage.getItem('user')).id}`

    const res = await fetch(path, {
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      }
    })

    const data = await res.json()

    $('#contact-info').html(getContactInfo(data));
  }

  $('#login-form').on('submit', function(e) {
    e.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    login(email, password)
      .then(user => {
        window.location.href = 'search.html';
      })
      .catch(err => {
        alert('Ошибка входа: ' + err.message);
      });
  });

  $('#register-form').on('submit', function(e) {
    e.preventDefault();

    $('#confirm-password').removeClass('is-invalid');

    var name = $('#name').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var confirm = $('#confirm-password').val();
    var role = $('input[name="role"]:checked').val() === 'jobSeeker' ? 1 : 2;

    if (password !== confirm) {
      $('#confirm-password').addClass('is-invalid');
      return;
    }

    register(name, email, password, role)
      .then(user => {
        window.location.href = 'search.html';
      })
      .catch(err => {
        alert('Ошибка входа: ' + err.message);
      });
  });

  $('#logout').on('click', function(e) {
      e.preventDefault();

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      window.location.href = 'login.html';
  });

  $('#search-btn').on('click', function(e) {
      e.preventDefault();

      loadVacancies(false, $('#search-field').val());
  });

  $('#create-vacancy-form').on('submit', function(e) {
    e.preventDefault();

    var name = $('#title').val();
    var company = $('#company').val();
    var salary = $('#salary').val();
    var experience = $('#experience').val();
    var description = $('#description').val();
    var userId = JSON.parse(localStorage.getItem('user')).id

    createVacancy(name, company, salary, experience, description, userId)
      .then(user => {
        $('#create-vacancy-form').closest('.modal').find('.btn-close').click();
        loadVacancies(true);
      })
      .catch(err => {
        alert('Ошибка создания: ' + err.message);
      });
  });

  $(document).on('click', '.delete-vacancy-btn', function(e) {
      e.preventDefault();
      deleteVacancy($(this).closest('.vacancy-card').data('id'))
        .then(user => {
          loadVacancies(true);
        })
        .catch(err => {
          alert('Ошибка удаления: ' + err.message);
        });
  });
});
