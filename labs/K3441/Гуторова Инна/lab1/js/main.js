(function () {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
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
                const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
                modal.hide();
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