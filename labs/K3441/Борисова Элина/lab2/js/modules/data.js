window.MOCK_USERS = [
    { id: 1, username: 'demo', email: 'demo@example.com', password: '123456', role: 'user' },
    { id: 2, username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' }
];

window.MOCK_CHATS = [
    {
        id: 1,
        propertyId: 1,
        propertyTitle: 'Уютная квартира в центре',
        tenantId: 2,
        tenantName: 'Иван',
        landlordId: 1,
        landlordName: 'Анна',
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        isActive: true
    },
    {
        id: 2,
        propertyId: 2,
        propertyTitle: 'Дом с садом',
        tenantId: 2,
        tenantName: 'Иван',
        landlordId: 1,
        landlordName: 'Анна',
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        isActive: true
    }
];

window.MOCK_MESSAGES = {
    1: [
        { id: 1, chatId: 1, senderId: 2, message: 'Здравствуйте! Квартира ещё свободна?', timestamp: Date.now() - 1000*60*60, isRead: false },
        { id: 2, chatId: 1, senderId: 1, message: 'Да, свободна. Хотите посмотреть?', timestamp: Date.now() - 1000*30, isRead: true }
    ],
    2: [
        { id: 3, chatId: 2, senderId: 2, message: 'Добрый день! Дом на Петроградской ещё доступен?', timestamp: Date.now() - 1000*90, isRead: false },
        { id: 4, chatId: 2, senderId: 1, message: 'Да, доступен. Когда хотите приехать?', timestamp: Date.now() - 1000*20, isRead: false }
    ]
};

(function initStorage() {
    if (!localStorage.getItem('rentestate_chats')) {
        localStorage.setItem('rentestate_chats', JSON.stringify(window.MOCK_CHATS));
    }

    if (!localStorage.getItem('rentestate_messages')) {
        const allMessages = Object.values(window.MOCK_MESSAGES).flat();
        localStorage.setItem('rentestate_messages', JSON.stringify(allMessages));
    }
})();
