import instance from "@/api/instance";

import AuthApi from "@/api/auth";
import UsersApi from "@/api/users";
import PropertiesApi from "@/api/properties";

const authApi = new AuthApi(instance);
const usersApi = new UsersApi(instance);
const propertiesApi = new PropertiesApi(instance);

export {
    authApi,
    usersApi,
    propertiesApi
};