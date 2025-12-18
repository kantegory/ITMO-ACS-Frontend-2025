import { parseDate } from "./datetime.js";

export function groupMessagesToChats(messages, myUserId) {
  const map = new Map();

  for (const m of messages) {
    const otherId = (m.senderId === myUserId) ? m.receiverId : m.senderId;
    const key = `${m.advertisementId}:${otherId}`;

    if (!map.has(key)) {
      map.set(key, { id: key, advertisementId: m.advertisementId, otherId, messages: [] });
    }
    map.get(key).messages.push(m);
  }

  const chats = Array.from(map.values());
  for (const c of chats) {
    c.messages.sort((a, b) => parseDate(a.createdAt) - parseDate(b.createdAt));
    c.lastMessage = c.messages[c.messages.length - 1];
  }

  chats.sort((a, b) => parseDate(b.lastMessage?.createdAt) - parseDate(a.lastMessage?.createdAt));
  return chats;
}
