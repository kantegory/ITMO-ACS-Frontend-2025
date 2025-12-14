function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

function isAuthenticated() {
  return getCurrentUser() !== null;
}

function saveAuthData(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  if (password.length < 6) {
    return {
      valid: false,
      message: 'Пароль должен содержать минимум 6 символов'
    };
  }
  return { valid: true, message: '' };
}

function validateName(name) {
  return name.trim().length >= 2;
}

function showError(inputElement, errorElement, message) {
  if (!inputElement || !errorElement) return;
  inputElement.classList.add('error');
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
}

function clearError(inputElement, errorElement) {
  if (!inputElement || !errorElement) return;
  inputElement.classList.remove('error');
  errorElement.textContent = '';
  errorElement.classList.add('d-none');
}

if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    // email
    if (!email) {
      showError(emailInput, emailError, 'Пожалуйста, введите email');
      hasError = true;
    } else if (!validateEmail(email)) {
      showError(emailInput, emailError, 'Некорректный формат email');
      hasError = true;
    }

    // пароль
    if (!password) {
      showError(passwordInput, passwordError, 'Пожалуйста, введите пароль');
      hasError = true;
    } else {
      const { valid, message } = validatePassword(password);
      if (!valid) {
        showError(passwordInput, passwordError, message);
        hasError = true;
      }
    }

    if (hasError) return;

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        // json-server-auth отдает 400 при неверных данных[web:4][web:12]
        showError(
          passwordInput,
          passwordError,
          'Неверный email или пароль'
        );
        return;
      }

      const data = await response.json(); // { accessToken, user }[web:4][web:12]

      saveAuthData(data.accessToken, data.user);

      console.log('Успешный вход:', data.user.email);
      window.location.href = 'catalog.html';
    } catch (error) {
      console.error('Ошибка при входе:', error);
      showError(
        passwordInput,
        passwordError,
        'Произошла ошибка при входе. Попробуйте позже.'
      );
    }
  });
}


if (document.getElementById('registerForm')) {
    console.log('registerForm найден, навешиваем обработчик');  
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const passwordConfirmError =
      document.getElementById('passwordConfirmError');

    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(passwordInput, passwordError);
    clearError(passwordConfirmInput, passwordConfirmError);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    let hasError = false;

    // имя
    if (!name) {
      showError(nameInput, nameError, 'Пожалуйста, введите имя');
      hasError = true;
    } else if (!validateName(name)) {
      showError(nameInput, nameError, 'Имя должно содержать минимум 2 символа');
      hasError = true;
    }

    // email
    if (!email) {
      showError(emailInput, emailError, 'Пожалуйста, введите email');
      hasError = true;
    } else if (!validateEmail(email)) {
      showError(emailInput, emailError, 'Некорректный формат email');
      hasError = true;
    }

    // пароль
    if (!password) {
      showError(passwordInput, passwordError, 'Пожалуйста, введите пароль');
      hasError = true;
    } else {
      const { valid, message } = validatePassword(password);
      if (!valid) {
        showError(passwordInput, passwordError, message);
        hasError = true;
      }
    }

    // подтверждение пароля
    if (!passwordConfirm) {
      showError(
        passwordConfirmInput,
        passwordConfirmError,
        'Повторите пароль'
      );
      hasError = true;
    } else if (password !== passwordConfirm) {
      showError(
        passwordConfirmInput,
        passwordConfirmError,
        'Пароли не совпадают'
      );
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, name })
      });

      if (!response.ok) {
        // 400 при уже существующем email и др. ошибках[web:4][web:12]
        if (response.status === 400) {
          showError(
            emailInput,
            emailError,
            'Пользователь с таким email уже существует'
          );
        } else {
          showError(
            emailInput,
            emailError,
            'Ошибка регистрации. Попробуйте позже.'
          );
        }
        return;
      }

      const data = await response.json(); // { accessToken, user }[web:4][web:12]

      saveAuthData(data.accessToken, data.user);

      console.log('Успешная регистрация:', data.user.email);
      alert('Регистрация прошла успешно!');
      window.location.href = 'catalog.html';
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      showError(
        emailInput,
        emailError,
        'Произошла ошибка при регистрации. Попробуйте позже.'
      );
    }
  });
}

// если есть кнопка выхода с id="logoutBtn"
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    clearAuthData();
    window.location.href = 'login.html';
  });
}
