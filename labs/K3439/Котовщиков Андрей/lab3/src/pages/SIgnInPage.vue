<script>
import { mapActions } from "pinia";
import useAuthStore from "@/stores/auth";
import { Modal } from "bootstrap";
import Spinner from "@/components/Spinner.vue";

export default {
  name: "SignInPage",

  components: { Spinner },

  methods: {
    ...mapActions(useAuthStore, ["requestAuthCode", "signIn"]),

    openAuthCodeModal() {
      const modal = Modal.getOrCreateInstance(this.$refs.modal);
      modal.show();
    },

    closeAuthCodeModal() {
      const modal = Modal.getOrCreateInstance(this.$refs.modal);
      modal.hide();
    },

    async onSignIn() {
      if (!this.code || !this.email) {
        return;
      }

      this.isLoading = true;
      try {
        await this.signIn({ email: this.email.trim(), code: this.code.trim() });
        this.$router.push({ name: "restaurant-list" });
        this.closeAuthCodeModal();
      } catch (err) {
        this.code = "";
        alert(err);
      }

      this.isLoading = false;
    },

    async onRequestCode() {
      if (!this.email) {
        return;
      }

      this.isLoading = true;
      try {
        await this.requestAuthCode({ email: this.email });
        this.openAuthCodeModal();
      } catch (err) {
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
      code: "",
    };
  },
};
</script>

<template>
  <main>
    <div ref="modal" class="modal fade">
      <div class="modal-dialog">
        <div class="card-bg modal-content">
          <div class="card-bg modal-header">
            <h2 class="modal-title fs-5">Введите код</h2>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label" id="auth-code-input">Код</label>
              <input
                v-model="code"
                id="auth-code-input"
                type="text"
                class="input-bg auth-code-input form-control"
                placeholder="xxxx"
              />
            </div>
          </div>
          <div class="card-bg modal-footer">
            <button @click.prevent="onSignIn" type="button" class="sign-in-btn btn btn-primary">
              Войти
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container min-vh-100 d-flex align-items-center">
      <div class="row w-100 justify-content-center">
        <div class="col-5">
          <form class="card-bg p-4 rounded shadow">
            <h2 class="text-center mb-4">Вход</h2>

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
              <button @click.prevent="onRequestCode" class="request-code-btn btn btn-primary">
                Запросить код
              </button>

              <router-link :to="{ name: 'sign-up' }" class="text-decoration-none"
                >Зарегистрироваться</router-link
              >
              <spinner v-if="isLoading" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
