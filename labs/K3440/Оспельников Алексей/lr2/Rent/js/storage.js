document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const profileButton = document.getElementById('profileButton');

  if (token) {
    if (loginButton) {
      loginButton.style.display = 'none';
    }
    if (registerButton) {
      registerButton.style.display = 'none';
    }
    if (profileButton) {
      profileButton.style.display = 'block';
    }
  } else {
    if (loginButton) {
      loginButton.style.display = 'block';
    }
    if (registerButton) {
      registerButton.style.display = 'block';
    }
    if (profileButton) {
      profileButton.style.display = 'none';
    }
  }

});