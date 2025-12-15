import { apiGet, apiPost } from './api.js';
import { getCurrentUser } from './session.js';

export async function fetchMyChats() {
    const me = getCurrentUser();
    const myId = me?.user_id;

    if (!myId) {
        console.warn('Не удалось определить user_id — возвращаем пустой список чатов');
        return [];
    }

    const chats = await apiGet(`/messages/chats/user/${myId}`, { auth: true });

    if (!Array.isArray(chats)) {
        return [];
    }

    return chats;
}

export async function sendMessage({ propertyId, recipientId, text }) {
    const me = getCurrentUser();
    const senderId = me?.user_id;

    if (!senderId) {
        throw new Error('Неизвестен ID текущего пользователя (sender_id).');
    }

    const payload = {
        sender_id: senderId,
        recipient_id: recipientId,
        property_id: propertyId,
        text: text,
    };

    return apiPost('/messages', payload, { auth: true });
}