<script>
import { mapActions, mapState } from "pinia";
import useAuthStore from "@/stores/auth";
import Navbar from "@/components/Navbar.vue";
import { Modal } from "bootstrap";
import BookingCard from "@/components/BookingCard.vue";
import { useTheme } from "@/hooks/theme";

export default {
  name: "ProfilePage",

  components: { Navbar, BookingCard },

  computed: {
    ...mapState(useAuthStore, ["profile"]),
  },

  methods: {
    ...mapActions(useAuthStore, ["editProfile"]),

    openProfileEditModal() {
      const modal = Modal.getOrCreateInstance(this.$refs.modal);
      modal.show();
    },

    async onProfileSave() {
      if (this.firstName || this.lastName) {
        await this.editProfile({ firstName: this.firstName, lastName: this.lastName });
      }
    },
  },

  data() {
    return {
      firstName: "",
      lastName: "",
    };
  },
};
</script>

<script setup>
const { theme, toggleTheme } = useTheme();
</script>

<template>
  <navbar />

  <div ref="modal" class="modal fade">
    <div class="card-bg modal-dialog">
      <div class="modal-content">
        <div class="card-bg modal-header">
          <h2 class="modal-title fs-5">Редактирование профиля</h2>
        </div>
        <div class="card-bg modal-body">
          <div class="mb-3">
            <label class="form-label">Имя</label>
            <input
              v-model="firstName"
              type="text"
              class="input-bg first-name-input form-control"
              placeholder="Имя"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Фамилия</label>
            <input
              v-model="lastName"
              type="text"
              class="input-bg last-name-input form-control"
              placeholder="Фамилия"
            />
          </div>
        </div>
        <div class="card-bg modal-footer">
          <button @click.prevent="onProfileSave" class="save-profile-btn btn btn-primary">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="container my-4">
    <div class="row">
      <div class="col-md-3">
        <div class="card-bg card mb-4">
          <div class="card-body text-center">
            <img
              src="https://mvrdv.com/media/uploads/00_male.jpg?width=1600"
              class="rounded-circle mb-3 avatar"
              alt="Аватар"
            />
            <h5 class="username card-title">{{ profile.lastName }} {{ profile.firstName }}</h5>
            <p class="email">{{ profile.email }}</p>
            <div class="d-grid gap-2">
              <button
                @click.prevent="openProfileEditModal"
                class="edit-profile-btn btn btn-outline-primary"
              >
                Редактировать профиль
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h4 class="greeting">Добро пожаловать, {{ profile.firstName }}</h4>
          <div class="form-check form-switch">
            <input
              @change="toggleTheme"
              :checked="theme === 'dark'"
              id="theme-toggle"
              class="theme-toggle form-check-input"
              type="checkbox"
              role="switch"
            />
            <label class="form-check-label" for="theme-toggle">Темная тема</label>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="card-bg card">
              <div class="card-header bg-dark text-white">
                <h5 class="mb-0">История бронирования</h5>
              </div>
              <div class="card-body p-0">
                <div class="booking-cards list-group list-group-flush">
                  <div v-for="booking in profile.booking">
                    <booking-card
                      :restaurant-name="booking.restaurantName"
                      :date="booking.date"
                      :total-amount="booking.totalAmount"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
