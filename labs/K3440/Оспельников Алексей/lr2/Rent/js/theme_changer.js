const themeToggleBtn = document.getElementById("themeToggle");

let currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
updateButtonText();

themeToggleBtn.addEventListener("click", () => {
  currentTheme = (currentTheme === "light") ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateButtonText();
});

function updateButtonText() {
  themeToggleBtn.textContent = (currentTheme === "light") ? "Тёмная тема" : "Светлая тема";
}
