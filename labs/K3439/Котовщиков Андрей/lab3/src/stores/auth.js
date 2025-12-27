import { defineStore } from "pinia";
import { authApi } from "@/api";

const useAuthStore = defineStore("notes", {
  state: () => ({
    accessToken: null,
    authCode: null,
  }),

  getters: {
    isAuthenticated: (state) => state.accessToken !== null,
  },

  actions: {
    async requestAuthCode({ email }) {
      await authApi.login({ email, password: "password" });
      this.authCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(this.authCode);
    },

    async signIn({ email, code }) {
      if (code !== this.authCode) {
        throw Error("Incorrect code");
      }

      const response = await authApi.login({ email, password: "password" });
      const { accessToken } = response.data;
      this.accessToken = accessToken;
      this.authCode = null;
    },
  },
});

export default useAuthStore;
