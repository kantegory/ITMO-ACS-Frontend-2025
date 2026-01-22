const API_URL = "http://localhost:8000";
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  try {
    const res = await fetch(`${API_URL}/auth/token?email=${email}&password=${password}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("email", email);
      }
      alert("Вход успешен!");
      window.location.href = "index.html";
    } else {
      alert("Ошибка: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Сетевая ошибка");
  }
});
