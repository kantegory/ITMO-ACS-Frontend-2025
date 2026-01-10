// Функция для логина
async function login(username, password) {
  const response = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {
    const result = await login(email, password);

    if (result.token) {
      window.location.href = 'index.html';
    } else {
      errorMessage.textContent = result.error || 'Ошибка при входе';
      errorMessage.style.display = 'block';
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    errorMessage.textContent = 'Ошибка соединения с сервером';
    errorMessage.style.display = 'block';
  }
});