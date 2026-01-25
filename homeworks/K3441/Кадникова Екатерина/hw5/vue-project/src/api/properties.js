class PropertiesApi {
    constructor(instance) {
        this.API = instance
    }

    getAll = async () => {
        return this.API({ url: '/properties' })
    }

    createProperty = async (data) => {
        const token = localStorage.getItem('token')
        return this.API({
            method: 'POST',
            url: '/properties',
            data,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }
}

export default PropertiesApi