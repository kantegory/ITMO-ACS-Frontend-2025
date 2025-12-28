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

  async getMenus(data) {
    return this.API({
      url: "/menus",
      params: data,
    });
  }
}

export default RestaurantsApi;
