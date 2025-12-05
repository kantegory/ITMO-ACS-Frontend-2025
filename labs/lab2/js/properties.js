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
        const payload = {};
        if (filters.location) payload.location = String(filters.location);
        if (filters.propertyType) payload.propertyType = String(filters.propertyType);
        if (filters.rentalType) payload.rentalType = String(filters.rentalType);
        if (filters.minPrice != null && filters.minPrice !== '' && !Number.isNaN(Number(filters.minPrice))) payload.minPrice = Number(filters.minPrice);
        if (filters.maxPrice != null && filters.maxPrice !== '' && !Number.isNaN(Number(filters.maxPrice))) payload.maxPrice = Number(filters.maxPrice);

        if (Object.keys(payload).length === 0) return await getAllProperties();

        const res = await request('/properties/search', 'POST', payload);
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