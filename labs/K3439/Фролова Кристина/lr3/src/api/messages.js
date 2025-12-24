export default class MessagesApi {
  constructor(instance) {
    this.API = instance;
  }

  me(params = {}) {
    return this.API.get("/messages/me", { params });
  }

  send(payload) {
    return this.API.post("/messages", payload);
  }
}
