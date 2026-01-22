<template>
  <base-layout>
    <div class="m-auto" style="max-width: 330px">
      <h1>Sign in</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label>Username</label>
          <input
            type="text"
            required
            class="form-control"
            name="username"
            placeholder="Username"
            v-model="form.username"
          />
        </div>
        <div class="mb-3">
          <label>Password</label>
          <input
            type="password"
            required
            placeholder="Password"
            name="password"
            class="form-control"
            v-model="form.password"
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Sign in</button>
      </form>
      <p class="text-center mt-3">Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";
import { mapActions } from "pinia";
import useServerStore from "@/stores/server";

export default {
  name: "LoginPage",
  components: { BaseLayout },
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(useServerStore, ["login"]),
    async handleLogin() {
      try {
        const response = await this.login(this.form.username, this.form.password);
        if (response.status === 200) {
          window.location.href = "/profile";
        } else {
          alert("Sign in failed");
        }
      } catch (error) {
        alert("Sign in failed");
      }
    },
  },
};
</script>
