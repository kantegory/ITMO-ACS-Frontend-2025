const API = "/api"

function getToken() {
  return localStorage.getItem("accessToken") || ""
}

async function apiFetch(path, { method = "GET", body = null, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => "")
    throw new Error(txt || `HTTP ${res.status}`)
  }
  return res.json().catch(() => null)
}

export async function loginByName(name) {
  const email = name.trim()
  const password = name.trim()
  const data = await apiFetch("/login", { method: "POST", auth: false, body: { email, password } })
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("currentUser", JSON.stringify(data.user))
  return data.user
}

export async function registerByName(name) {
  const email = name.trim()
  const password = name.trim()
  const data = await apiFetch("/register", { method: "POST", auth: false, body: { email, password, name: email, savedRecipeIds: [], likedRecipeIds: [], theme: "light" } })
  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("currentUser", JSON.stringify(data.user))
  return data.user
}

export async function getRecipes() {
  return apiFetch("/recipes", { auth: false })
}

export async function getRecipe(id) {
  return apiFetch(`/recipes/${id}`, { auth: false })
}

export async function patchMe(patch) {
  const raw = localStorage.getItem("currentUser")
  if (!raw) throw new Error("No user")
  const u = JSON.parse(raw)
  const updated = await apiFetch(`/users/${u.id}`, { method: "PATCH", body: patch, auth: true })
  localStorage.setItem("currentUser", JSON.stringify(updated))
  return updated
}
