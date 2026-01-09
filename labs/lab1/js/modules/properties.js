// получить сохраненные объекты из localStorage
function getStoredProperties() {
    try {
        const stored = localStorage.getItem('rentestate_properties');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Ошибка загрузки объектов:', error);
        return [];
    }
}

// сохранить объекты в localStorage
function saveProperties(properties) {
    try {
        localStorage.setItem('rentestate_properties', JSON.stringify(properties));
        return true;
    } catch (error) {
        console.error('Ошибка сохранения объектов:', error);
        return false;
    }
}

// получить все объекты (моки + пользовательские)
function getAllProperties() {
    const storedProperties = getStoredProperties();
    const allProperties = [...window.MOCK_PROPERTIES, ...storedProperties];

    // убираем дубликаты по id
    const uniqueProperties = allProperties.filter((property, index, self) =>
        index === self.findIndex(p => p.id === property.id)
    );

    return uniqueProperties;
}

// создать новый объект недвижимости
function createProperty(propertyData) {
    try {
        const properties = getAllProperties();

        const maxId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) : 0;

        const newProperty = {
            id: maxId + 1,
            title: propertyData.title,
            description: propertyData.description,
            rentalType: propertyData.rentalType,
            price: propertyData.price,
            location: propertyData.location,
            propertyType: propertyData.propertyType,
            images: propertyData.images || [],
            ownerId: propertyData.ownerId,
            amenities: propertyData.amenities || [],
            area: propertyData.area || null,
            rooms: propertyData.rooms || null
        };

        const storedProperties = getStoredProperties();
        storedProperties.push(newProperty);

        if (saveProperties(storedProperties)) {
            console.log('Новый объект создан:', newProperty);
            return newProperty;
        } else {
            return null;
        }

    } catch (error) {
        console.error('Ошибка создания объекта:', error);
        return null;
    }
}

// получить объект по id
function getPropertyById(propertyId) {
    const allProperties = getAllProperties();
    return allProperties.find(property => property.id === propertyId);
}

// получить объекты по владельцу
function getPropertiesByOwner(ownerId) {
    const allProperties = getAllProperties();
    return allProperties.filter(property => property.ownerId === ownerId);
}

// получить placeholder изображение
function getPlaceholderImage(propertyType) {
    const colorMap = {
        'apartment': '4A90E2',
        'house': '50E3C2',
        'room': 'B8E986'
    };

    const color = colorMap[propertyType] || '4A90E2';
    const typeName = window.propertyTypeMap[propertyType] || 'недвижимость';

    return `https://via.placeholder.com/300x200/${color}/FFFFFF?text=${encodeURIComponent(typeName)}`;
}

// фильтрация объектов
function filterProperties(properties, filters) {
    return properties.filter(property => {
        // фильтр по местоположению
        if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }

        // фильтр по типу недвижимости
        if (filters.propertyType && property.propertyType !== filters.propertyType) {
            return false;
        }

        // фильтр по типу аренды
        if (filters.rentalType && property.rentalType !== filters.rentalType) {
            return false;
        }

        // фильтр по минимальной цене
        if (filters.minPrice && property.price < parseInt(filters.minPrice)) {
            return false;
        }

        // фильтр по максимальной цене
        if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) {
            return false;
        }

        return true;
    });
}

// экспорт функций
window.getAllProperties = getAllProperties;
window.createProperty = createProperty;
window.getStoredProperties = getStoredProperties;
window.getPropertyById = getPropertyById;
window.getPropertiesByOwner = getPropertiesByOwner;
window.getPlaceholderImage = getPlaceholderImage;
window.filterProperties = filterProperties;