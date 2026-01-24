import axios from 'axios'
import { useAuth } from './useAuth'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

api.interceptors.request.use(config => {
  const { token } = useAuth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function useApi() {
  return {
    get: async (url, config) => {
      const res = await api.get(url, config)
      return res.data
    },
    post: async (url, data, config) => {
      const res = await api.post(url, data, config)
      return res.data
    },
    put: async (url, data, config) => {
      const res = await api.put(url, data, config)
      return res.data
    },
    del: async (url, config) => {
      const res = await api.delete(url, config)
      return res.data
    }
  }
}
