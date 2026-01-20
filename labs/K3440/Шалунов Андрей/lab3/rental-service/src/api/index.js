import instance from "@/api/instance";

import AuthApi from "@/api/auth";
import UsersApi from "@/api/users";
import PropertiesApi from "@/api/properties";
import BookingsApi from "@/api/bookings";
import MessagesApi from "@/api/messages";

const authApi = new AuthApi(instance);
const usersApi = new UsersApi(instance);
const propertiesApi = new PropertiesApi(instance);
const bookingsApi = new BookingsApi(instance);
const messagesApi = new MessagesApi(instance);

export { authApi, usersApi, propertiesApi, bookingsApi, messagesApi };