import { api } from './http';

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

const LOCAL_CARD_IMG = '/assets/property.jpg'

export async function createProperty(payload) {
    const { data } = await api.post('/properties', payload);
    return data;
}

export async function getAllProperties() {
    const { data } = await api.get('/properties');
    return data.map(normalizeProperty);
}

export async function getPropertyById(id) {
    const { data } = await api.get(`/properties/${id}`);
    return normalizeProperty(data);
}

export async function getUserProperties(userId) {
    const all = await getAllProperties();
    return all.filter(p => p.ownerId === userId);
}

export async function searchProperties(filters = {}) {
    const payload = {};
    if (filters.location) payload.location = filters.location;
    if (filters.propertyType) payload.propertyType = filters.propertyType;
    if (filters.rentalType) payload.rentalType = filters.rentalType;
    if (filters.minPrice != null) payload.minPrice = Number(filters.minPrice);
    if (filters.maxPrice != null) payload.maxPrice = Number(filters.maxPrice);

    if (!Object.keys(payload).length) return await getAllProperties();

    const { data } = await api.post('/properties/search', payload);
    return data.map(normalizeProperty);
}

export async function updateProperty(id, payload) {
    const { data } = await api.put(`/properties/${id}`, payload);
    return data;
}

export async function deleteProperty(id) {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
}

function normalizeProperty(p) {
    return {
        ...p,
        price: Number(p.price)
    };
}

export function getPlaceholderImage(propertyType) {
    return LOCAL_CARD_IMG
}