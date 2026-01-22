// моки пользователей
const MOCK_USERS = [
    {
        id: 1,
        username: 'test one',
        email: 'oneone@one.com',
        password: '123456',
        role: 'user'
    },
    {
        id: 2,
        username: 'test two',
        email: 'twotwo@two.com',
        password: '123456',
        role: 'user'
    },
    {
        id: 3,
        username: 'test three',
        email: 'three@three.com',
        password: '123456',
        role: 'user'
    }
];

// моки объектов недвижимости
const MOCK_PROPERTIES = [
    {
        id: 1,
        title: "Уютная квартира в центре Москвы",
        description: "Просторная квартира с современным ремонтом в пешей доступности от метро. Идеально подходит для семьи или компании друзей.",
        rentalType: "daily",
        price: 4000,
        location: "Москва",
        propertyType: "apartment",
        images: ["./images/property1.jpg"],
        ownerId: 1,
        amenities: ["Wi-Fi", "TV", "Кондиционер", "Кухня"],
        area: 65,
        rooms: 2
    },
    {
        id: 2,
        title: "Загородный дом у озера",
        description: "Красивый деревянный дом с камином и выходом к озеру. Отличное место для отдыха от городской суеты.",
        rentalType: "monthly",
        price: 25000,
        location: "Московская область",
        propertyType: "house",
        images: ["./images/property2.jpg"],
        ownerId: 1,
        amenities: ["Камин", "Баня", "Терраса", "Парковка"],
        area: 120,
        rooms: 4
    },
    {
        id: 3,
        title: "Комната в современной квартире",
        description: "Светлая комната в новой квартире с общей кухней и ванной. Все необходимое для комфортного проживания.",
        rentalType: "longterm",
        price: 15000,
        location: "Санкт-Петербург",
        propertyType: "room",
        images: ["./images/property3.jpg"],
        ownerId: 3,
        amenities: ["Wi-Fi", "Стиральная машина", "Общая кухня"],
        area: 18,
        rooms: 1
    },
    {
        id: 4,
        title: "Апартаменты с видом на горы",
        description: "Элитные апартаменты в историческом центре с панорамным видом. Полностью оборудована техникой премиум-класса.",
        rentalType: "daily",
        price: 8000,
        location: "Тбилиси",
        propertyType: "apartment",
        images: ["./images/property4.jpg"],
        ownerId: 2,
        amenities: ["Wi-Fi", "TV", "Кондиционер", "Спа", "Джакузи"],
        area: 85,
        rooms: 3
    },
    {
        id: 5,
        title: "Коттедж в сосновом лесу",
        description: "Уютный коттедж для большой компании. 4 спальни, сауна, баня и зона барбекю. Природа и свежий воздух гарантированы.",
        rentalType: "monthly",
        price: 45000,
        location: "Карелия",
        propertyType: "house",
        images: ["./images/property5.jpg"],
        ownerId: 1,
        amenities: ["Сауна", "Баня", "Барбекю", "Гараж", "Камин"],
        area: 200,
        rooms: 5
    },
    {
        id: 6,
        title: "Студия для молодой пары",
        description: "Компактная студия с евроремонтом в новом жилом комплексе. Вся необходимая техника, консьерж, парковка.",
        rentalType: "longterm",
        price: 22000,
        location: "Москва",
        propertyType: "apartment",
        images: ["./images/property6.jpg"],
        ownerId: 3,
        amenities: ["Wi-Fi", "TV", "Стиральная машина", "Парковка", "Консьерж"],
        area: 35,
        rooms: 1
    }
];

// справочники с маппингами
const propertyTypeMap = {
    'apartment': 'Квартира',
    'house': 'Дом',
    'room': 'Комната'
};

const rentalTypeMap = {
    'daily': 'Посуточно',
    'monthly': 'Помесячно',
    'longterm': 'Долгосрочная'
};

const applicationStatusMap = {
    'pending': 'Ожидает подтверждения',
    'approved': 'Подтверждена',
    'rejected': 'Отклонена'
};

// экспорт в глобальную область видимости
window.MOCK_USERS = MOCK_USERS;
window.MOCK_PROPERTIES = MOCK_PROPERTIES;
window.propertyTypeMap = propertyTypeMap;
window.rentalTypeMap = rentalTypeMap;
window.applicationStatusMap = applicationStatusMap;