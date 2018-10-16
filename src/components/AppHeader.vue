<template>
  <header class="app-header">
    <nav class="breadcrumbs">
      <h1 class="app-name breadcrumb">Twigly</h1>
      <span class="breadcrumb-separator material-icons">arrow_right</span>
      <span :class="'current-module breadcrumb' + (navigated ? ' navigated' : '')">{{ breadcrumb }}</span>
    </nav>
    <button class="switch-theme-button" @click="switchTheme" title="Switch theme"></button>
  </header>
</template>

<script>
  export default {
    name: "AppHeader",

    data() {
      return {
        theme: "light",

        navigated: false
      };
    },

    watch: {
      breadcrumb() {
        this.navigated = true;

        // Reset the navigated state after the animation is finished
        setTimeout(() => (this.navigated = false), 450);
      }
    },

    computed: {
      breadcrumb() {
        return this.$route.meta.breadcrumb;
      }
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
    align-items: center;
    padding: 0;
    color: var(--color-chrome-text);
  }

  .breadcrumb-separator {
    display: block;
  }

  .breadcrumb.navigated {
    animation-name: shift;
    animation-duration: 0.45s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .app-name {
    margin: 0;
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

  @keyframes shift {
    0% {
      transform: translateX(2rem);
      opacity: 0;
    }

    75% {
      transform: translateX(0);
    }

    100% {
      opacity: 1;
    }
  }
</style>
