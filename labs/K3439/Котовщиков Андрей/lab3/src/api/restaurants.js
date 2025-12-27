class RestaurantsApi {
  constructor(instance) {
    this.API = instance;
  }

  async filter(data) {
    return this.API({
      url: "/restaurants",
      params: data,
    });
  }
}

export default RestaurantsApi;
