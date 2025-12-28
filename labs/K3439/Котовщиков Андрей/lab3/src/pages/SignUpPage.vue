<script>
import { mapActions } from "pinia";
import useAuthStore from "@/stores/auth";
import Spinner from "@/components/Spinner.vue";

export default {
  name: "SignUpPage",

  components: { Spinner },

  methods: {
    ...mapActions(useAuthStore, ["signUp"]),

    async onSignUp() {
      if (!this.email || !this.firstName || !this.lastName) {
        return;
      }

      this.isLoading = true;
      try {
        await this.signUp({
          email: this.email.trim(),
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
        });

        this.$router.push({ name: "restaurant-list" });
      } catch (err) {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        alert(err);
      }

      this.isLoading = false;
    },
  },

  data() {
    return {
      isLoading: false,
      email: "",
      firstName: "",
      lastName: "",
    };
  },
};
</script>

<template>
  <div class="container min-vh-100 d-flex align-items-center">
    <div class="row w-100 justify-content-center">
      <div class="col-5">
        <form class="card-bg p-4 rounded shadow">
          <h2 class="text-center mb-4">Регистрация</h2>

          <div class="mb-3">
            <label class="form-label" for="first-name-input">Имя</label>
            <input
              v-model="firstName"
              id="first-name-input"
              type="text"
              class="input-bg first-name-input form-control"
              placeholder="Имя"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="last-name-input">Фамилия</label>
            <input
              v-model="lastName"
              id="last-name-input"
              type="text"
              class="input-bg last-name-input form-control"
              placeholder="Фамилия"
            />
          </div>

          <div class="mb-3">
            <label class="form-label" for="email-input">Email</label>
            <input
              v-model="email"
              id="email-input"
              type="email"
              class="input-bg email-input form-control"
              placeholder="Email"
            />
          </div>

          <div class="d-grid gap-3">
            <button @click.prevent="onSignUp" type="submit" class="sign-up-btn btn btn-primary">
              Зарегистрировать
            </button>
            <router-link :to="{ name: 'sign-in' }" class="text-decoration-none">Войти</router-link>
            <spinner v-if="isLoading" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
