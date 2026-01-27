class AuthApi {
    constructor(instance) {
        this.API = instance
    }

    login = async (data) => {
        return this.API({
            method: "POST",
            url: '/login',
            data
        })
    }
}
   
   
export default AuthApi