class AuthApi {
  constructor(instance) {
    this.API = instance;
  }

  async register(data) {
    return this.API({
      method: "POST",
      url: "/register",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

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

  async getProfile({ accessToken }) {
    return this.API({
      url: "/users/1",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getBookings({ accessToken }) {
    return this.API({
      url: "/bookings",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export default AuthApi;
