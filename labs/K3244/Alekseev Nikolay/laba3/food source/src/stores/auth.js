import { defineStore } from "pinia"
import { authApi, usersApi, sessionApi } from "@/api"

function toCreds(username) {
  const email = `${encodeURIComponent(username)}@local.user`
  const password = username
  return { email, password }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    initialized: false,
    accessToken: "",
    user: null
  }),

  getters: {
    isAuthed: s => Boolean(s.accessToken && s.user?.id)
  },

  actions: {
    async init() {
      if (this.initialized) return
      await this.restoreSession()
      this.initialized = true
    },

    setSession(token, user) {
      this.accessToken = token
      this.user = user
    },

    async loginByName(username) {
      const { email, password } = toCreds(username)
      const { data } = await authApi.login(email, password)
      this.setSession(data.accessToken, data.user)
      await this.markLoggedIn(data.user.id)
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
      await this.markLoggedIn(data.user.id)
      return data.user
    },

    async refreshMe() {
      if (!this.user?.id) return null
      const { data } = await usersApi.getOne(this.user.id)
      this.user = data
      return data
    },

    async logout() {
      this.accessToken = ""
      this.user = null

      try { await sessionApi.clear() } catch {}
    },

    async restoreSession() {
      try {
        const res = await sessionApi.get()

        if (!res || res.status === 204) return null
    
        if (res.status === 200 && res.data?.user) {
          this.user = res.data.user
          this.accessToken = "session"
          return this.user
        }
      } catch {
        return null
      }
    
      return null
    },
    
    async markLoggedIn(userId) {
      await sessionApi.set(userId)
    }
    
  }
})
