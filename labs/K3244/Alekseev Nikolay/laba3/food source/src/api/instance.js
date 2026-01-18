import axios from "axios"
import { useAuthStore } from "@/stores/auth"

const instance = axios.create({
  baseURL: "/api"
})

instance.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

export default instance
