<script setup>
import { useTheme } from "./hooks/theme";

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <router-view />
</template>
