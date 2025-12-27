import { defineStore } from "pinia";
import { authApi } from "@/api";

const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: null,
    authCode: null,
    profile: null,
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
      await this.fetchProfile({ accessToken });
      this.accessToken = accessToken;
      this.authCode = null;
    },

    async signUp({ email, firstName, lastName }) {
      const response = await authApi.register({ email, firstName, lastName, password: "password" });
      const { accessToken } = response.data;
      await this.fetchProfile({ accessToken });
      this.accessToken = accessToken;
    },

    async fetchProfile({ accessToken }) {
      const response = await authApi.getProfile({ accessToken });
      this.profile = response.data;
      await this.fetchBookings({ accessToken });
    },

    async fetchBookings({ accessToken }) {
      const response = await authApi.getBookings({ accessToken });
      this.profile.booking = response.data;
    },

    async editProfile({ firstName, lastName }) {
      if (firstName) {
        this.profile.firstName = firstName;
      }

      if (lastName) {
        this.profile.lastName = lastName;
      }
    },
  },
});

export default useAuthStore;
