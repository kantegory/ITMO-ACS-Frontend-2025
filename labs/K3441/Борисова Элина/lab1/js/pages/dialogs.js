console.log('dialogs.js loaded');

let activeChatId = null;

if (!localStorage.getItem('rentestate_chats')) {
    localStorage.setItem('rentestate_chats', JSON.stringify(window.MOCK_CHATS));
}
if (!localStorage.getItem('rentestate_messages')) {
    const allMessages = [];
    Object.values(window.MOCK_MESSAGES).forEach(msgs => allMessages.push(...msgs));
    localStorage.setItem('rentestate_messages', JSON.stringify(allMessages));
}

function getUserChats(userId) {
    const chats = JSON.parse(localStorage.getItem('rentestate_chats') || '[]');
    return chats.filter(chat => chat.tenantId === userId || chat.landlordId === userId);
}

function getChatMessages(chatId) {
    const messages = JSON.parse(localStorage.getItem('rentestate_messages') || '[]');
    return messages.filter(msg => msg.chatId === chatId).sort((a,b)=>a.id-b.id);
}

function sendMessage(chatId, senderId, text) {
    const messages = JSON.parse(localStorage.getItem('rentestate_messages') || '[]');
    const msg = { id: Date.now(), chatId, senderId, message: text, timestamp: Date.now(), isRead: false };
    messages.push(msg);
    localStorage.setItem('rentestate_messages', JSON.stringify(messages));
    return msg;
}

function getCurrentUser() {
    return { id: 2, username: 'Иван' };
}

document.addEventListener('DOMContentLoaded', () => {
    renderDialogsList();
    const form = document.getElementById('sendForm');
    if (form) form.addEventListener('submit', sendMessageHandler);
});

function renderDialogsList() {
    const dialogsList = document.getElementById('dialogsList');
    const empty = document.getElementById('emptyDialogs');
    const user = getCurrentUser();
    if (!user) return;

    const chats = getUserChats(user.id);
    if (!chats.length) {
        dialogsList.innerHTML = '';
        empty.classList.remove('d-none');
        return;
    }
    empty.classList.add('d-none');

    dialogsList.innerHTML = chats.map(chat => {
        const otherName = chat.tenantId === user.id ? chat.landlordName : chat.tenantName;
        return `
            <a href="#" class="list-group-item list-group-item-action"
               onclick="openDialog(${chat.id})">
                <div class="fw-semibold">${otherName}</div>
                <small class="text-muted">${chat.propertyTitle}</small>
            </a>
        `;
    }).join('');
}

function openDialog(chatId) {
    activeChatId = chatId;
    document.getElementById('dialogPlaceholder').classList.add('d-none');
    document.getElementById('dialogWindow').classList.remove('d-none');
    renderMessages();
}

function renderMessages() {
    const messagesContainer = document.getElementById('dialogMessages');
    const user = getCurrentUser();
    const messages = getChatMessages(activeChatId);

    messagesContainer.innerHTML = messages.map(msg => {
        const isMine = msg.senderId === user.id;
        return `
            <div class="mb-2 text-${isMine ? 'end' : 'start'}">
                <span class="badge ${isMine ? 'bg-dark' : 'bg-secondary'}">
                    ${msg.message}
                </span>
            </div>
        `;
    }).join('');

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessageHandler(e) {
    e.preventDefault();
    const input = document.getElementById('textMessageInput');
    const text = input.value.trim();
    if (!text || !activeChatId) return;

    const user = getCurrentUser();
    sendMessage(activeChatId, user.id, text);

    input.value = '';
    renderMessages();
    renderDialogsList();
}

function returnToDialogs() {
    activeChatId = null;
    document.getElementById('dialogWindow').classList.add('d-none');
    document.getElementById('dialogPlaceholder').classList.remove('d-none');
}

window.openDialog = openDialog;
window.returnToDialogs = returnToDialogs;
