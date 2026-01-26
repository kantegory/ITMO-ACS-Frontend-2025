let currentChatId = null;
let messageCheckInterval = null;

function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60 * 60 * 1000) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 24 * 60 * 60 * 1000) {
        return 'Вчера ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
}

function loadChatsList() {
    const chatsList = document.getElementById('dialogsList');
    const empty = document.getElementById('emptyDialogs');

    const user = authManager.getCurrentUser();
    const chats = getUserChats(user.id);

    if (chats.length === 0) {
        chatsList.innerHTML = '';
        empty.classList.remove('d-none');
        return;
    }

    empty.classList.add('d-none');

    chatsList.innerHTML = chats.map(chat => {
        const otherUser = user.id === chat.tenantId
            ? chat.landlordName
            : chat.tenantName;

        return `
            <a href="#" class="list-group-item list-group-item-action"
               onclick="selectChat(${chat.id})">
                <strong>${otherUser}</strong>
                <div class="small text-muted">${chat.propertyTitle}</div>
            </a>
        `;
    }).join('');
}

function selectChat(chatId) {
    currentChatId = chatId;

    document.getElementById('dialogPlaceholder').classList.add('d-none');
    document.getElementById('dialogWindow').classList.remove('d-none');

    loadChatMessages(chatId);

    const user = authManager.getCurrentUser();
    markMessagesAsRead(chatId, user.id);
}

function loadChatMessages(chatId) {
    const messagesBox = document.getElementById('dialogMessages');
    const user = authManager.getCurrentUser();

    const messages = getChatMessages(chatId);

    messagesBox.innerHTML = messages.map(msg => `
        <div class="mb-2 ${msg.senderId === user.id ? 'text-end' : ''}">
            <span class="badge bg-${msg.senderId === user.id ? 'dark' : 'secondary'}">
                ${msg.message}
            </span>
        </div>
    `).join('');
}

function scrollToBottomMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

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

document.addEventListener('DOMContentLoaded', function () {
    if (!authManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    loadChatsList();

    document
        .getElementById('messageForm')
        .addEventListener('submit', sendNewMessage);

    setInterval(loadChatsList, 5000);
});

window.selectChat = selectChat;
window.goBackToChats = goBackToChats;
window.sendNewMessage = sendNewMessage;