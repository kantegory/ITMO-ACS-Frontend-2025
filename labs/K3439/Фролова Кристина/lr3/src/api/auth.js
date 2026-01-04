class AuthApi {
  constructor(instance) {
    this.API = instance;
  }

  login(data) {
    return this.API.post("/auth/login", data);
  }

  register(data) {
    return this.API.post("/auth/register", data);
  }
}

export default AuthApi;
