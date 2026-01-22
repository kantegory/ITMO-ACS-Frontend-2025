import { defineStore } from "pinia";
import { serverApi } from "@/api";

const useServerStore = defineStore("server", {
  state: () => ({
    channels: [],
  }),

  actions: {
    async loadChannels() {
      const response = await serverApi.getAllChannels();
      this.channels = response.data;
      return response;
    },

    async createChannel(data) {
      const response = await serverApi.createChannel(data);
      this.channels = response.data;
      return response;
    },

    async login(username, password) {
      const response = await serverApi.login(username, password);
      if (response && response.data && response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      return response;
    },

    logout() {
      localStorage.removeItem("access_token");
    },

    async deleteAccount() {
      const response = await serverApi.deleteAccount();
      this.logout();
      return response;
    },

    async loadProfile() {
      const response = await serverApi.getProfile();
      this.profile = response.data;
      return response;
    },
  },
});

export default useServerStore;
