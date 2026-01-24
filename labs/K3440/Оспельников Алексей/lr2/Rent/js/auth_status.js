function updateNav() {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const navLogin = document.getElementById("navLogin");
    const navRegister = document.getElementById("navRegister");
    const navProfile = document.getElementById("navProfile");

    if (token) {
        navLogin.style.display = "none";
        navRegister.style.display = "none";
        navProfile.style.display = "block";
    } else {
        navLogin.style.display = "block";
        navRegister.style.display = "block";
        navProfile.style.display = "none";
    }
}

updateNav();
