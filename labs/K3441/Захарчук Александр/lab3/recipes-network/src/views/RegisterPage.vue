<script setup>
import FormContainer from "@/components/FormContainer.vue";
import Navbar from "@/components/Navbar.vue";
import FormField from "@/components/FormField.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const form = ref({
  username: "",
  email: "",
  imageLink: "",
  bio: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
});

const userStore = useUserStore();

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    return;
  }
  try {
    await userStore.register(form.value.username, form.value.email, form.value.password, form.value.imageLink, form.value.bio);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

<template>
  <Navbar />
  <FormContainer>
    <form @submit.prevent="handleRegister" id="registerForm">
      <FormField
        v-model="form.username"
        type="text"
        id="username"
        label="Имя пользователя"
        placeholder="Придумайте имя пользователя"
        isRequired="true"
        addBottomMargin="true"
      >
        <div class="form-text">Это имя будет отображаться в вашем профиле</div>
      </FormField>
      <FormField
        v-model="form.email"
        type="email"
        id="email"
        label="Email"
        placeholder="Ваш email"
        isRequired="true"
        addBottomMargin="true"
      />
      <FormField
        v-model="form.imageLink"
        type="url"
        id="profilePicture"
        label="Ссылка на фото"
        placeholder="Вашe фото"
        isRequired="true"
        addBottomMargin="true"
      />
      <div class="mb-3">
        <label for="bio" class="form-label">Ваша биография</label>
        <textarea v-model="form.bio" class="form-control" placeholder="" id="bio" style="height: 100px"></textarea>
      </div>
      <FormField
        v-model="form.password"
        type="password"
        id="password"
        label="Пароль"
        placeholder="Придумайте пароль"
        isRequired="true"
        addBottomMargin="true"
      >
        <div class="form-text">Минимум 6 символов</div>
      </FormField>
      <FormField
        v-model="form.confirmPassword"
        type="password"
        id="confirmPassword"
        label="Подтверждение пароля"
        placeholder="Повторите пароль"
        isRequired="true"
        addBottomMargin="true"
      />

      <div class="mb-3 form-check">
        <input v-model="form.termsAccepted" type="checkbox" class="form-check-input" id="agreeTerms" required />
        <label class="form-check-label" for="agreeTerms">
          Я соглашаюсь с
          <a
            href="#"
            class="text-danger text-decoration-none"
            data-bs-toggle="modal"
            data-bs-target="#termsModal"
            >условиями использования</a
          >
        </label>
      </div>

      <button type="submit" class="btn btn-danger w-100 py-2 mb-3">Зарегистрироваться</button>
    </form>
  </FormContainer>
</template>
