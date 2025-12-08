import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

interface Property {
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

interface LoginResponse {
  success: boolean
  user?: any
  token?: string
  message?: string
}

interface RegisterResponse {
  success: boolean
  user?: any
  token?: string
  message?: string
}

interface PropertiesResponse {
  success: boolean
  data?: Property[]
  message?: string
  metadata?: {
    total: number
    filters_applied: number
    api_call_url?: string
  }
}

export const useApiService = () => {
  const apiService = {
    async login(email: string, password: string): Promise<LoginResponse> {
      try {
        console.log('Login attempt for:', email)

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        const defaultUsers = [
          {
            id: 1,
            email: 'test@example.com',
            password: 'password123',
            firstName: 'G0lovach',
            lastName: 'Helen',
            isLoggedIn: false
          },
          {
            id: 2,
            email: 'user@rentaparts.com',
            password: 'rentaparts2024',
            firstName: 'Jane',
            lastName: 'Smith',
            isLoggedIn: false
          }
        ]

        const allUsers = [...defaultUsers, ...existingUsers.filter((u: any) => !defaultUsers.find(d => d.email === u.email))]
        const user = allUsers.find((u: any) => u.email === email && u.password === password)

        if (user) {
          user.isLoggedIn = true
          localStorage.setItem('users', JSON.stringify(allUsers))

          const token = btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }))
          localStorage.setItem('authToken', token)
          localStorage.setItem('user', JSON.stringify({ ...user, password: undefined }))

          console.log('Login successful for:', user.email)
          return {
            success: true,
            user: { ...user, password: undefined },
            token
          }
        } else {
          console.log('Login failed: Invalid credentials')
          return { success: false, message: 'Invalid credentials' }
        }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, message: 'Login failed' }
      }
    },

    async register(userData: any): Promise<RegisterResponse> {
      try {
        console.log('Registration attempt for:', userData.email)

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = existingUsers.find((u: any) => u.email === userData.email)

        if (existingUser) {
          return { success: false, message: 'User already exists' }
        }

        const newUser = {
          ...userData,
          id: Date.now(),
          isLoggedIn: true,
          registrationTime: new Date().toISOString()
        }

        existingUsers.push(newUser)
        localStorage.setItem('users', JSON.stringify(existingUsers))

        const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, timestamp: Date.now() }))
        localStorage.setItem('authToken', token)
        localStorage.setItem('user', JSON.stringify({ ...newUser, password: undefined }))

        console.log('Registration successful for:', newUser.email)
        return {
          success: true,
          user: { ...newUser, password: undefined },
          token
        }
      } catch (error) {
        console.error('Registration error:', error)
        return { success: false, message: 'Registration failed' }
      }
    },

    async logout(userId?: number) {
      try {
        console.log('Logout for user ID:', userId)

        if (userId) {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const userIndex = existingUsers.findIndex((u: any) => u.id === userId)
          if (userIndex !== -1) {
            existingUsers[userIndex].isLoggedIn = false
            localStorage.setItem('users', JSON.stringify(existingUsers))
          }
        }

        localStorage.removeItem('authToken')
        localStorage.removeItem('user')

        console.log('Logout successful')
        return { success: true }
      } catch (error) {
        console.error('Logout error:', error)
        return { success: false, message: 'Logout failed' }
      }
    },

    async getProperties(filters: any = {}): Promise<PropertiesResponse> {
      try {
        console.log('getProperties called with filters:', filters)

        const queryParams = new URLSearchParams()

        if (filters.location) queryParams.append('location', filters.location)
        if (filters.type) queryParams.append('type', filters.type)
        if (filters.types && filters.types.length > 0) {
          filters.types.forEach((type: string) => queryParams.append('types[]', type))
        }
        if (filters.minPrice !== null && filters.minPrice !== undefined) {
          queryParams.append('minPrice', filters.minPrice.toString())
        }
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
          queryParams.append('maxPrice', filters.maxPrice.toString())
        }
        if (filters.minRating !== null && filters.minRating !== undefined) {
          queryParams.append('minRating', filters.minRating.toString())
        }
        if (filters.amenities && filters.amenities.length > 0) {
          filters.amenities.forEach((amenity: string) => queryParams.append('amenities[]', amenity))
        }
        if (filters.adults && filters.adults > 0) {
          queryParams.append('adults', filters.adults.toString())
        }
        if (filters.children !== null && filters.children !== undefined) {
          queryParams.append('children', filters.children.toString())
        }

        const apiUrl = queryParams.toString()
          ? `/properties?${queryParams.toString()}`
          : '/properties'

        console.log('Making real API call to:', apiUrl)

        try {
          const response = await api.get(apiUrl)
          console.log('Backend response:', response.data)

          return {
            success: true,
            data: response.data.data || response.data,
            metadata: response.data.metadata || {
              total: response.data.data?.length || response.data?.length,
              filters_applied: Object.keys(filters).length
            }
          }
        } catch (apiError: any) {
          console.warn('Backend API not available, using fallback data:', apiError.message)

          return this.getFallbackProperties(filters)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
        return { success: false, message: 'Failed to fetch properties' }
      }
    },

    getFallbackProperties(filters: any = {}): PropertiesResponse {
      console.log('Using fallback properties with filters:', filters)

      const sampleProperties: Property[] = [
          {
            id: 1,
            title: 'Cozy Belgrade Apartment',
            location: 'Belgrade, Serbia',
            type: 'apartment',
            price: 30,
            rating: 4.2,
            reviews: 47,
            image: '/images/cozy-belgrade-apartment.webp',
            amenities: ['wifi', 'kitchen', 'parking'],
            maxGuests: 4,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Charming apartment in the heart of Belgrade with authentic Socialist architecture.'
          },
          {
            id: 2,
            title: 'Modern Krakow Loft',
            location: 'Krakow, Poland',
            type: 'apartment',
            price: 225,
            rating: 4.8,
            reviews: 112,
            image: '/images/modern-krakow-loft.webp',
            amenities: ['wifi', 'aircon', 'kitchen', 'washer'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Contemporary loft in historic Krakow with modern amenities.'
          },
          {
            id: 3,
            title: 'Bucharest Studio',
            location: 'Bucharest, Romania',
            type: 'studio',
            price: 24,
            rating: 3.9,
            reviews: 33,
            image: '/images/bucharest-studio.webp',
            amenities: ['wifi', 'kitchen'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Affordable studio apartment perfect for short stays in Bucharest.'
          },
          {
            id: 4,
            title: 'Prague Historic House',
            location: 'Prague, Czech Republic',
            type: 'house',
            price: 180,
            rating: 4.6,
            reviews: 89,
            image: '/images/prague-historic-house.webp',
            amenities: ['wifi', 'kitchen', 'balcony', 'parking'],
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            description: 'Historic house in the heart of Prague with traditional architecture and modern amenities.'
          },
          {
            id: 5,
            title: 'Budapest Hotel Suite',
            location: 'Budapest, Hungary',
            type: 'hotel',
            price: 95,
            rating: 4.3,
            reviews: 67,
            image: '/images/budapest-hotel.webp',
            amenities: ['wifi', 'room service', 'spa access', 'parking'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2,
            description: 'Elegant hotel suite with access to thermal baths and traditional Hungarian charm.'
          },
          {
            id: 6,
            title: 'Sofia Historic Center Loft',
            location: 'Sofia, Bulgaria',
            type: 'loft',
            price: 45,
            rating: 4.1,
            reviews: 54,
            image: '/images/cozy-belgrade-apartment.webp',
            amenities: ['wifi', 'kitchen', 'washer'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Industrial-chic loft in the heart of Sofia\'s historic district.'
          },
          {
            id: 7,
            title: 'Riga Luxury Suite',
            location: 'Riga, Latvia',
            type: 'apartment',
            price: 320,
            rating: 4.9,
            reviews: 156,
            image: '/images/riga-luxury-suite.webp',
            amenities: ['wifi', 'kitchen', 'luxury', 'parking', 'spa'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2,
            description: 'Luxury suite in Riga showcasing the finest Art Nouveau architectural heritage.'
          },
          {
            id: 8,
            title: 'Haludovo Palace',
            location: 'Tallinn, Estonia',
            type: 'hotel',
            price: 280,
            rating: 4.7,
            reviews: 92,
            image: '/images/haludovo-palace.webp',
            amenities: ['wifi', 'spa', 'historic', 'views'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2,
            description: 'Historic palace hotel with luxurious amenities and stunning views.'
          },
          {
            id: 9,
            title: 'Vilnius Baroque Mansion',
            location: 'Vilnius, Lithuania',
            type: 'mansion',
            price: 450,
            rating: 4.8,
            reviews: 73,
            image: '/images/riga-luxury-suite.webp',
            amenities: ['wifi', 'kitchen', 'library', 'parking', 'garden'],
            maxGuests: 10,
            bedrooms: 5,
            bathrooms: 4,
            description: 'Elegant Baroque mansion offering luxury accommodations in historic Vilnius.'
          },
          {
            id: 10,
            title: 'Warsaw Modern Flat',
            location: 'Warsaw, Poland',
            type: 'apartment',
            price: 75,
            rating: 4.4,
            reviews: 128,
            image: '/images/warsaw-modern-flat.webp',
            amenities: ['wifi', 'aircon', 'kitchen', 'gym access'],
            maxGuests: 2,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Modern flat in Warsaw\'s business district with premium amenities.'
          },
          {
            id: 11,
            title: 'Flat in Ferant Garden',
            location: 'Lviv, Ukraine',
            type: 'apartment',
            price: 55,
            rating: 4.2,
            reviews: 87,
            image: '/images/flat-in-ferant-garden.webp',
            amenities: ['wifi', 'garden', 'kitchen', 'balcony'],
            maxGuests: 3,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Peaceful apartment with garden access in a charming residential area.'
          },
          {
            id: 12,
            title: 'Soviet Era Apartment',
            location: 'Minsk, Belarus',
            type: 'apartment',
            price: 35,
            rating: 3.8,
            reviews: 45,
            image: '/images/soviet-apartment.webp',
            amenities: ['wifi', 'kitchen', 'retro'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            description: 'Authentic Soviet-era apartment showcasing mid-century Eastern European design.'
          },
          {
            id: 13,
            title: 'Cherno More Hotel',
            location: 'Zagreb, Croatia',
            type: 'hotel',
            price: 210,
            rating: 4.5,
            reviews: 94,
            image: '/images/cherno-more-hotel.webp',
            amenities: ['wifi', 'room service', 'pool', 'spa', 'parking'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2,
            description: 'Luxury hotel with stunning sea views and premium amenities in Zagreb.'
          },
          {
            id: 14,
            title: 'Ljubljana Garden Apartment',
            location: 'Ljubljana, Slovenia',
            type: 'apartment',
            price: 120,
            rating: 4.6,
            reviews: 78,
            image: '/images/ljubljana-garden-apartment.webp',
            amenities: ['wifi', 'kitchen', 'garden', 'views'],
            maxGuests: 3,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Garden apartment with beautiful green space and views of Ljubljana Castle.'
          },
          {
            id: 15,
            title: 'Belgrade Cozy Apartment 2',
            location: 'Belgrade, Serbia',
            type: 'apartment',
            price: 85,
            rating: 4.3,
            reviews: 67,
            image: '/images/cozy-belgrade-apartment-2.webp',
            amenities: ['wifi', 'kitchen', 'balcony', 'parking'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            description: 'Another charming Belgrade apartment with modern amenities and great location.'
          },
          {
            id: 16,
            title: 'Tirana Mountain View Cabin',
            location: 'Tirana, Albania',
            type: 'cabin',
            price: 65,
            rating: 4.0,
            reviews: 34,
            image: '/images/fda3da8f8bd8ed20f2b395a4aa7210884b9c1ab7.webp',
            amenities: ['wifi', 'kitchen', 'fireplace', 'hiking'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1,
            description: 'Cozy mountain cabin near Tirana with hiking trails and stunning alpine views.'
          },
          {
            id: 17,
            title: 'Chisinau Wine Cellar Apartment',
            location: 'Chisinau, Moldova',
            type: 'apartment',
            price: 42,
            rating: 4.1,
            reviews: 56,
            image: '/images/bucharest-studio.webp',
            amenities: ['wifi', 'kitchen', 'wine cellar', 'tasting'],
            maxGuests: 3,
            bedrooms: 1,
            bathrooms: 1,
            description: 'Unique apartment featuring traditional Moldovan wine cellar and tasting room.'
          },
          {
            id: 18,
            title: 'Sarajevo Ottoman Quarter House',
            location: 'Sarajevo, Bosnia and Herzegovina',
            type: 'house',
            price: 90,
            rating: 4.4,
            reviews: 82,
            image: '/images/prague-historic-house.webp',
            amenities: ['wifi', 'kitchen', 'courtyard', 'historic'],
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            description: 'Historic Ottoman-era house in Sarajevo\'s old quarter with traditional architecture.'
          }
        ]

        let filteredData = sampleProperties

        if (filters.location) {
          filteredData = filteredData.filter(property =>
            property.location.toLowerCase().includes(filters.location.toLowerCase())
          )
        }

        if (filters.type) {
          filteredData = filteredData.filter(property => property.type === filters.type)
        }

        if (filters.types && filters.types.length > 0) {
          filteredData = filteredData.filter(property =>
            filters.types.includes(property.type)
          )
        }

        if (filters.minPrice !== null && filters.minPrice !== undefined) {
          filteredData = filteredData.filter(property => property.price >= filters.minPrice)
        }

        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
          filteredData = filteredData.filter(property => property.price <= filters.maxPrice)
        }

        if (filters.minRating !== null && filters.minRating !== undefined) {
          filteredData = filteredData.filter(property => property.rating >= filters.minRating)
        }

        if (filters.amenities && filters.amenities.length > 0) {
          filteredData = filteredData.filter(property =>
            filters.amenities.some((amenity: string) => property.amenities.includes(amenity))
          )
        }

        if (filters.adults && filters.adults > 0) {
          filteredData = filteredData.filter(property => property.maxGuests >= filters.adults)
        }

        if (filters.children !== null && filters.children !== undefined) {
          const totalGuests = (filters.adults || 1) + filters.children
          filteredData = filteredData.filter(property => property.maxGuests >= totalGuests)
        }

        return {
          success: true,
          data: filteredData,
          metadata: {
            total: filteredData.length,
            filters_applied: Object.keys(filters).length
          }
        }
    },

    async getPropertyById(id: string): Promise<{ success: boolean; data?: Property; message?: string }> {
      try {
        console.log('getPropertyById called with ID:', id)

        const cachedProperties = JSON.parse(localStorage.getItem('external_properties') || '[]')
        const externalProperty = cachedProperties.find((p: any) => p.id === id || p.id.toString() === id)

        if (externalProperty) {
          console.log('Found external property in cache:', externalProperty.title)
          return { success: true, data: externalProperty }
        }

        const response = await this.getProperties()
        if (response.success && response.data) {
          const numericId = parseInt(id)
          const property = response.data.find(p => p.id === numericId || p.id.toString() === id)

          if (property) {
            console.log('Found regular property:', property.title)
            return { success: true, data: property }
          }
        }

        console.log('Property not found with ID:', id)
        return { success: false, message: 'Property not found' }
      } catch (error) {
        console.error('Error getting property by ID:', error)
        return { success: false, message: 'Failed to get property' }
      }
    },

    async getUserLocation(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser'))
          return
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            let message = 'Location access denied'
            switch (error.code) {
              case error.PERMISSION_DENIED:
                message = 'Location access denied by user'
                break
              case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable'
                break
              case error.TIMEOUT:
                message = 'Location request timeout'
                break
            }
            reject(new Error(message))
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
          }
        )
      })
    },

    async searchHotelsNearLocation(latitude: number, longitude: number) {
      try {
        console.log('Searching hotels near:', latitude, longitude)

        try {
          const realHotels = await this.getNearbyHotels(latitude, longitude)
          if (realHotels && realHotels.length > 0) {
            console.log('Found real hotels:', realHotels.length)
            return { success: true, data: realHotels, source: 'external' }
          }
        } catch (error) {
          console.warn('External hotel APIs failed, using fallback')
        }

        const cityName = await this.getCityNameFromCoords(latitude, longitude)
        console.log('City name from coordinates:', cityName)

        const placeholderImages = [
          '/images/budapest-hotel.webp',
          '/images/cherno-more-hotel.webp',
          '/images/haludovo-palace.webp',
          '/images/riga-luxury-suite.webp',
          '/images/cozy-belgrade-apartment.webp',
          '/images/modern-krakow-loft.webp'
        ]

        const mockHotels: Property[] = Array.from({ length: 6 }, (_, index) => ({
          id: 1001 + index,
          title: index === 0 ? `Grand ${cityName} Hotel` :
                 index === 1 ? `${cityName} Boutique Inn` :
                 index === 2 ? `${cityName} Business Center` :
                 index === 3 ? `${cityName} Palace Hotel` :
                 index === 4 ? `Central ${cityName} Lodge` :
                 `${cityName} Comfort Suites`,
          location: `${cityName}`,
          type: 'hotel',
          price: Math.floor(Math.random() * 100) + 80,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          reviews: Math.floor(Math.random() * 100) + 10,
          image: placeholderImages[index],
          amenities: ['wifi', 'pool', 'restaurant', 'parking'],
          maxGuests: 4,
          bedrooms: 2,
          bathrooms: 1,
          description: `Hotel in ${cityName}`,
          isExternal: true,
          source: 'fallback'
        }))

        return { success: true, data: mockHotels, source: 'fallback' }
      } catch (error) {
        console.error('Error searching hotels:', error)
        return { success: false, message: 'Failed to search hotels' }
      }
    },

    async getNearbyHotels(latitude: number, longitude: number): Promise<Property[]> {
      try {
        const query = 'hotel'
        const bbox = 0.05 // search area
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-bbox},${latitude-bbox},${longitude+bbox},${latitude+bbox}&limit=10&addressdetails=1`

        console.log('Calling Nominatim API:', url)
        const response = await fetch(url)

        if (!response.ok) throw new Error('Nominatim API failed')

        const data = await response.json()
        console.log('Nominatim response:', data)

        const hotels = data.filter((place: any) =>
          place.class === 'tourism' &&
          (place.type === 'hotel' || place.type === 'guest_house' || place.type === 'hostel')
        ).slice(0, 6).map((place: any, index: number) => ({
          id: `nominatim_${place.place_id}`,
          title: place.display_name.split(',')[0] || `Hotel ${index + 1}`,
          location: `${place.address?.city || place.address?.town || place.address?.village || 'Unknown'}, ${place.address?.country || 'Unknown'}`,
          type: place.type || 'hotel',
          price: Math.floor(Math.random() * 150) + 50,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          reviews: Math.floor(Math.random() * 100) + 10,
          image: this.getHotelPlaceholderImage(place.type),
          amenities: this.getRandomAmenities(),
          maxGuests: 4,
          bedrooms: 1,
          bathrooms: 1,
          description: `${place.type.replace('_', ' ')} in ${place.address?.city || 'the area'}`,
          coordinates: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          },
          isExternal: true,
          source: 'nominatim'
        }))

        return hotels
      } catch (error) {
        console.log('Nominatim API failed:', error)
        throw error
      }
    },

    async getCityNameFromCoords(latitude: number, longitude: number): Promise<string> {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()
        return data.city || data.locality || 'Unknown City'
      } catch (error) {
        console.error('Reverse geocoding failed:', error)
        return 'Unknown City'
      }
    },

    async reverseGeocode(latitude: number, longitude: number) {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        )
        const data = await response.json()

        return {
          city: data.city || data.locality || 'Unknown City',
          country: data.countryName || 'Unknown Country',
          address: data.localityInfo?.administrative?.[0]?.name || data.principalSubdivision
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error)
        return {
          city: 'Unknown City',
          country: 'Unknown Country',
          address: ''
        }
      }
    },

    getHotelPlaceholderImage(type: string): string {
      const images: { [key: string]: string } = {
        hotel: '/images/budapest-hotel.webp',
        hostel: '/images/cozy-belgrade-apartment.webp',
        guest_house: '/images/riga-luxury-suite.webp',
        boutique: '/images/modern-krakow-loft.webp'
      }
      return images[type] || images.hotel
    },

    getRandomAmenities(): string[] {
      const allAmenities = ['wifi', 'parking', 'pool', 'restaurant', 'spa', 'gym', 'aircon', 'room service']
      const count = Math.floor(Math.random() * 4) + 2
      return allAmenities.sort(() => 0.5 - Math.random()).slice(0, count)
    }
  }

  return { apiService }
}