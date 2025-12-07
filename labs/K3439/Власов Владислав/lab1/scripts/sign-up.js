const password = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const passwordError = document.getElementById('passwordError');

function validatePassword() {
    console.log('asdasdas')
}

document.getElementById('logIn').onclick = () => {
    if (password.value !== confirmPassword.value) {
        passwordError.classList.remove('d-none')
    } else {
        passwordError.classList.add('d-none')
        window.location.href = 'characters.html';
    }

};