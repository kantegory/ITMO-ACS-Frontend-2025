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
  const el = document.getElementById("themeToggle");
  if (!el) return;

  el.addEventListener("click", (e) => {
    e.preventDefault();

    const current = localStorage.getItem(KEY) || "system";
    const next =
      current === "system" ? "dark" :
        current === "dark" ? "light" :
          "system";

    applyTheme(next);
  });
}

function updateIcon(theme) {
  const el = document.getElementById("themeToggle");
  if (!el) return;

  const useEl = el.querySelector("use");
  if (!useEl) return;

  const href =
    theme === "dark"
      ? "/img/dark-mode.svg#icon-moon"
      : theme === "light"
        ? "/img/light.svg#icon-light"
        : "/img/day-night.svg#icon-theme";

  useEl.setAttribute("href", href);
  useEl.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", href); // Safari
}



