const KEY = "theme";

export function applyTheme(theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
  updateIcon(theme)
  localStorage.setItem(KEY, theme);
}

export function initTheme() {
  const saved = localStorage.getItem(KEY) || "system";
  applyTheme(saved);
}

export function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = localStorage.getItem(KEY) || "system";
    const next =
      current === "system" ? "dark" :
        current === "dark" ? "light" :
          "system";

    applyTheme(next);
  });
}

function updateIcon(theme) {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.textContent =
    theme === "dark" ? "🌙" :
      theme === "light" ? "☀️" :
        "🌗";
}

