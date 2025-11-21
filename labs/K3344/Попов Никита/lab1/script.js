const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');

loginBtn.addEventListener('click', () => loginModal.show());
registerBtn.addEventListener('click', () => registerModal.show());

closeLogin.addEventListener('click', () => loginModal.hide());
closeRegister.addEventListener('click', () => registerModal.hide());