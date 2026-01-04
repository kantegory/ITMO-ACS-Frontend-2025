class UsersApi {
  constructor(instance) {
    this.API = instance;
  }

  getById = async (id) => {
    return this.API({
      url: `/users/${id}`,
    });
  };

  me = async () => {
    return this.API({
      url: `/users/me`,
    });
  };
}

export default UsersApi;
