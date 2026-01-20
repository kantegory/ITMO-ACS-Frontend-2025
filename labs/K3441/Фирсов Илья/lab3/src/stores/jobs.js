import { defineStore } from 'pinia'
import { vacanciesApi, applicationsApi, resumesApi, employerApi, authApi } from '@/api'
import { TOKEN_KEY } from '@/api/instance'
import instance from '@/api/instance'

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1] || ''
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    delete instance.defaults.headers.common.Authorization
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    vacancies: [],
    applications: [],
    employerVacancies: [],
    resumes: [],
    user: null,
    favorites: JSON.parse(localStorage.getItem('careerFavorites') || '[]'),
  }),

  getters: {
    favoritesSet() {
      return new Set(this.favorites.map(String))
    },
    
    normalizedVacancies() {
      return this.vacancies.map((v) => {
        const employerVacancy = this.employerVacancies.find((ev) => String(ev.id) === String(v.id))
        return {
          ...v,
          status: employerVacancy?.status || v.status || 'опубликована',
        }
      })
    },
  },

  actions: {
    async init(filters = {}) {
      await Promise.all([
        this.loadVacancies(filters),
        this.loadApplications(),
        this.loadResumes(),
        this.loadEmployerVacancies(),
      ])
      
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        setAuthToken(token)
        await this.resolveUserFromToken(token)
      }
    },

    async loadVacancies(filters = {}) {
      try {
        const { data } = await vacanciesApi.getVacancies(filters)
        let vacancies = Array.isArray(data) ? data : []
        
        // Фильтрация по ключевым словам на клиенте (если бэкенд не поддерживает)
        if (filters.keyword) {
          const keyword = filters.keyword.trim().toLowerCase()
          if (keyword) {
            vacancies = vacancies.filter((vacancy) => {
              const combined = `${vacancy.title} ${vacancy.company} ${(vacancy.tags || []).join(' ')}`.toLowerCase()
              return combined.includes(keyword)
            })
          }
        }
        
        this.vacancies = vacancies
      } catch {
        this.vacancies = []
      }
    },

    async loadApplications() {
      try {
        const { data } = await applicationsApi.getApplications()
        this.applications = Array.isArray(data)
          ? data.map((a) => ({
              ...a,
              title: a.title || a.vacancy || 'Без названия',
              status: a.status || 'В рассмотрении',
              candidate: a.candidate || a.name || '',
            }))
          : []
      } catch {
        this.applications = []
      }
    },

    async loadResumes() {
      try {
        const { data } = await resumesApi.getResumes()
        this.resumes = Array.isArray(data) ? data : []
      } catch {
        this.resumes = []
      }
    },

    async loadEmployerVacancies() {
      try {
        const { data } = await employerApi.getEmployerVacancies()
        this.employerVacancies = Array.isArray(data) ? data : []
      } catch {
        this.employerVacancies = []
      }
    },

    async login(credentials) {
      const { data } = await authApi.login(credentials)
      const token = data?.accessToken
      if (!token) throw new Error('Token missing')
      setAuthToken(token)
      const profile = data?.user || (await this.resolveUserFromToken(token)) || { email: credentials.email }
      this.user = profile
      return profile
    },

    async register(userData) {
      const { data } = await authApi.register(userData)
      const token = data?.accessToken
      if (!token) throw new Error('Token missing')
      setAuthToken(token)
      const profile = data?.user || (await this.resolveUserFromToken(token)) || { email: userData.email }
      this.user = profile
      return profile
    },

    async resolveUserFromToken(token) {
      const payload = decodeJwtPayload(token)
      if (!payload) return null
      try {
        if (payload.sub) {
          const { data } = await authApi.getUser(payload.sub)
          this.user = data
          return data
        }
      } catch (error) {
        if (error?.response?.status === 401) return null
      }
      const profile = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.fullName || payload.username,
      }
      this.user = profile
      return profile
    },

    logout() {
      setAuthToken('')
      this.user = null
    },

    toggleFavorite(id) {
      const idStr = String(id)
      const index = this.favorites.findIndex((f) => String(f) === idStr)
      if (index >= 0) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(id)
      }
      localStorage.setItem('careerFavorites', JSON.stringify(this.favorites))
    },

    async createApplication(data) {
      try {
        const { data: saved } = await applicationsApi.createApplication({
          ...data,
          status: 'В рассмотрении',
        })
        this.applications = [saved, ...this.applications]
        return saved
      } catch {
        const saved = { ...data, id: Date.now().toString(), status: 'В рассмотрении' }
        this.applications = [saved, ...this.applications]
        return saved
      }
    },

    async updateApplicationStatus(id, status) {
      const app = this.applications.find((a) => String(a.id) === String(id))
      if (app) {
        app.status = status
        try {
          await applicationsApi.updateApplication(id, { status })
        } catch {}
      }
    },

    async saveResume(data) {
      const id = data.id
      if (id) {
        try {
          const { data: saved } = await resumesApi.updateResume(id, data)
          this.resumes = this.resumes.map((r) => (String(r.id) === String(id) ? saved : r))
          return saved
        } catch {
          const saved = { ...data, id }
          this.resumes = this.resumes.map((r) => (String(r.id) === String(id) ? saved : r))
          return saved
        }
      } else {
        try {
          const { data: saved } = await resumesApi.createResume(data)
          this.resumes = [saved, ...this.resumes]
          return saved
        } catch {
          const saved = { ...data, id: Date.now().toString() }
          this.resumes = [saved, ...this.resumes]
          return saved
        }
      }
    },

    async createEmployerVacancy(data) {
      const newVacancy = {
        ...data,
        id: data.id || Date.now().toString(),
        status: data.status || 'опубликована',
      }
      try {
        await employerApi.createEmployerVacancy(newVacancy)
        await vacanciesApi.createVacancy(newVacancy)
        
        // Перезагружаем данные с сервера для синхронизации
        await Promise.all([
          this.loadVacancies(),
          this.loadEmployerVacancies(),
        ])
        
        return newVacancy
      } catch (error) {
        // Если ошибка, добавляем локально
        this.employerVacancies = [newVacancy, ...this.employerVacancies]
        this.vacancies = [newVacancy, ...this.vacancies]
        return newVacancy
      }
    },

    async updateEmployerVacancyStatus(id, status) {
      const vacancy = this.employerVacancies.find((v) => String(v.id) === String(id))
      if (vacancy) {
        vacancy.status = status
        const mainVacancy = this.vacancies.find((v) => String(v.id) === String(id))
        if (mainVacancy) {
          mainVacancy.status = status
        }
        try {
          await employerApi.updateEmployerVacancy(id, { status })
          if (mainVacancy) {
            await vacanciesApi.updateVacancy(id, { status })
          }
        } catch {}
      }
    },
  },
})
