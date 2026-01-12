export interface Restaurant {
  id: string
  name: string
  cuisine: string
  location: string
  price: string
  images: string[]
  menu: MenuItem[]
  reviews: Review[]
}

export interface MenuItem {
  name: string
  description: string
  price: string
}

export interface Review {
  name: string
  text: string
}

export interface User {
  id: number
  username: string
  email: string
  password: string
}

export interface Booking {
  id?: number
  userId: number
  restaurantId: string
  restaurantName: string
  name: string
  email: string
  date: string
  time: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
}

export interface SearchFilters {
  cuisine?: string
  location?: string
  price?: string
}

