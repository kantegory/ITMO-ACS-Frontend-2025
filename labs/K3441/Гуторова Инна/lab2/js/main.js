(function () {
    const forms = document.querySelectorAll('.needs-validation');

    const loginBtn = document.querySelector('button[data-bs-target="#loginModal"]');
    const registerBtn = document.querySelector('button[data-bs-target="#registerModal"]');
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-danger';
    logoutBtn.textContent = 'Выход';
    logoutBtn.style.display = 'none';
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        checkAuth();
        alert('Вы вышли из системы');
    });

    const navContainer = loginBtn.parentElement;
    navContainer.appendChild(logoutBtn);

    function checkAuth() {
        const token = localStorage.getItem("token");
        if (token) {
            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
            logoutBtn.style.display = "inline-block";
        } else {
            loginBtn.style.display = "";
            registerBtn.style.display = "";
            logoutBtn.style.display = "none";
        }
    }

    checkAuth();

    forms.forEach(form => {
        form.addEventListener('submit', async function (event) {
            let isValid = form.checkValidity();

            if (form.id === "registerForm") {
                const pass = document.getElementById("regPassword");
                const confirm = document.getElementById("regConfirm");

                if (pass.value.length < 8) {
                    pass.setCustomValidity("Пароль должен содержать минимум 8 символов");
                    isValid = false;
                } else {
                    pass.setCustomValidity("");
                }

                if (pass.value !== confirm.value) {
                    confirm.setCustomValidity("Пароли не совпадают");
                    isValid = false;
                } else {
                    confirm.setCustomValidity("");
                }
            }

            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();

                try {
                    if (form.id === "registerForm") {
                        const name = document.getElementById("regName").value;
                        const email = document.getElementById("regEmail").value;
                        const password = document.getElementById("regPassword").value;

                        const res = await fetch("http://localhost:3000/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ name, email, password })
                        });

                        const data = await res.json();

                        if (res.ok) {
                            const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
                            modal.hide();
                            form.reset();
                            form.classList.remove('was-validated');
                        } else {
                            alert(data);
                        }

                    } else if (form.id === "loginForm") {
                        const email = document.getElementById("loginEmail").value;
                        const password = document.getElementById("loginPassword").value;

                        const res = await fetch("http://localhost:3000/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email, password })
                        });

                        const data = await res.json();

                        if (res.ok) {
                            localStorage.setItem("token", data.accessToken);
                            localStorage.setItem("user", JSON.stringify({
                                id: data.user.id,
                                name: data.user.name,
                                email: data.user.email
                            }));

                            alert("Вход успешен!");
                            const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
                            modal.hide();
                            form.reset();
                            form.classList.remove('was-validated');
                            checkAuth();
                        } else {
                            alert(data);
                        }
                    }
                } catch (err) {
                    console.error(err);
                    alert("Ошибка соединения с сервером.");
                }
            }

            form.classList.add('was-validated');
        });
    });

    document.getElementById("regPassword").addEventListener("input", () => {
        const pass = document.getElementById("regPassword");
        if (pass.value.length >= 8) pass.setCustomValidity("");
    });

    document.getElementById("regConfirm").addEventListener("input", () => {
        const pass = document.getElementById("regPassword");
        const confirm = document.getElementById("regConfirm");
        if (pass.value === confirm.value) confirm.setCustomValidity("");
    });

})();
