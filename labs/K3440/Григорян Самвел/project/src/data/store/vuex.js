import { createStore } from "vuex";
import userModule from "./userModule";

export default createStore({
  state: () => ({
    darkTheme: false,
  }),
  getters: {},
  mutations: {
    toggleDarkTheme(state) {
      state.darkTheme = !state.darkTheme;
    },
  },
  actions: {},
  modules: {
    user: userModule,
  },
});
