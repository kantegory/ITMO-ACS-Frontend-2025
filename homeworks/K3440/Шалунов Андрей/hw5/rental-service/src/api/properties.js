export default class PropertiesApi {
    constructor(instance) {
        this.API = instance;
    }

    getAll = async (params = {}) => {
        return this.API({
            method: "GET",
            url: "/properties",
            params
        });
    };

    getMine = async (ownerId) => {
        return this.API({
            method: "GET",
            url: "/properties",
            params: {
                ownerId
            }
        });
    };

    getById = async (id) => {
        return this.API({
            method: "GET",
            url: `/properties/${id}`
        });
    };

    create = async (data) => {
        return this.API({
            method: "POST",
            url: "/properties",
            data,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    update = async (id, data) => {
        return this.API({
            method: "PUT",
            url: `/properties/${id}`,
            data,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    remove = async (id) => {
        return this.API({
            method: "DELETE",
            url: `/properties/${id}`
        });
    };

    getPhotosByProperty = async (propertyId) => {
        return this.API({
            method: "GET",
            url: `/photos/by-property/${propertyId}`
        });
    };

    addPhoto = async (data) => {
        return this.API({
            method: "POST",
            url: "/photos",
            data,
            headers: {
                "Content-Type": "application/json"
            }
        });
    };
}