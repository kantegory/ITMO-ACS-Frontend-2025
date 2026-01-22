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

export async function loginByName(username) {
  const email = `${encodeURIComponent(username)}@local.user`
  const password = username

  const data = await apiFetch("/login", {
    method: "POST",
    auth: false,
    body: { email, password }
  })

  localStorage.setItem("accessToken", data.accessToken)
  localStorage.setItem("currentUser", JSON.stringify(data.user))
  return data.user
}

export async function registerByName(username) {
  const email = `${encodeURIComponent(username)}@local.user`
  const password = username

  const data = await apiFetch("/register", {
    method: "POST",
    auth: false,
    body: {
      email,
      password,
      name: username,
      theme: "light",
      subscriptions: [],
      savedRecipeIds: [],
      likedRecipeIds: []
    }
  })

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

export async function getMe() {
  const raw = localStorage.getItem("currentUser")
  if (!raw) throw new Error("No user")
  const u = JSON.parse(raw)
  const me = await apiFetch(`/users/${u.id}`, { auth: true })
  localStorage.setItem("currentUser", JSON.stringify(me))
  return me
}

export async function getUser(id) {
  return apiFetch(`/users/${id}`, { auth: false })
}

export async function toggleSubscription(authorId) {
  const raw = localStorage.getItem("currentUser")
  if (!raw) throw new Error("No user")
  const me = JSON.parse(raw)

  const current = Array.isArray(me.subscriptions) ? me.subscriptions : []
  const set = new Set(current.map(Number))
  const aid = Number(authorId)

  if (set.has(aid)) set.delete(aid)
  else set.add(aid)

  const updated = await patchMe({ subscriptions: Array.from(set) })
  localStorage.setItem("currentUser", JSON.stringify(updated))
  return updated
}

export async function patchRecipe(id, patch) {
  return apiFetch(`/recipes/${id}`, { method: "PATCH", body: patch, auth: true })
}