export default class RentalsApi {
  constructor(http) {
    this.API = http;
  }

  me(params = {}) {
    return this.API.get("/rentals/me", { params });
  }
}
