document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    const authOnlyElements = document.querySelectorAll(".auth-only");

    if (!user) {
        authOnlyElements.forEach(el => el.style.display = "none");
    } else {
        authOnlyElements.forEach(el => el.style.display = "");
    }
});
