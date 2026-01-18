export default class UsersApi {
    constructor(instance) {
        this.API = instance;
    }

    me = async () => {
        return this.API({ method: "GET", url: "/users/me" });
    };

    update = async (id, data) => {
        return this.API({
            method: "PATCH",
            url: `/users/${id}`,
            data,
            headers: { "Content-Type": "application/json" }
        });
    };
}