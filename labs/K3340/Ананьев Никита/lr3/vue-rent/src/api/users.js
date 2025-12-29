class UserApi {
    constructor(instance) {
        this.API = instance
        this.base = '/users'
    }

    getUserById = async (id) => {
        return this.API({
            url: `${this.base}?id=${id}`
        })
    }

    getUserByEmail = async (email) => {
        return this.API({
            url: `${this.base}?email=${email}`
        })
    }

    createUser = async (data) => {
        return this.API({
            method: 'POST',
            url: this.base,
            data,
            headers: {
            '   Content-Type': 'application/json'
            }
        })
    }
}

export {
    UserApi
}