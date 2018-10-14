<template>
  <header class="app-header">
    <nav class="breadcrumbs">
      <h1 class="app-name breadcrumb">Twigly</h1>
      <span class="current-module breadcrumb">{{ $route.meta.breadcrumb }}</span>
    </nav>
    <button class="switch-theme-button" @click="switchTheme" title="Switch theme"></button>
  </header>
</template>

<script>
  export default {
    name: "AppHeader",

    data() {
      return {
        theme: "light"
      };
    },

    methods: {
      switchTheme() {
        this.theme = this.theme === "light" ? "dark" : "light";
        this.$emit("theme-change", this.theme);
      }
    }
  };
</script>

<style scoped>
  .app-header {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
    background: var(--color-chrome);
    transition: inherit;
    user-select: none;
  }
  .breadcrumbs {
    display: flex;
    padding: 0;
  }

  .breadcrumbs .breadcrumb + .breadcrumb::before {
    content: "▸";
  }

  .app-name {
    margin: 0 0.25rem 0 0;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-chrome-text);
  }

  .switch-theme-button {
    -webkit-appearance: none;
    border: none;
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
    border-radius: 50%;
    box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.25);
    background: var(--color-alternative-theme);
    cursor: pointer;
    outline: none;
    transition: inherit;
  }

  .switch-theme-button:focus,
  .switch-theme-button:hover {
    box-shadow: 0 1px 8px -1px rgba(0, 0, 0, 0.75);
  }
</style>
