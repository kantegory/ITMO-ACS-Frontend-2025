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

    identifyUserByEmail = async (email) => {
        try {
            const response = await this.API({url: `${this.base}?email=${email}`});
            return response.data.length > 0;
        } catch (error) {
            console.error('Error identifying user by email:', error);
            return false;
        }
    }

    createUser = async (data) => {
        return this.API({
            method: 'POST',
            url: this.base,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    updateUser = async (id, data) => {
        return this.API({
            method: 'PATCH',
            url: `${this.base}/${id}`,
            data,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export {
    UserApi
}