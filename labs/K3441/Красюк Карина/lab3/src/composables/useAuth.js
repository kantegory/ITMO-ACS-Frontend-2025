import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from './useApi'

export function useAuth() {
  const router = useRouter()
  const { apiClient } = useApi()
  
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isCandidate = computed(() => user.value?.role === 'candidate')
  const isEmployer = computed(() => user.value?.role === 'employer')

  const login = async (email, password, role) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/login', { email, password, role })
      const { accessToken, user: userData } = response.data
      
      token.value = accessToken
      user.value = userData
      
      localStorage.setItem('token', accessToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const newUserResponse = await apiClient.post('/users', {
        email: userData.email,
        password: userData.password,
        role: userData.role,
        ...(userData.role === 'candidate'
          ? { name: userData.name, position: userData.position, city: userData.city }
          : { companyName: userData.companyName, industry: userData.industry, city: userData.city }
        )
      })
      
      const newUser = newUserResponse.data
      
      if (userData.role === 'candidate') {
        try {
          await apiClient.post('/resumes', {
            userId: newUser.id,
            position: userData.position || '',
            salary: 0,
            city: userData.city || '',
            employmentType: '',
            skills: [],
            experience: [],
            education: '',
            about: '',
            isVisible: true
          })
        } catch (err) {
          console.error('Ошибка создания резюме:', err)
        }
      }
      
      return { success: true, user: newUser }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getCurrentUser = () => user.value

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isCandidate,
    isEmployer,
    login,
    register,
    logout,
    getCurrentUser
  }
}

