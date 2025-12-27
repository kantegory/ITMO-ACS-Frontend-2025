import instance from "@/api/instance";
import AuthApi from "@/api/auth";
import RestaurantsApi from "@/api/restaurants";

const authApi = new AuthApi(instance);
const restaurantsApi = new RestaurantsApi(instance);

export { authApi, restaurantsApi };
