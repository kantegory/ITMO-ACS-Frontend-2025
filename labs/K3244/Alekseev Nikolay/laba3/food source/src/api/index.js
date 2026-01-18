import instance from "./instance"

export const authApi = {
  login: (email, password) => instance.post("/login", { email, password }),
  register: data => instance.post("/register", data)
}

export const recipesApi = {
  getAll: () => instance.get("/recipes"),
  getOne: id => instance.get(`/recipes/${id}`),
  patch: (id, patch) => instance.patch(`/recipes/${id}`, patch)
}

export const usersApi = {
  getAll: () => instance.get("/users"),
  getOne: id => instance.get(`/users/${id}`),
  patch: (id, patch) => instance.patch(`/users/${id}`, patch)
}

export const sessionApi = {
  get: () => instance.get("/session"),
  set: (userId) => instance.post("/session", { userId }, { headers: { "Content-Type": "application/json" } }),
  clear: () => instance.delete("/session")
}
