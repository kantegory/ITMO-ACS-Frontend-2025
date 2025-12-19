import { request } from '../core/http.js';

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

const LOCAL_CARD_IMG = '../assets/property.jpg';

export async function getAllProperties() {
    const res = await request('/properties', 'GET');
    return (res || []).map(normalizeProperty);
}

export async function getPropertyById(id) {
    const res = await request(`/properties/${id}`, 'GET');
    return normalizeProperty(res);
}

export async function searchProperties(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.propertyType) queryParams.append('propertyType', filters.propertyType);
    if (filters.rentalType) queryParams.append('rentalType', filters.rentalType);
    if (filters.minPrice != null) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice != null) queryParams.append('maxPrice', filters.maxPrice);

    if (!queryParams.toString()) return await getAllProperties();
    const res = await request(`/properties/search?${queryParams}`, 'GET');
    return (res || []).map(normalizeProperty);
}

export function getPlaceholderImage(propertyType) {
    return LOCAL_CARD_IMG;
}

export async function createProperty(data) {
    return request('/properties', 'POST', data);
}

export async function updateProperty(id, data) {
    return request(`/properties/${id}`, 'PUT', data);
}

export async function deleteProperty(id) {
    return request(`/properties/${id}`, 'DELETE');
}

export async function getUserProperties(userId) {
    const all = await getAllProperties();
    return all.filter(p => p.ownerId === userId);
}

function normalizeProperty(p) {
    if (!p) return p;
    return {
        ...p,
        price: typeof p.price === 'string' ? parseFloat(p.price) : p.price
    };
}