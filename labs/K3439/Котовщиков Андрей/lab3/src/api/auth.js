class AuthApi {
  constructor(instance) {
    this.API = instance;
  }

  async register(data) {}

  async login(data) {
    return this.API({
      method: "POST",
      url: "/login",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export default AuthApi;
