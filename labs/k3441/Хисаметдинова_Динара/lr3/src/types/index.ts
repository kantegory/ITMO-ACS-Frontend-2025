export interface Property {
  id: number
  title: string
  location: string
  type: string
  price: number
  rating: number
  reviews: number
  image: string
  amenities: string[]
  maxGuests: number
  bedrooms: number
  bathrooms: number
  description: string
}

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export interface RegisterResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export interface PropertiesResponse {
  success: boolean
  data?: Property[]
  message?: string
  source?: string
  metadata?: {
    total: number
    filters_applied: number
    api_call_url?: string
  }
}

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
}