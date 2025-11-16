document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
            
    if (password !== confirmPassword) {
        alert('пароли не совпадают!');
        return;
    }
            
    window.location.href = 'login.html'; 
});