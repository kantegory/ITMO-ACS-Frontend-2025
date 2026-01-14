import axios from 'axios'
import { useAuth } from './useAuth'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export function useApi() {
  const { token } = useAuth()

  api.interceptors.request.use(config => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  return api
}
