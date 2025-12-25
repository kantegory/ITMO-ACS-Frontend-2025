document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");
    const root = document.documentElement;

    // проверяем сохранённую тему
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
        toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    } else {
        // системная тема
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            root.setAttribute("data-theme", "dark");
            toggleBtn.textContent = "☀️";
        }
    }

    // переключение по кнопке
    toggleBtn.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");

        if (currentTheme === "dark") {
            root.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌙";
        } else {
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "☀️";
        }
    });
});
