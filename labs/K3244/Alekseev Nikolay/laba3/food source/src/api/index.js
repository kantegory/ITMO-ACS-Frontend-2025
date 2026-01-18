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
  getOne: id => instance.get(`/users/${id}`),
  patch: (id, patch) => instance.patch(`/users/${id}`, patch)
}
