const API_URL = "http://localhost:8000";
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullname = document.getElementById("fullname").value;
  const phone = document.getElementById("phone").value;
  const city = document.getElementById("city").value;
  const confirm_password = document.getElementById("confirmPassword").value;
    const remember = document.getElementById("remember").checked;

    if (password !== confirm_password) {
        alert('Пароли не совпадают')
    }
    else {
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    fullname: fullname,
                    password: password
                })
            });
            
            const data = await res.json();
            
            const loginRes = await fetch(`${API_URL}/auth/token?email=${email}&password=${password}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                  });

                  const loginData = await loginRes.json();

                  if (loginRes.ok) {
                    if (remember) {
                      localStorage.setItem("token", loginData.access_token);
                      localStorage.setItem("email", email);
                    } else {
                      sessionStorage.setItem("token", loginData.access_token);
                      sessionStorage.setItem("email", email);
                    }
                    alert("Регистрация и вход успешны!");
                    window.location.href = "index.html";
                  } else {
                    alert("Ошибка при входе: " + loginData.detail || loginData.message);
                  }
        } catch (err) {
            console.error(err);
            alert("Сетевая ошибка");
        }
    }
});
