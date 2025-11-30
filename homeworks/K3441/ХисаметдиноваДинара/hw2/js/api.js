const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
        return Promise.reject(error);
    }
);

const ApiService = {

    async login(email, password) {
        try {
            const response = await api.get('/users');
            const user = response.data.find(u => u.email === email && u.password === password);

            if (user) {
                const token = btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }));
                localStorage.setItem('authToken', token);

                await api.patch(`/users/${user.id}`, { isLoggedIn: true });

                return {
                    success: true,
                    user: { ...user, password: undefined },
                    token
                };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed' };
        }
    },

    async register(userData) {
        try {
            const existingUser = await api.get(`/users?email=${userData.email}`);
            if (existingUser.data.length > 0) {
                return { success: false, message: 'User already exists' };
            }

            const newUser = {
                ...userData,
                id: Date.now(),
                isLoggedIn: true,
                registrationTime: new Date().toISOString()
            };

            const response = await api.post('/users', newUser);
            const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, timestamp: Date.now() }));
            localStorage.setItem('authToken', token);

            return {
                success: true,
                user: { ...response.data, password: undefined },
                token
            };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Registration failed' };
        }
    },

    async logout(userId) {
        try {
            if (userId) {
                await api.patch(`/users/${userId}`, { isLoggedIn: false });
            }
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, message: 'Logout failed' };
        }
    },

    async getProperties(filters = {}) {
        try {
            console.log('getProperties called, using local sample data...');

            // Use the local sample properties data instead of API calls - 18 properties total
            const sampleProperties = [
                {
                    id: 1,
                    title: 'Cozy Belgrade Apartment',
                    location: 'Belgrade, Serbia',
                    type: 'apartment',
                    price: 30,
                    rating: 4.2,
                    reviews: 47,
                    image: 'images/cozy-belgrade-apartment.webp',
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
                    image: 'images/modern-krakow-loft.webp',
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
                    image: 'images/bucharest-studio.webp',
                    amenities: ['wifi', 'kitchen'],
                    maxGuests: 2,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Affordable studio apartment perfect for short stays in Bucharest.'
                },
                {
                    id: 4,
                    title: 'Riga Luxury Suite',
                    location: 'Riga, Latvia',
                    type: 'apartment',
                    price: 190,
                    rating: 4.6,
                    reviews: 89,
                    image: 'images/riga-luxury-suite.webp',
                    amenities: ['wifi', 'aircon', 'kitchen', 'washer', 'parking'],
                    maxGuests: 6,
                    bedrooms: 2,
                    bathrooms: 2,
                    description: 'Luxurious apartment with Baltic Sea views in historic Riga.'
                },
                {
                    id: 5,
                    title: 'Prague Historic House',
                    location: 'Prague, Czech Republic',
                    type: 'house',
                    price: 120,
                    rating: 4.4,
                    reviews: 67,
                    image: 'images/prague-historic-house.webp',
                    amenities: ['wifi', 'kitchen', 'parking', 'washer'],
                    maxGuests: 8,
                    bedrooms: 3,
                    bathrooms: 2,
                    description: 'Beautiful historic house in Prague with traditional architecture.'
                },
                {
                    id: 6,
                    title: 'Ljubljana Garden Apartment',
                    location: 'Ljubljana, Slovenia',
                    type: 'apartment',
                    price: 80,
                    rating: 4.3,
                    reviews: 54,
                    image: 'images/ljubljana-garden-apartment.webp',
                    amenities: ['wifi', 'kitchen', 'parking'],
                    maxGuests: 4,
                    bedrooms: 2,
                    bathrooms: 1,
                    description: 'Peaceful apartment with garden access in Ljubljana center.'
                },
                {
                    id: 7,
                    title: 'Warsaw Modern Flat',
                    location: 'Warsaw, Poland',
                    type: 'apartment',
                    price: 95,
                    rating: 4.1,
                    reviews: 76,
                    image: 'images/warsaw-modern-flat.webp',
                    amenities: ['wifi', 'aircon', 'kitchen'],
                    maxGuests: 3,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Modern apartment in Warsaw business district.'
                },
                {
                    id: 8,
                    title: 'Budapest Hotel Room',
                    location: 'Budapest, Hungary',
                    type: 'hotel',
                    price: 160,
                    rating: 4.5,
                    reviews: 203,
                    image: 'images/budapest-hotel.webp',
                    amenities: ['wifi', 'aircon'],
                    maxGuests: 2,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Elegant hotel room with Danube River views.'
                },
                {
                    id: 9,
                    title: 'Vilnius Old Town Loft',
                    location: 'Vilnius, Lithuania',
                    type: 'apartment',
                    price: 75,
                    rating: 4.2,
                    reviews: 38,
                    image: 'images/cozy-belgrade-apartment-2.webp',
                    amenities: ['wifi', 'kitchen'],
                    maxGuests: 3,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Stylish loft in Vilnius historic old town.'
                },
                {
                    id: 10,
                    title: 'Tallinn Medieval House',
                    location: 'Tallinn, Estonia',
                    type: 'house',
                    price: 140,
                    rating: 4.7,
                    reviews: 92,
                    image: 'images/flat-in-ferant-garden.webp',
                    amenities: ['wifi', 'kitchen', 'parking', 'washer'],
                    maxGuests: 6,
                    bedrooms: 3,
                    bathrooms: 2,
                    description: 'Authentic medieval house in Tallinn old city.'
                },
                {
                    id: 11,
                    title: 'Sofia Central Studio',
                    location: 'Sofia, Bulgaria',
                    type: 'studio',
                    price: 35,
                    rating: 3.8,
                    reviews: 28,
                    image: 'images/soviet-apartment.webp',
                    amenities: ['wifi', 'aircon'],
                    maxGuests: 2,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Compact studio in Sofia city center.'
                },
                {
                    id: 12,
                    title: 'Skopje Modern Apartment',
                    location: 'Skopje, Macedonia',
                    type: 'apartment',
                    price: 50,
                    rating: 4.0,
                    reviews: 41,
                    image: 'images/haludovo-palace.webp',
                    amenities: ['wifi', 'kitchen', 'parking'],
                    maxGuests: 4,
                    bedrooms: 2,
                    bathrooms: 1,
                    description: 'Modern apartment near Skopje city square.'
                },
                {
                    id: 13,
                    title: 'Zagreb Designer Flat',
                    location: 'Zagreb, Croatia',
                    type: 'apartment',
                    price: 110,
                    rating: 4.5,
                    reviews: 67,
                    image: 'images/cherno-more-hotel.webp',
                    amenities: ['wifi', 'kitchen', 'washer', 'aircon'],
                    maxGuests: 3,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Designer apartment in trendy Zagreb district.'
                },
                {
                    id: 14,
                    title: 'Tirana Traditional House',
                    location: 'Tirana, Albania',
                    type: 'house',
                    price: 65,
                    rating: 4.1,
                    reviews: 35,
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    amenities: ['wifi', 'kitchen', 'parking'],
                    maxGuests: 5,
                    bedrooms: 2,
                    bathrooms: 2,
                    description: 'Traditional Albanian house in Tirana center.'
                },
                {
                    id: 15,
                    title: 'Bratislava Riverside Flat',
                    location: 'Bratislava, Slovakia',
                    type: 'apartment',
                    price: 85,
                    rating: 4.3,
                    reviews: 58,
                    image: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    amenities: ['wifi', 'kitchen', 'aircon'],
                    maxGuests: 4,
                    bedrooms: 2,
                    bathrooms: 1,
                    description: 'Apartment with Danube river views in Bratislava.'
                },
                {
                    id: 16,
                    title: 'Chisinau Cozy Studio',
                    location: 'Chisinau, Moldova',
                    type: 'studio',
                    price: 28,
                    rating: 3.7,
                    reviews: 22,
                    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    amenities: ['wifi', 'kitchen'],
                    maxGuests: 2,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Cozy studio in central Chisinau.'
                },
                {
                    id: 17,
                    title: 'Kiev Historic Apartment',
                    location: 'Kiev, Ukraine',
                    type: 'apartment',
                    price: 45,
                    rating: 4.0,
                    reviews: 52,
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    amenities: ['wifi', 'kitchen', 'parking'],
                    maxGuests: 4,
                    bedrooms: 2,
                    bathrooms: 1,
                    description: 'Historic apartment in Kiev old town.'
                },
                {
                    id: 18,
                    title: 'Minsk Soviet Era Flat',
                    location: 'Minsk, Belarus',
                    type: 'apartment',
                    price: 38,
                    rating: 3.9,
                    reviews: 31,
                    image: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    amenities: ['wifi', 'kitchen'],
                    maxGuests: 3,
                    bedrooms: 1,
                    bathrooms: 1,
                    description: 'Authentic Soviet era apartment in central Minsk.'
                }
            ];

            // Apply filters to local data
            let filteredData = sampleProperties;

            if (filters.location) {
                filteredData = filteredData.filter(property =>
                    property.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }

            if (filters.type) {
                filteredData = filteredData.filter(property => property.type === filters.type);
            }

            if (filters.minPrice) {
                filteredData = filteredData.filter(property => property.price >= filters.minPrice);
            }

            if (filters.maxPrice) {
                filteredData = filteredData.filter(property => property.price <= filters.maxPrice);
            }

            return { success: true, data: filteredData };
        } catch (error) {
            console.error('Error fetching properties:', error);
            return { success: false, message: 'Failed to fetch properties' };
        }
    },

    async getProperty(id) {
        try {
            const response = await api.get(`/properties/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching property:', error);
            return { success: false, message: 'Property not found' };
        }
    },

    async createBooking(bookingData) {
        try {
            const newBooking = {
                ...bookingData,
                id: `RA${Date.now()}`,
                date: new Date().toISOString(),
                status: 'pending'
            };

            const response = await api.post('/bookings', newBooking);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, message: 'Failed to create booking' };
        }
    },

    async getUserBookings(userId) {
        try {
            const response = await api.get(`/bookings?userId=${userId}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return { success: false, message: 'Failed to fetch bookings' };
        }
    },

    async getConversations(userId) {
        try {
            const response = await api.get(`/conversations?userId=${userId}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching conversations:', error);
            return { success: false, message: 'Failed to fetch conversations' };
        }
    },

    async sendMessage(conversationId, messageData) {
        try {
            const conversation = await api.get(`/conversations/${conversationId}`);
            const updatedMessages = [...conversation.data.messages, {
                id: conversation.data.messages.length + 1,
                ...messageData,
                timestamp: new Date().toISOString()
            }];

            const response = await api.patch(`/conversations/${conversationId}`, {
                messages: updatedMessages,
                lastMessage: messageData.text,
                timestamp: new Date().toISOString()
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: 'Failed to send message' };
        }
    },

    async createConversation(conversationData) {
        try {
            const newConversation = {
                ...conversationData,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                unread: 0
            };

            const response = await api.post('/conversations', newConversation);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creating conversation:', error);
            return { success: false, message: 'Failed to create conversation' };
        }
    },

    async getImages(filters = {}) {
        try {
            let url = '/images';
            const params = new URLSearchParams();

            if (filters.propertyId) {
                params.append('propertyId', filters.propertyId);
            }
            if (filters.type) {
                params.append('type', filters.type);
            }

            if (params.toString()) {
                url += '?' + params.toString();
            }

            const response = await api.get(url);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching images:', error);
            return { success: false, message: 'Failed to fetch images' };
        }
    },

    async getImage(id) {
        try {
            const response = await api.get(`/images/${id}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching image:', error);
            return { success: false, message: 'Failed to fetch image' };
        }
    },

    async resolveImageUrl(imageRef) {
        try {
            // Simply return the imageRef as-is, no API calls needed
            // This prevents unnecessary requests to /images/ endpoints
            if (imageRef && (imageRef.startsWith('http') || imageRef.startsWith('images/'))) {
                return imageRef;
            }
            return imageRef || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        } catch (error) {
            console.error('Error resolving image URL:', error);
            return imageRef || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
        }
    },

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    let message = 'Location access denied';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timeout';
                            break;
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000
                }
            );
        });
    },

    async searchHotelsNearLocation(latitude, longitude, checkin, checkout) {
        try {
            const cacheKey = `hotels_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
            const cachedData = await this.getCachedHotels(cacheKey);

            if (cachedData && cachedData.length > 0) {
                console.log('Using cached hotel data');
                return { success: true, data: cachedData, source: 'cache' };
            }

            const fallbackData = await this.getFallbackHotelsData(latitude, longitude);

            await this.cacheHotels(cacheKey, fallbackData);

            return { success: true, data: fallbackData, source: 'external' };
        } catch (error) {
            console.error('Error searching hotels:', error);
            const localData = await this.getProperties();
            return {
                success: true,
                data: localData.data || [],
                source: 'local_fallback',
                message: 'External API unavailable, showing local data'
            };
        }
    },

    async getFallbackHotelsData(latitude, longitude) {
        console.log('getFallbackHotelsData called with:', latitude, longitude);

        try {
            console.log('Trying external API...');
            const response = await this.searchHotelsFromExternalAPI(latitude, longitude);
            if (response && response.length > 0) {
                console.log('External API returned:', response.length, 'hotels');
                return response;
            }
        } catch (error) {
            console.warn('External hotels API failed, using backup data:', error);
        }

        try {
            console.log('Trying backup API...');
            const backupHotels = await this.getBackupHotelsData(latitude, longitude);
            if (backupHotels && backupHotels.length > 0) {
                console.log('Backup API returned:', backupHotels.length, 'hotels');
                return backupHotels;
            }
        } catch (error) {
            console.warn('Backup API also failed:', error);
        }
        console.log('All APIs failed, generating mock data...');
        const cityName = await this.getCityNameFromCoords(latitude, longitude);
        console.log('City name:', cityName);

        const mockHotels = [
            {
                id: `ext_${Date.now()}_1`,
                name: `Grand ${cityName} Hotel`,
                location: `${cityName} City Center`,
                type: 'hotel',
                price: Math.floor(Math.random() * 100) + 80,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                description: `Luxury hotel in the heart of ${cityName}`,
                coordinates: { lat: latitude + 0.01, lng: longitude + 0.01 },
                isExternal: true
            },
            {
                id: `ext_${Date.now()}_2`,
                name: `${cityName} Boutique Inn`,
                location: `${cityName} Historic District`,
                type: 'boutique',
                price: Math.floor(Math.random() * 80) + 60,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: ['WiFi', 'Restaurant', 'Spa'],
                image: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                description: `Charming boutique hotel in historic ${cityName}`,
                coordinates: { lat: latitude - 0.01, lng: longitude + 0.01 },
                isExternal: true
            },
            {
                id: `ext_${Date.now()}_3`,
                name: `${cityName} Business Center`,
                location: `${cityName} Business District`,
                type: 'business',
                price: Math.floor(Math.random() * 70) + 70,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: ['WiFi', 'Business Center', 'Gym'],
                image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                description: `Perfect for business travelers in ${cityName}`,
                coordinates: { lat: latitude + 0.02, lng: longitude - 0.01 },
                isExternal: true
            }
        ];

        console.log('Generated mock hotels:', mockHotels);
        return mockHotels;
    },

    async searchHotelsFromExternalAPI(latitude, longitude) {
        try {
            const response = await fetch(
                `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode?latitude=${latitude}&longitude=${longitude}&radius=20`,
                {
                    headers: {
                        'Authorization': 'Bearer YOUR_AMADEUS_TOKEN' 
                    }
                }
            );

            if (!response.ok) throw new Error('Amadeus API failed');

            const data = await response.json();

            return data.data?.map(hotel => ({
                id: `amadeus_${hotel.id}`,
                name: hotel.name,
                location: hotel.address?.cityName || 'Unknown City',
                type: 'hotel',
                price: Math.floor(Math.random() * 150) + 50,
                rating: (Math.random() * 2 + 3).toFixed(1),
                amenities: ['WiFi', 'Reception'],
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                description: `Hotel in ${hotel.address?.cityName}`,
                coordinates: {
                    lat: parseFloat(hotel.geoCode?.latitude),
                    lng: parseFloat(hotel.geoCode?.longitude)
                },
                isExternal: true
            })) || [];

        } catch (error) {
            console.log('Amadeus API not available (expected for demo)');
            throw error;
        }
    },

    async getMockApiHotels(latitude = null, longitude = null) {
        try {
            let url = 'http://localhost:3004/api/v1/hotels/search';

            if (latitude && longitude) {
                url += `?latitude=${latitude}&longitude=${longitude}&radius=50`;
            }

            console.log('Calling Mock API:', url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Mock API failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data) {
                return data.data.map(hotel => ({
                    id: hotel.id,
                    title: hotel.title || hotel.name,
                    location: hotel.location,
                    type: hotel.type,
                    price: hotel.price,
                    rating: hotel.rating,
                    reviews: hotel.reviews || Math.floor(Math.random() * 100) + 10,
                    image: hotel.image,
                    amenities: hotel.amenities || ['wifi', 'parking'],
                    maxGuests: hotel.maxGuests || 4,
                    bedrooms: hotel.bedrooms || 1,
                    bathrooms: hotel.bathrooms || 1,
                    description: hotel.description,
                    source: 'mock-api',
                    isExternal: true
                }));
            } else {
                throw new Error('Mock API returned no data');
            }
        } catch (error) {
            console.error('Mock API call failed:', error);
            throw error;
        }
    },

    async getBackupHotelsData(latitude, longitude) {
        try {
    
            const placesData = await this.getNearbyPlaces(latitude, longitude);

            if (placesData && placesData.length > 0) {
                return placesData;
            }

            
            const foursquareData = await this.getFoursquareHotels(latitude, longitude);

            if (foursquareData && foursquareData.length > 0) {
                return foursquareData;
            }

            throw new Error('All external APIs failed');

        } catch (error) {
            console.log('External APIs not available, using fallback:', error);
            throw error;
        }
    },

    async getNearbyPlaces(latitude, longitude) {
        try {

            const query = `hotel`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${query}&lat=${latitude}&lon=${longitude}&bounded=1&viewbox=${longitude-0.1},${latitude-0.1},${longitude+0.1},${latitude+0.1}&limit=10&addressdetails=1`
            );

            if (!response.ok) throw new Error('Nominatim API failed');

            const data = await response.json();

            return data.filter(place =>
                place.class === 'tourism' &&
                (place.type === 'hotel' || place.type === 'guest_house' || place.type === 'hostel')
            ).slice(0, 6).map((place, index) => ({
                id: `nominatim_${place.place_id}`,
                name: place.display_name.split(',')[0] || `Hotel ${index + 1}`,
                location: `${place.address?.city || place.address?.town || place.address?.village || 'Unknown'}, ${place.address?.country || 'Unknown'}`,
                type: place.type || 'hotel',
                price: Math.floor(Math.random() * 150) + 50,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: this.getRandomAmenities(),
                image: this.getHotelImage(place.type),
                description: `${place.type.replace('_', ' ')} in ${place.address?.city || 'the area'}`,
                coordinates: {
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon)
                },
                isExternal: true,
                source: 'nominatim'
            }));

        } catch (error) {
            console.log('Nominatim API failed:', error);
            throw error;
        }
    },

    async getFoursquareHotels(latitude, longitude) {
        try {
            const response = await fetch(
                `https://api.foursquare.com/v3/places/search?ll=${latitude}%2C${longitude}&categories=19014&limit=8&fields=name%2Clocation%2Ccategories%2Crating`,
                {
                    headers: {
                        'Authorization': 'fsq3KGnD+K7YqQj4iW8HhQ0l4C2jQ4K4k5L6m7N8o9P0q1R2s3T4u5V6w7X8y9Z0',
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Foursquare API failed');

            const data = await response.json();

            return data.results?.map((place, index) => ({
                id: `foursquare_${place.fsq_id}`,
                name: place.name || `Hotel ${index + 1}`,
                location: `${place.location?.locality || place.location?.region || 'Unknown City'}`,
                type: 'hotel',
                price: Math.floor(Math.random() * 180) + 70,
                rating: place.rating ? place.rating.toFixed(1) : (Math.random() * 1.5 + 3.5).toFixed(1),
                amenities: this.getRandomAmenities(),
                image: this.getHotelImage('hotel'),
                description: `Hotel in ${place.location?.locality || 'the area'}`,
                coordinates: {
                    lat: place.location?.lat || latitude,
                    lng: place.location?.lng || longitude
                },
                isExternal: true,
                source: 'foursquare'
            })) || [];

        } catch (error) {
            console.log('Foursquare API failed (expected for demo):', error);
            throw error;
        }
    },

    getRandomAmenities() {
        const allAmenities = ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking', 'Business Center', 'Room Service', 'Laundry', 'Pet Friendly'];
        const count = Math.floor(Math.random() * 4) + 2;
        const shuffled = allAmenities.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    getHotelImage(type) {
        const images = {
            hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            hostel: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            guest_house: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            boutique: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
        return images[type] || images.hotel;
    },

    async getCityNameFromCoords(latitude, longitude) {
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            return data.city || data.locality || 'Unknown City';
        } catch (error) {
            return 'Unknown City';
        }
    },

    async getCachedHotels(cacheKey) {
        try {
            const response = await api.get(`/hotel_cache?key=${cacheKey}`);
            const cacheEntry = response.data[0];

            if (cacheEntry) {
                const cacheAge = Date.now() - new Date(cacheEntry.timestamp).getTime();
                const maxAge = 24 * 60 * 60 * 1000;

                if (cacheAge < maxAge) {
                    return cacheEntry.data;
                } else {
                    await api.delete(`/hotel_cache/${cacheEntry.id}`);
                }
            }
            return null;
        } catch (error) {
            console.log('No cached data found');
            return null;
        }
    },

    async cacheHotels(cacheKey, hotelData) {
        try {
            const cacheEntry = {
                id: Date.now(),
                key: cacheKey,
                data: hotelData,
                timestamp: new Date().toISOString()
            };

            await api.post('/hotel_cache', cacheEntry);
        } catch (error) {
            console.error('Failed to cache hotel data:', error);
        }
    },

    async reverseGeocode(latitude, longitude) {
        try {
            const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            return {
                city: data.city || data.locality || 'Unknown City',
                country: data.countryName || 'Unknown Country',
                address: data.localityInfo?.administrative?.[0]?.name || data.principalSubdivision
            };
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            return {
                city: 'Unknown City',
                country: 'Unknown Country',
                address: 'Location detected'
            };
        }
    }
};

window.ApiService = ApiService;