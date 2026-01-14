import instance from './instance'
import WorkoutsApi from './workouts'
import AuthApi from './auth'

const workoutsApi = new WorkoutsApi(instance)
const authApi = new AuthApi(instance)

export {
  workoutsApi,
  authApi
}
