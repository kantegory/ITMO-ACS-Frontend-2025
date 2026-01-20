import { defineStore } from "pinia";
import { messagesApi } from "@/api";
import { useApiError } from "@/composables/useApiError";

export const useMessagesStore = defineStore("messages", {
    state: () => ({
        chats: [],
        loading: false,
        error: null
    }),

    actions: {
        async loadChats(userId) {
            const { normalize } = useApiError();
            this.error = null;
            this.loading = true;

            try {
                const res = await messagesApi.getChatsByUser(userId);
                this.chats = Array.isArray(res?.data) ? res.data : [];
                return true;
            } catch (e) {
                this.chats = [];
                this.error = normalize(e, "Не удалось загрузить чаты");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async sendMessage(payload) {
            const { normalize } = useApiError();
            try {
                const res = await messagesApi.send(payload);
                return res?.data || true;
            } catch (e) {
                throw new Error(normalize(e, "Не удалось отправить сообщение"));
            }
        }
    }
});

export default useMessagesStore;