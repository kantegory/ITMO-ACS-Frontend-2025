class UsersApi {
    constructor(instance) {
        this.API = instance
    }

    createUser = async (data) => {
        return this.API({
            method: "POST",
            url: '/create',
            data
        })
    }

    updateUser = async (data, id, authToken) => {
        return this.API({
            method: "PATCH",
            url: `/update/${id}`,
            data,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
    }

    getUserByEmail = async (email, authToken) => {
        return this.API({
            method: "GET",
            url: `/email/${email}`,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
    }
}

export default UsersApi