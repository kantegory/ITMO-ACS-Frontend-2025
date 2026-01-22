import { request, API_BASE } from './api.js';

export const propertyTypeMap = {
    apartment: 'Квартира',
    house: 'Дом',
    villa: 'Вилла',
    cottage: 'Коттедж',
    studio: 'Студия',
    loft: 'Лофт'
};

export const rentalTypeMap = {
    daily: 'Посуточно',
    monthly: 'Помесячно',
    yearly: 'Годовая'
};

const LOCAL_CARD_IMG = './assets/property.jpg';

export async function getAllProperties() {
    try {
        const res = await request('/properties', 'GET');
        return (res || []).map(normalizeProperty);
    } catch (err) {
        console.error('getAllProperties error', err);
        throw err;
    }
}

export async function getPropertyById(id) {
    try {
        const res = await request(`/properties/${id}`, 'GET');
        return normalizeProperty(res);
    } catch (err) {
        console.error('getPropertyById error', err);
        throw err;
    }
}

export async function searchProperties(filters = {}) {
    try {
        const queryParams = new URLSearchParams();

        if (filters.location) queryParams.append('location', String(filters.location));
        if (filters.propertyType) queryParams.append('propertyType', String(filters.propertyType));
        if (filters.rentalType) queryParams.append('rentalType', String(filters.rentalType));

        if (filters.minPrice != null && filters.minPrice !== '' && !Number.isNaN(Number(filters.minPrice))) {
            queryParams.append('minPrice', Number(filters.minPrice));
        }

        if (filters.maxPrice != null && filters.maxPrice !== '' && !Number.isNaN(Number(filters.maxPrice))) {
            queryParams.append('maxPrice', Number(filters.maxPrice));
        }

        if (queryParams.toString() === '') {
            return await getAllProperties();
        }

        const queryString = queryParams.toString();
        const url = `/properties/search${queryString ? '?' + queryString : ''}`;

        console.log('Searching with URL:', url);

        const res = await request(url, 'GET');
        return (res || []).map(normalizeProperty);
    } catch (err) {
        console.error('searchProperties error', err);
        throw err;
    }
}

export function getPlaceholderImage(propertyType) {
    const local = LOCAL_CARD_IMG;
    const typeName = propertyTypeMap[propertyType] || 'недвижимость';
    return `${local}`;
}

function normalizeProperty(p) {
    if (!p) return p;
    return {
        ...p,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
        rentalType: p.rentalType,
        propertyType: p.propertyType
    };
}

export async function createProperty(propertyData) {
    try {
        const dataToSend = {
            title: propertyData.title,
            description: propertyData.description || '',
            rentalType: propertyData.rentalType,
            price: propertyData.price,
            location: propertyData.location,
            propertyType: propertyData.propertyType
        };

        if (propertyData.area) dataToSend.area = propertyData.area;
        if (propertyData.rooms) dataToSend.rooms = propertyData.rooms;
        if (propertyData.amenities) dataToSend.amenities = propertyData.amenities;

        console.log('Creating property with data:', dataToSend);

        const response = await request('/properties', 'POST', dataToSend);
        return response;
    } catch (error) {
        console.error('Failed to create property:', error);
        throw new Error(error.message || 'Не удалось создать объект недвижимости');
    }
}

export async function updateProperty(id, propertyData) {
    try {
        if (!id) {
            throw new Error('Property ID is required');
        }

        const response = await request(`/properties/${id}`, 'PUT', propertyData);
        return response;
    } catch (error) {
        console.error('Failed to update property:', error);
        throw new Error(error.message || 'Не удалось обновить объект недвижимости');
    }
}

export async function deleteProperty(id) {
    try {
        if (!id) {
            throw new Error('Property ID is required');
        }

        const response = await request(`/properties/${id}`, 'DELETE');
        return response;
    } catch (error) {
        console.error('Failed to delete property:', error);
        throw new Error(error.message || 'Не удалось удалить объект недвижимости');
    }
}

export async function getUserProperties(userId) {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const allProperties = await getAllProperties();
        return allProperties.filter(property => property.ownerId === userId);
    } catch (error) {
        console.error('Failed to get user properties:', error);
        throw new Error(error.message || 'Не удалось получить объекты пользователя');
    }
}