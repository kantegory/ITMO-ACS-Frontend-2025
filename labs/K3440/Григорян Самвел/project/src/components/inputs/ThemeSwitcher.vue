<template>
  <div
    class="switch_wrap"
    @click="disabled ? null : toggle()"
    @keydown.space.prevent="toggle"
  >
    <span class="toggle_background" :class="backgroundStyles">
      <theme-icon />
    </span>
    <span class="toggle_indicator" :style="indicatorStyles" />
  </div>
</template>

<script>
import store from "@/data/store/vuex";
import ThemeIcon from "@/assets/img/icons/ThemeIcon.vue";

export default {
  components: {
    ThemeIcon,
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    backgroundStyles() {
      return {
        enable: this.darkTheme,
        disable: !this.darkTheme,
      };
    },
    indicatorStyles() {
      return {
        transform: this.darkTheme ? "translateX(34px)" : "translateX(0)",
      };
    },
  },
  methods: {
    toggle() {
      store.commit("toggleDarkTheme");
    },
  },
};
</script>

<style lang="scss" scoped>
.switch_wrap {
  display: flex;
  position: relative;
  cursor: pointer;
  width: 60px;
  height: 26px;
  border-radius: 5px;
  &:focus {
    outline: 0;
  }
  .toggle_background {
    border-radius: 5px;
    height: 100%;
    width: 100%;
    transition: background-color 0.4s ease;
    font-size: 11px;
    line-height: 1;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 8px;
    &.enable {
      background-color: #a3a3a3ff;
      justify-content: flex-start;
    }
    &.disable {
      background-color: #1c1c1cff;
      justify-content: flex-end;
    }
  }

  .toggle_indicator {
    position: absolute;
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
    background-color: var(--background-color);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.4s ease;
  }
}
</style>
