import { defineStore } from "pinia";
import { authApi } from "@/api";
import { saveTokens, clearTokens, getAccessToken, getTokenType } from "@/utils/auth.storage";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: getAccessToken(),
    tokenType: getTokenType(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async login(credentials) {
      const res = await authApi.login(credentials);
      saveTokens(res.data);

      this.accessToken = getAccessToken();
      this.tokenType = getTokenType();

      return res;
    },

    logout() {
      clearTokens();
      this.accessToken = null;
      this.tokenType = "Bearer";
    },
  },
});
