import instance from "@/api/instance";
import apiAuth from "@/api/instance.auth";

import AdvertisementsApi from "@/api/advertisements";
import UsersApi from "@/api/users";
import AuthApi from "@/api/auth";
import MessagesApi from "@/api/messages.js";
import RentalsApi from "@/api/rentals.js";

export const advertisementsApi = new AdvertisementsApi(instance);
export const usersApi = new UsersApi(instance);
export const authApi = new AuthApi(apiAuth);
export const advertisementsAuthApi = new AdvertisementsApi(apiAuth);
export const messagesAuthApi = new MessagesApi(apiAuth);
export const rentalsAuthApi = new RentalsApi(apiAuth);
export const usersMeApi = new UsersApi(apiAuth);
