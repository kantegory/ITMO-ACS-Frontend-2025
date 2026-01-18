export default class MessagesApi {
    constructor(instance) {
        this.API = instance;
    }

    getChatsByUser = async (userId) => {
        return this.API({
            method: "GET",
            url: `/messages/chats/user/${userId}`
        });
    };

    send = async (data) => {
        return this.API({
            method: "POST",
            url: "/messages",
            data,
            headers: { "Content-Type": "application/json" }
        });
    };
}