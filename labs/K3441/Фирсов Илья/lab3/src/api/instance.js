import axios from 'axios'

const urlApiOverride = new URLSearchParams(window.location.search).get('api')
if (urlApiOverride) {
  localStorage.setItem('careerApiBase', urlApiOverride)
}

const API_BASE = urlApiOverride || localStorage.getItem('careerApiBase') || 'http://localhost:3001'
const TOKEN_KEY = 'careerAuthToken'

const instance = axios.create({
  baseURL: API_BASE,
  timeout: 6000,
})

const savedToken = localStorage.getItem(TOKEN_KEY)
if (savedToken) {
  instance.defaults.headers.common.Authorization = `Bearer ${savedToken}`
}

export default instance
export { API_BASE, TOKEN_KEY }
