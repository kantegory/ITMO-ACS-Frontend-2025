<script setup>
import AppNavbar from "@/components/Navbar.vue";
import AppFooter from "@/components/Footer.vue";
import ContactModal from "@/components/ContactModal.vue";

function toggleTheme() {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "light" : "dark";
}

function sendMessage(text) {
  console.log("Send message:", text);
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppNavbar @toggle-theme="toggleTheme" />
    <main id="main" class="py-4 flex-fill">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <ContactModal @send="sendMessage" />
    <AppFooter />
  </div>
</template>
