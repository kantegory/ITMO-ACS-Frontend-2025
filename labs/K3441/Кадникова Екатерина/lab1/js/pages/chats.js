let currentChatId = null;
let messageCheckInterval = null;

// форматирование даты сообщения
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 60 * 1000) { // меньше часа
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 24 * 60 * 60 * 1000) { // меньше суток
        return 'Вчера ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
}

// загрузка списка чатов
function loadChatsList() {
    const chatsList = document.getElementById('chatsList');
    const noChats = document.getElementById('noChats');
    const user = authManager.getCurrentUser();
    const chats = getUserChats(user.id);

    // обновляем бейдж непрочитанных
    const unreadCount = getUnreadMessagesCount(user.id);
    const unreadBadge = document.getElementById('unreadBadge');
    if (unreadCount > 0) {
        unreadBadge.textContent = unreadCount;
        unreadBadge.classList.remove('d-none');
    } else {
        unreadBadge.classList.add('d-none');
    }

    if (chats.length === 0) {
        chatsList.innerHTML = '';
        noChats.classList.remove('d-none');
        return;
    }

    noChats.classList.add('d-none');

    chatsList.innerHTML = chats.map(chat => {
        const messages = getChatMessages(chat.id);
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(msg =>
            msg.senderId !== user.id && !msg.isRead
        ).length;

        const otherUser = user.id === chat.tenantId ?
            { name: chat.landlordName, role: 'Арендодатель' } :
            { name: chat.tenantName, role: 'Арендатор' };

        return `
            <a href="#" class="list-group-item list-group-item-action chat-item ${chat.id === currentChatId ? 'active' : ''}"
               onclick="selectChat(${chat.id})">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${otherUser.name}</h6>
                    ${unreadCount > 0 ? `<span class="badge bg-danger rounded-pill">${unreadCount}</span>` : ''}
                </div>
                <p class="mb-1">${chat.propertyTitle}</p>
                <small class="text-muted">${otherUser.role}</small>
                ${lastMessage ? `
                    <div class="mt-2">
                        <small class="text-muted">${lastMessage.message.substring(0, 50)}${lastMessage.message.length > 50 ? '...' : ''}</small>
                        <br>
                        <small class="text-muted">${formatMessageTime(lastMessage.timestamp)}</small>
                    </div>
                ` : ''}
            </a>
        `;
    }).join('');
}

// выбор чата
function selectChat(chatId) {
    currentChatId = chatId;
    loadChatsList();
    loadChatMessages(chatId);

    document.getElementById('noChatSelected').classList.add('d-none');
    document.getElementById('chatArea').classList.remove('d-none');

    const user = authManager.getCurrentUser();
    markMessagesAsRead(chatId, user.id);

    if (messageCheckInterval) {
        clearInterval(messageCheckInterval);
    }
    messageCheckInterval = setInterval(() => {
        if (currentChatId === chatId) {
            loadChatMessages(chatId, false);
        }
    }, 3000);
}

// загрузка сообщений чата
function loadChatMessages(chatId, scrollToBottom = true) {
    const messagesList = document.getElementById('messagesList');
    const chat = getUserChats(authManager.getCurrentUser().id).find(c => c.id === chatId);

    if (!chat) return;

    const user = authManager.getCurrentUser();
    const otherUser = user.id === chat.tenantId ?
        { name: chat.landlordName, role: 'Арендодатель' } :
        { name: chat.tenantName, role: 'Арендатор' };

    document.getElementById('chatTitle').textContent = otherUser.name;
    document.getElementById('chatSubtitle').textContent = `${chat.propertyTitle} • ${otherUser.role}`;

    const messages = getChatMessages(chatId);

    messagesList.innerHTML = messages.map(message => {
        const isOwnMessage = message.senderId === user.id;
        return `
            <div class="message ${isOwnMessage ? 'own-message' : 'other-message'}">
                <div class="message-content">
                    <div class="message-text">${message.message}</div>
                    <div class="message-time">${formatMessageTime(message.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');

    if (scrollToBottom) {
        scrollToBottomMessages();
    }

    loadChatsList();
}

// прокрутка к последнему сообщению
function scrollToBottomMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// отправка сообщения
function sendNewMessage(event) {
    event.preventDefault();

    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (!messageText || !currentChatId) return;

    const user = authManager.getCurrentUser();
    sendMessage(currentChatId, user.id, messageText);

    messageInput.value = '';
    loadChatMessages(currentChatId);
}

// назад к списку чатов
function goBackToChats() {
    currentChatId = null;
    document.getElementById('noChatSelected').classList.remove('d-none');
    document.getElementById('chatArea').classList.add('d-none');
    loadChatsList();

    if (messageCheckInterval) {
        clearInterval(messageCheckInterval);
        messageCheckInterval = null;
    }
}

// обновление навигации
function updateNavigationForChats() {
    const navLinks = document.querySelector('.navbar-nav');
    if (!navLinks) return;

    const isAuth = authManager.isAuthenticated();
    const user = authManager.getCurrentUser();

    if (isAuth && user) {
        navLinks.innerHTML = `
            <li class="nav-item">
                <span class="nav-link text-light">Привет, ${user.username}!</span>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="../../chats.html">Чаты</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../../profile.html">Личный кабинет</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="authManager.logout()">Выйти</a>
            </li>
        `;
    } else {
        navLinks.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Вход</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../../register.html">Регистрация</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="../../chats.html">Чаты</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="../../profile.html">Личный кабинет</a>
            </li>
        `;
    }
}

// инициализация страницы
document.addEventListener('DOMContentLoaded', function() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    updateNavigationForChats();
    loadChatsList();

    document.getElementById('messageForm').addEventListener('submit', sendNewMessage);

    setInterval(loadChatsList, 5000);
});

// экспорт глобальных функций
window.selectChat = selectChat;
window.goBackToChats = goBackToChats;
window.sendNewMessage = sendNewMessage;