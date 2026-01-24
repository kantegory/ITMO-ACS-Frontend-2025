const THEME_KEY = "theme"

function systemTheme() {
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  if (prefersDark) return "dark"

  const forced = window.matchMedia && window.matchMedia("(forced-colors: active)").matches
  if (forced) return "dark"

  return "light"
}


function getSavedTheme() {
  try {
    const rawUser = localStorage.getItem("currentUser")
    if (rawUser) {
      const u = JSON.parse(rawUser)
      if (u && (u.theme === "light" || u.theme === "dark")) return u.theme
    }
  } catch (e) {}
  const t = localStorage.getItem(THEME_KEY)
  if (t === "light" || t === "dark") return t
  return null
}

function applyTheme(theme = null) {
  const finalTheme = theme === "light" || theme === "dark"
    ? theme
    : (getSavedTheme() || systemTheme())

  document.documentElement.dataset.theme = finalTheme

  let meta = document.querySelector('meta[name="color-scheme"]')
  if (!meta) {
    meta = document.createElement("meta")
    meta.name = "color-scheme"
    document.head.appendChild(meta)
  }
  meta.content = "light dark"

  return finalTheme
}

export { applyTheme }
