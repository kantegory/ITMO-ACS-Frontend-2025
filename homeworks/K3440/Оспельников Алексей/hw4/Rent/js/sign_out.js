
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");
}

document.getElementById("sign-out").addEventListener("click", (e) => {
    logout();
    window.location.href = "../index.html";
});

