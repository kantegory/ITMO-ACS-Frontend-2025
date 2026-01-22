import apiClient from ".";

class UserService {
  constructor(client) {
    this.client = client;
    this.prefix = "/users";
  }

  async login(username, password) {
    return await this.client.post(`${this.prefix}/login`, { username, password });
  }

  async register(username, email, password, profilePicture, bio) {
    return await this.client.post(`${this.prefix}/register`, {
      username,
      email,
      password,
      profile_picture: profilePicture,
      bio,
    });
  }

  async getAll() {
    return await this.client.get(this.prefix);
  }

  async getCurrentUser () {
    return await this.client.get(`${this.prefix}/me`);
  }

  async subscribe(followingId) {
    return await this.client.post("subscriptions", {following_id: followingId});
  }

  async unsubscribe(followingId) {
    return await this.client.delete(`subscriptions/${followingId}`);
  }

  async getSubscriptions() {
    return await this.client.get("subscriptions");
  }
}

const userService = new UserService(apiClient);
export default userService;
