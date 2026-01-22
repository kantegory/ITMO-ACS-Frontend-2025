import axios from "axios";

const apiURL = "http://localhost:8080/api";

const $host = axios.create({
    baseURL: apiURL,
})

const $authHost = axios.create({
    baseURL: apiURL,
})

const authInterceptor = config => {
    config.headers.authorization = 'Bearer ' + localStorage.getItem('token')
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
}