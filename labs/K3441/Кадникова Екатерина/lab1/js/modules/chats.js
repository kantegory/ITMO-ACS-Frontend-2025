// получить все чаты
function getChats() {
    return JSON.parse(localStorage.getItem('rentestate_chats') || '[]');
}

// сохранить чаты
function saveChats(chats) {
    localStorage.setItem('rentestate_chats', JSON.stringify(chats));
}

// получить все сообщения
function getMessages() {
    return JSON.parse(localStorage.getItem('rentestate_messages') || '[]');
}

// сохранить сообщения
function saveMessages(messages) {
    localStorage.setItem('rentestate_messages', JSON.stringify(messages));
}

// создать или получить существующий чат
function getOrCreateChat(propertyId, tenantId, landlordId) {
    const chats = getChats();

    let chat = chats.find(c =>
        c.propertyId === propertyId &&
        c.tenantId === tenantId &&
        c.landlordId === landlordId
    );

    if (!chat) {
        const property = getPropertyById(propertyId);
        const tenant = getUserById(tenantId);
        const landlord = getUserById(landlordId);

        chat = {
            id: Date.now(),
            propertyId: propertyId,
            propertyTitle: property.title,
            tenantId: tenantId,
            tenantName: tenant.username,
            landlordId: landlordId,
            landlordName: landlord.username,
            createdAt: new Date().toISOString(),
            lastMessageAt: new Date().toISOString(),
            isActive: true
        };

        chats.push(chat);
        saveChats(chats);

        console.log('создан новый чат:', chat);
    } else {
        console.log('найден существующий чат:', chat);
    }

    return chat;
}

// получить чаты пользователя
function getUserChats(userId) {
    const chats = getChats();
    return chats.filter(chat =>
        chat.tenantId === userId || chat.landlordId === userId
    ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
}

// получить сообщения чата
function getChatMessages(chatId) {
    const messages = getMessages();
    return messages
        .filter(msg => msg.chatId === chatId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// отправить сообщение
function sendMessage(chatId, senderId, messageText) {
    const messages = getMessages();
    const chats = getChats();

    const message = {
        id: Date.now(),
        chatId: chatId,
        senderId: senderId,
        message: messageText,
        timestamp: new Date().toISOString(),
        isRead: false
    };

    messages.push(message);
    saveMessages(messages);

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
        chat.lastMessageAt = new Date().toISOString();
        saveChats(chats);
    }

    return message;
}

// пометить сообщения как прочитанные
function markMessagesAsRead(chatId, userId) {
    const messages = getMessages();
    const updatedMessages = messages.map(msg => {
        if (msg.chatId === chatId && msg.senderId !== userId && !msg.isRead) {
            return { ...msg, isRead: true };
        }
        return msg;
    });

    saveMessages(updatedMessages);
}

// получить количество непрочитанных сообщений
function getUnreadMessagesCount(userId) {
    const messages = getMessages();
    const userChats = getUserChats(userId);

    return messages.filter(msg => {
        const chat = userChats.find(c => c.id === msg.chatId);
        return chat && msg.senderId !== userId && !msg.isRead;
    }).length;
}

// экспорт функций
window.getOrCreateChat = getOrCreateChat;
window.getUserChats = getUserChats;
window.getChatMessages = getChatMessages;
window.sendMessage = sendMessage;
window.markMessagesAsRead = markMessagesAsRead;
window.getUnreadMessagesCount = getUnreadMessagesCount;