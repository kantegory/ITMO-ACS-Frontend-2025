export default class BookingsApi {
    constructor(instance) {
        this.API = instance;
    }

    getAll = async () => {
        return this.API({ method: "GET", url: "/bookings" });
    };

    getByUserId = async (userId) => {
        return this.API({ method: "GET", url: `/bookings/user/${userId}` });
    };

    create = async (data) => {
        return this.API({
            method: "POST",
            url: "/bookings",
            data,
            headers: { "Content-Type": "application/json" }
        });
    };
}