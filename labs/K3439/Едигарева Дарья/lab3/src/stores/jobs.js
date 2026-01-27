import { defineStore } from 'pinia'
import { jobsApi } from '@/api'
import instance from '@/api/instance'
import { INDUSTRY_LABELS } from '@/constants/industries'
import { toExperienceBucket } from '@/utils/labels'

const FAVORITES_KEY = 'jobFavorites'

const loadFavorites = () => {
  const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]') || []
  return stored.map(String)
}

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    userId: 1,
    token: localStorage.getItem('accessToken') || '',
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null,
    companies: [],
    vacancies: [],
    favorites: loadFavorites(),
    users: [],
    profiles: [],
    profile: null,
    employer: null,
    responses: [],
  }),

  getters: {
    companiesMap: (state) =>
      state.companies.reduce((acc, company) => {
        acc[String(company.id)] = company
        return acc
      }, {}),

    usersMap: (state) =>
      state.users.reduce((acc, user) => {
        acc[String(user.id)] = user
        return acc
      }, {}),

    profilesMap: (state) =>
      state.profiles.reduce((acc, profile) => {
        acc[String(profile.userId)] = profile
        return acc
      }, {}),

    normalizedVacancies() {
      return this.vacancies.map((vacancy) => {
        const company =
          this.companiesMap[String(vacancy.companyId)] || {
            name: 'Без компании',
            location: '—',
          }
        const requirements = Array.isArray(vacancy.requirements)
          ? vacancy.requirements
          : typeof vacancy.requirements === 'string'
            ? vacancy.requirements
                .split(/\n|;/)
                .map((item) => item.trim())
                .filter(Boolean)
            : []

        return {
          ...vacancy,
          company,
          industryLabel:
            INDUSTRY_LABELS[vacancy.industry] || vacancy.industry || 'other',
          experienceBucket: toExperienceBucket(vacancy.experienceRequired),
          requirements,
          tags: vacancy.tags || requirements.slice(0, 3),
        }
      })
    },

    favoritesSet: (state) => new Set(state.favorites.map(String)),

    appliedVacancyIds() {
      return new Set(
        this.responses
          .filter((item) => String(item.userId) === String(this.userId))
          .map((item) => String(item.vacancyId)),
      )
    },
  },

  actions: {
    setAuth(token, user) {
      this.token = token || ''
      this.user = user || null
      this.userId = user?.id || 1

      if (this.token) {
        instance.defaults.headers.common.Authorization = `Bearer ${this.token}`
        localStorage.setItem('accessToken', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
      } else {
        delete instance.defaults.headers.common.Authorization
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      }
    },

    async login(payload) {
      const response = await jobsApi.login(payload)
      this.setAuth(response.data.accessToken, response.data.user)
      return response
    },

    async register(payload) {
      const response = await jobsApi.register(payload)
      this.setAuth(response.data.accessToken, response.data.user)
      return response
    },

    logout() {
      this.setAuth('', null)
      this.responses = []
    },

    async loadCompanies() {
      const response = await jobsApi.getCompanies()
      this.companies = response.data
      return response
    },

    async loadUsers() {
      const response = await jobsApi.getUsers()
      this.users = response.data
      return response
    },

    async loadAllProfiles() {
      const response = await jobsApi.getProfiles()
      this.profiles = response.data
      return response
    },

    async loadVacancies() {
      const response = await jobsApi.getVacancies()
      this.vacancies = response.data
      return response
    },

    async init() {
      if (this.token) {
        this.setAuth(this.token, this.user)
      }
      if (!this.companies.length) {
        await this.loadCompanies()
      }
      await this.loadVacancies()
    },

    toggleFavorite(id) {
      const key = String(id)
      if (this.favoritesSet.has(key)) {
        this.favorites = this.favorites.filter((fav) => fav !== key)
      } else {
        this.favorites = [...this.favorites, key]
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.favorites))
    },

    async loadProfile() {
      const response = await jobsApi.getProfiles(this.userId)
      this.profile = response.data?.[0] || null
      return response
    },

    async saveProfile(payload) {
      if (this.profile?.id) {
        const response = await jobsApi.updateProfile(this.profile.id, {
          ...this.profile,
          ...payload,
        })
        this.profile = response.data
        return response
      }

      const response = await jobsApi.createProfile({
        ...payload,
        userId: this.userId,
      })
      this.profile = response.data
      return response
    },

    async loadEmployer() {
      const response = await jobsApi.getEmployers(this.userId)
      this.employer = response.data?.[0] || null
      return response
    },

    async createEmployer(payload) {
      const response = await jobsApi.createEmployer({
        ...payload,
        userId: this.userId,
      })
      this.employer = response.data
      return response
    },

    async createVacancy(payload) {
      const response = await jobsApi.createVacancy(payload)
      this.vacancies = [...this.vacancies, response.data]
      return response
    },

    async loadResponses(userId = null) {
      const response = await jobsApi.getResponses(userId)
      this.responses = response.data
      return response
    },

    async applyToVacancy(vacancyId) {
      const vacancyKey = String(vacancyId)
      if (!this.responses.length) {
        await this.loadResponses()
      }
      const exists = this.responses.some(
        (item) =>
          String(item.userId) === String(this.userId) &&
          String(item.vacancyId) === vacancyKey,
      )
      if (exists) {
        return { data: this.responses.find((item) => String(item.vacancyId) === vacancyKey) }
      }
      const response = await jobsApi.createResponse({
        userId: this.userId,
        vacancyId,
        createdAt: new Date().toISOString(),
      })
      this.responses = [...this.responses, response.data]
      return response
    },
  },
})
