import instance from '@/api/instance'
import AuthApi from '@/api/auth'
import RestaurantsApi from '@/api/restaurant'
import UserApi from '@/api/user'
import BookingsApi from '@/api/bookings'

const authApi = new AuthApi(instance)
const restaurantApi = new RestaurantsApi(instance)
const userApi = new UserApi(instance)
const bookingsApi = new BookingsApi(instance)

export {
  authApi,
  restaurantApi,
  userApi,
  bookingsApi
}
