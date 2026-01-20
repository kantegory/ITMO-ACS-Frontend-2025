export default class AuthApi {
    constructor(instance) {
        this.API = instance;
    }

    register = async (data) => {
        return this.API({
            method: "POST",
            url: "/auth/register",
            data,
            headers: { "Content-Type": "application/json" }
        });
    };

    login = async (data) => {
        return this.API({
            method: "POST",
            url: "/auth/login",
            data,
            headers: { "Content-Type": "application/json" }
        });
    };
}