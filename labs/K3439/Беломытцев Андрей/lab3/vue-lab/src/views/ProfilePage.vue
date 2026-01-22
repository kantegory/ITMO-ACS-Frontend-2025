<template>
  <base-layout>
    <div class="container-fluid py-4">
      <!-- Profile Header -->
      <div class="text-center mb-4">
        <div
          class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle mb-3"
          style="width: 100px; height: 100px"
        >
          <i class="bi bi-person-circle fs-1 text-primary"></i>
        </div>
        <h1 class="mb-1" id="header-username">{{ profile.username || "Profile" }}</h1>
        <p class="text-body-secondary" id="header-email">
          {{ profile.id ? profile.email || "" : "Loading..." }}
        </p>
      </div>

      <div class="row g-4">
        <!-- Personal Information Card -->
        <section class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-4">
                <i class="bi bi-person-fill text-primary me-2"></i>Personal Information
              </h5>
              <div class="row g-3">
                <div class="col-12">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-person-badge fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Username</small>
                      <strong id="username">{{ profile.username || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-envelope-fill fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Email</small>
                      <strong id="email">{{ profile.email || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-hash fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">User ID</small>
                      <strong id="user-id">{{ profile.id || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-calendar-check fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Member Since</small>
                      <strong id="created-at">{{ formatDate(profile.created_at) }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-start p-3 bg-body-secondary rounded">
                    <i class="bi bi-info-circle fs-5 text-body-secondary me-3 mt-1"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">About</small>
                      <strong id="about">{{ profile.about || "-" }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Band Information Card -->
        <section class="col-lg-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <h5 class="card-title mb-4">
                <i class="bi bi-fire text-primary me-2"></i>Band Information
              </h5>
              <div class="row g-3">
                <div class="col-12">
                  <div class="p-3 bg-body-secondary rounded">
                    <div class="d-flex align-items-center mb-2">
                      <i class="bi bi-key-fill fs-5 text-body-secondary me-2"></i>
                      <small class="text-body-secondary">API Key</small>
                    </div>
                    <div class="input-group">
                      <input
                        :type="showApiKey ? 'text' : 'password'"
                        class="form-control"
                        readonly
                        :value="profile.apikey || ''"
                        ref="apikeyInput"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showApiKey = !showApiKey"
                        title="Toggle visibility"
                      >
                        <i :class="showApiKey ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="copyApiKey"
                        title="Copy to clipboard"
                      >
                        <i v-if="!copied" class="bi bi-clipboard"></i>
                        <i v-else class="bi bi-check"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-database-fill-check fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Active Pins</small>
                      <strong id="pins">{{
                        profile.pins ? JSON.stringify(profile.pins) : "-"
                      }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-archive-fill fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Old Pins</small>
                      <strong id="oldpins">{{
                        profile.oldpins ? JSON.stringify(profile.oldpins) : "-"
                      }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-clock-fill fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Schedule</small>
                      <strong id="schedule">{{
                        profile.schedule ? JSON.stringify(profile.schedule) : "-"
                      }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-clock-history fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Last Time</small>
                      <strong id="lasttime">{{ profile.lasttime || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-activity fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Last Pin</small>
                      <strong id="lastpin">{{ profile.lastpin || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-center p-3 bg-body-secondary rounded">
                    <i class="bi bi-battery-charging fs-5 text-body-secondary me-3"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Battery</small>
                      <strong id="battery">{{ profile.battery || "-" }}</strong>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-flex align-items-start p-3 bg-body-secondary rounded">
                    <i class="bi bi-browser-firefox fs-5 text-body-secondary me-3 mt-1"></i>
                    <div class="flex-grow-1">
                      <small class="text-body-secondary d-block">Extension Settings</small>
                      <strong id="extension-settings" class="text-break">{{
                        profile.extension_settings || "-"
                      }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- YouTube Section -->
        <section class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">
                <i class="bi bi-youtube text-danger me-2"></i>YouTube Channels
              </h5>
              <div
                class="d-flex align-items-center justify-content-between p-3 bg-body-secondary rounded mb-3"
              >
                <div>
                  <p class="mb-0" id="channels-count">
                    <i class="bi bi-collection-play me-2"></i>You added
                    <b>{{ userChannels.length }}</b> YouTube channel{{
                      userChannels.length !== 1 ? "s" : ""
                    }}.
                  </p>
                </div>
                <button
                  id="toggle-channels-btn"
                  class="btn btn-primary"
                  @click="showChannels = !showChannels"
                  v-if="userChannels.length > 0"
                >
                  <i
                    :class="showChannels ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"
                    class="me-1"
                  ></i>
                  {{ showChannels ? "Hide Channels" : "Show Channels" }}
                </button>
              </div>
              <div id="channels-container" v-show="showChannels">
                <div class="row">
                  <div
                    class="col-md-6 col-lg-4 mb-3"
                    v-for="channel in userChannels"
                    :key="channel.id"
                  >
                    <channel-card :channel="channel" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Actions Section -->
        <section class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-4">
                <i class="bi bi-shield-exclamation text-warning me-2"></i>Account Actions
              </h5>
              <div class="d-flex gap-3 flex-wrap">
                <button @click="handleLogout" type="button" class="btn btn-outline-danger">
                  <i class="bi bi-box-arrow-right me-2"></i>Logout
                </button>
                <button @click="handleDelete" type="button" class="btn btn-danger">
                  <i class="bi bi-trash me-2"></i>Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue";
import { mapActions, mapState } from "pinia";
import useServerStore from "@/stores/server";
import ChannelCard from "@/components/ChannelCard.vue";
import "bootstrap-icons/font/bootstrap-icons.css";

export default {
  name: "ProfilePage",
  components: { BaseLayout, ChannelCard },
  data() {
    return {
      profile: {},
      showApiKey: false,
      copied: false,
      showChannels: false,
    };
  },
  computed: {
    ...mapState(useServerStore, ["channels"]),
    userChannels() {
      if (!this.profile.id || !this.channels) return [];
      return this.channels.filter((c) => c.user_id == this.profile.id);
    },
  },
  methods: {
    ...mapActions(useServerStore, ["loadProfile", "loadChannels", "deleteAccount", "logout"]),
    handleLogout() {
      this.logout();
      window.location.href = "/login";
    },
    async handleDelete() {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        try {
          await this.deleteAccount();
          window.location.href = "/login";
        } catch (error) {
          alert("Failed to delete account");
        }
      }
    },
    formatDate(dateString) {
      return dateString ? new Date(dateString).toLocaleString() : "-";
    },
    copyApiKey() {
      if (!this.profile.apikey) return;
      navigator.clipboard.writeText(this.profile.apikey);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
  },
  async mounted() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await this.loadProfile();
      this.profile = response.data;
      await this.loadChannels();
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        this.handleLogout();
      }
    }
  },
};
</script>
