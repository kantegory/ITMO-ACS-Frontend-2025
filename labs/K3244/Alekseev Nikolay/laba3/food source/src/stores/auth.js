import { defineStore } from "pinia"
import { authApi, usersApi } from "@/api"

function toCreds(username) {
  const email = `${encodeURIComponent(username)}@local.user`
  const password = username
  return { email, password }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: localStorage.getItem("accessToken") || "",
    user: (() => {
      try { return JSON.parse(localStorage.getItem("currentUser") || "null") } catch { return null }
    })()
  }),

  getters: {
    isAuthed: s => Boolean(s.accessToken && s.user?.id)
  },

  actions: {
    setSession(accessToken, user) {
      this.accessToken = accessToken || ""
      this.user = user || null
      if (this.accessToken) localStorage.setItem("accessToken", this.accessToken)
      else localStorage.removeItem("accessToken")
      if (this.user) localStorage.setItem("currentUser", JSON.stringify(this.user))
      else localStorage.removeItem("currentUser")
    },

    async loginByName(username) {
      const { email, password } = toCreds(username)
      const { data } = await authApi.login(email, password)
      this.setSession(data.accessToken, data.user)
      return data.user
    },

    async registerByName(username) {
      const { email, password } = toCreds(username)
      const { data } = await authApi.register({
        email,
        password,
        name: username,
        theme: "light",
        subscriptions: [],
        savedRecipeIds: [],
        likedRecipeIds: []
      })
      this.setSession(data.accessToken, data.user)
      return data.user
    },

    async refreshMe() {
      if (!this.user?.id) return null
      const { data } = await usersApi.getOne(this.user.id)
      this.setSession(this.accessToken, data)
      return data
    },

    logout() {
      this.setSession("", null)
    }
  },

  persist: false
})
