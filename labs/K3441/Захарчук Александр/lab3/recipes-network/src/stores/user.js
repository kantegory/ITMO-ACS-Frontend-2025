import { defineStore } from "pinia";
import userService from "@/api/user";
import router from "@/router";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {},
    subscriptions: [],
    users: [],
    accessToken: localStorage.getItem("access_token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    currentUser: (state) => state.user,
    all: (state) => state.users,
    subsIds: (state) => state.subscriptions.map((x) => x.following_id),
  },

  actions: {
    async login(username, password) {
      try {
        const response = await userService.login(username, password);
        const { token } = response.data;

        this.setTokens(token);

        router.push("/");
      } catch (error) {
        this.setTokens(null);
        throw error;
      }
    },

    async getAll() {
      try {
        const response = await userService.getAll();
        this.users = response.data;
      } catch (error) {
        this.users = [];
        throw error;
      }
    },

    async register(username, email, password, profilePicture, bio) {
      try {
        const response = await userService.register(username, email, password, profilePicture, bio);
        if (response.status === 201) {
          router.push("/login");
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async subscribe(followingId) {
      try {
        await userService.subscribe(followingId);
        await this.getSubs();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async unsubscribe(followingId) {
      try {
        await userService.unsubscribe(followingId);
        await this.getSubs();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    logout() {
      this.user = {};
      this.setTokens(null);
      router.push("/login");
    },

    async getSubs() {
      if (!this.accessToken) return;
      try {
        const subsResponse = await userService.getSubscriptions();
        this.subscriptions = subsResponse.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getCurrentUser() {
      if (!this.accessToken) return;

      try {
        const userResponse = await userService.getCurrentUser();
        this.user = userResponse.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.logout();
      }
    },

    setTokens(accessToken) {
      this.accessToken = accessToken;
      localStorage.setItem("access_token", accessToken);
    },

    getSubId(followingId) {
      for (const sub of this.subscriptions) {
        if (sub.following_id === followingId) {
          return sub.id;
        }
      }
    },

    getById(id) {
      for (const user of this.users) {
        if (user.id === id) {
          return user;
        }
      }
    }
  },
});
