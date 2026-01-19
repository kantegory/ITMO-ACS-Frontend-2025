<script></script>

<template>
  <router-view/>
</template>

<style lang="css">
:root {
  --green-main: #3c8c5a;
  --green-accent: #4caf7a;
  --green-hover: #2f7247;
  --green-btn-hover: #40986a;
  --btn-contact: #238c47;
  --btn-contact-hover: #1f6f3a;
  --icon: #000000;

  --bg-page: #f3f8f4;
  --bg-surface: #ffffff;
  --bg-soft: #f8fdf9;

  --text-main: #1f2d26;
  --text-muted: #6b7d73;
  --text-invert: #ffffff;

  --border-main: #cde3d4;
  --history-border: #e0e0e0;
  --info-border: #dce9df;
  --shadow-soft: 0 2px 10px rgba(0,0,0,0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --green-main: #6fd19c;
    --green-accent: #4caf7a;
    --green-hover: #8ae6b3;
    --green-btn-hover: #40986a;
    --btn-contact: #238c47;
    --btn-contact-hover: #1f6f3a;
    --icon: #ffffff;

    --bg-page: #121816;
    --bg-surface: #1b2420;
    --bg-soft: #202c27;

    --text-main: #e7f3ed;
    --text-muted: #9bb7a8;
    --text-invert: #121816;

    --border-main: #2f4037;
    --history-border: #e0e0e0;
    --info-border: #dce9df;
    --shadow-soft: 0 2px 10px rgba(0,0,0,0.6);
  }
}

body { 
  margin: 0;
  font-family: Arial, sans-serif !important;
  background: var(--bg-page) !important; 
  color: var(--text-main) !important;
}

main { 
  padding: 40px; 
  max-width: 1200px; 
  margin: auto; 
}

.icon {
    width: 24px;
    height: 24px;
    fill: var(--icon);
    display: inline-block;
}
</style>
