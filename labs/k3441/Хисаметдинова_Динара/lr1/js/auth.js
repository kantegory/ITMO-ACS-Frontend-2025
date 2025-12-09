document.addEventListener('DOMContentLoaded', function() {
    initializeAuthForms();
    initializeValidation();
});

function initializeAuthForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
        emailInput.addEventListener('input', debounce(validateEmail, 500));
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
}

function initializeValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordInput) {
        passwordInput.addEventListener('input', debounce(checkPasswordStrength, 300));
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', debounce(checkPasswordMatch, 300));
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showAlert('Please fill in all required fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    toggleLoginLoading(true);

    setTimeout(() => {
        toggleLoginLoading(false);

        if (email && password) {
            const userData = {
                email: email,
                isLoggedIn: true,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            localStorage.setItem('user', JSON.stringify(userData));

            showAlert('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } else {
            showAlert('Invalid email or password', 'danger');
        }
    }, 2000);
}

function handleRegister(e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        userType: document.getElementById('userType').value,
        agreeTerms: document.getElementById('agreeTerms').checked,
        agreeMarketing: document.getElementById('agreeMarketing').checked
    };

    if (!validateRegistrationForm(formData)) {
        return;
    }

    toggleRegisterLoading(true);

    setTimeout(() => {
        toggleRegisterLoading(false);

        const userData = {
            ...formData,
            isLoggedIn: true,
            registrationTime: new Date().toISOString()
        };
        delete userData.password;
        delete userData.confirmPassword;

        localStorage.setItem('user', JSON.stringify(userData));

        showAlert('Account created successfully! Welcome to RentAparts!', 'success');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }, 2500);
}

function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('resetEmail').value;

    if (!email || !isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    setTimeout(() => {
        showAlert('Password reset link sent to your email!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
    }, 1000);
}

function validateRegistrationForm(data) {
    if (!data.firstName || !data.lastName || !data.email || !data.phone ||
        !data.password || !data.confirmPassword || !data.userType) {
        showAlert('Please fill in all required fields', 'danger');
        return false;
    }

    if (!isValidEmail(data.email)) {
        showAlert('Please enter a valid email address', 'danger');
        return false;
    }

    if (!isValidPhone(data.phone)) {
        showAlert('Please enter a valid phone number', 'danger');
        return false;
    }

    if (!isStrongPassword(data.password)) {
        showAlert('Password must meet the strength requirements', 'danger');
        return false;
    }

    if (data.password !== data.confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return false;
    }

    if (!data.agreeTerms) {
        showAlert('You must agree to the Terms of Service and Privacy Policy', 'danger');
        return false;
    }

    return true;
}

function validateEmail() {
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('emailFeedback');

    if (!feedback) return;

    if (!email) {
        feedback.textContent = '';
        feedback.className = 'form-text';
        return;
    }

    if (isValidEmail(email)) {
        feedback.textContent = 'Email format is valid';
        feedback.className = 'form-text text-success';
    } else {
        feedback.textContent = 'Please enter a valid email address';
        feedback.className = 'form-text text-danger';
    }
}

function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('passwordStrength');

    if (!strengthBar || !password) {
        if (strengthBar) strengthBar.style.width = '0%';
        return;
    }

    const strength = getPasswordStrength(password);

    strengthBar.style.width = strength.percentage + '%';
    strengthBar.className = `password-strength ${strength.class}`;
}

function checkPasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const feedback = document.getElementById('passwordMatchFeedback');

    if (!feedback) return;

    if (!confirmPassword) {
        feedback.textContent = '';
        feedback.className = 'form-text';
        return;
    }

    if (password === confirmPassword) {
        feedback.textContent = 'Passwords match';
        feedback.className = 'form-text text-success';
    } else {
        feedback.textContent = 'Passwords do not match';
        feedback.className = 'form-text text-danger';
    }
}

function getPasswordStrength(password) {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('at least 8 characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letter');

    if (/\d/.test(password)) score += 1;
    else feedback.push('number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
    else feedback.push('special character');

    if (score <= 2) {
        return { percentage: 25, class: 'strength-weak', feedback: feedback };
    } else if (score <= 4) {
        return { percentage: 60, class: 'strength-medium', feedback: feedback };
    } else {
        return { percentage: 100, class: 'strength-strong', feedback: [] };
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 10) {
        value = value.substring(0, 10);
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '+1 ($1) $2-$3');
    } else if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '+1 ($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d+)/, '+1 ($1) $2');
    } else if (value.length > 0) {
        value = '+1 (' + value;
    }

    e.target.value = value;
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePasswordIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function toggleLoginLoading(loading) {
    const loginText = document.querySelector('.login-text');
    const loginSpinner = document.querySelector('.login-spinner');
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');

    if (loading) {
        loginText.classList.add('d-none');
        loginSpinner.classList.remove('d-none');
        submitBtn.disabled = true;
    } else {
        loginText.classList.remove('d-none');
        loginSpinner.classList.add('d-none');
        submitBtn.disabled = false;
    }
}

function toggleRegisterLoading(loading) {
    const registerText = document.querySelector('.register-text');
    const registerSpinner = document.querySelector('.register-spinner');
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');

    if (loading) {
        registerText.classList.add('d-none');
        registerSpinner.classList.remove('d-none');
        submitBtn.disabled = true;
    } else {
        registerText.classList.remove('d-none');
        registerSpinner.classList.add('d-none');
        submitBtn.disabled = false;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function isStrongPassword(password) {
    const strength = getPasswordStrength(password);
    return strength.feedback.length === 0;
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} custom-alert position-fixed`;
    alert.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;

    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function getAlertIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        case 'info':
        default: return 'info-circle';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}