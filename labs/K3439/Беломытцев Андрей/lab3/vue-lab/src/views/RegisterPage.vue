<template>
  <base-layout>
    <div class="m-auto" style="max-width: 330px">
      <h1>Sign up</h1>
      <form @submit.prevent="register">
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
          <label>Email</label>
          <input
            type="text"
            required
            placeholder="Email"
            name="email"
            class="form-control"
            v-model="form.email"
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
        <button type="submit" class="btn btn-primary w-100">Sign up</button>
      </form>
      <p class="text-center mt-3">Have an account? <a href="/login">Sign in</a></p>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";

export default {
  name: "RegisterPage",
  components: { BaseLayout },
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async register() {
      const response = await fetch("/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.form),
      });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        alert("Sign up failed");
      }
    },
  },
};
</script>
