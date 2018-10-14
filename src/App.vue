<template>
  <div id="app" :class="'theme-' + theme">
    <img class="logo" src="./assets/logo.png">
    <app-header @theme-change="applyTheme"/>
    <app-menu/>
    <main class="app-content">
      <router-view/>
    </main>
  </div>
</template>

<script>
  import AppMenu from "@/components/AppMenu";
  import AppHeader from "@/components/AppHeader";

  export default {
    name: "App",

    components: {
      AppHeader,
      AppMenu
    },

    data() {
      return {
        theme: "light"
      };
    },

    methods: {
      applyTheme(theme) {
        this.theme = theme;
      }
    }
  };
</script>

<style>
  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  :root {
    --color-white-pure: #fff;
    --color-white: #fafafa;
    --color-white-dark: #eee;
    --color-gray-lighter: #ddd;
    --color-gray-light: #ccc;
    --color-gray: #888;
    --color-gray-dark: #666;
    --color-gray-darker: #333;
    --color-black-pure: #000;

    --color-blue-light: #1484e6;
    --color-blue: #1c69ad;
    --color-blue-dark: #215079;

    --color-red: rgb(218, 82, 82);
  }

  #app {
    display: grid;
    grid-template-areas:
      "logo header"
      "menu content";
    grid-template-columns: 4rem auto;
    grid-template-rows: 4rem calc(100vh - 4rem);

    color: var(--color-text);
    transition: all 0.125s;

    font-family: "Roboto", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app.theme-light {
    --color-primary: var(--color-blue-light);

    --color-background: var(--color-white);
    --color-chrome: var(--color-white-pure);
    --color-gutter: var(--color-white-dark);
    --color-alternative-theme: var(--color-gray-darker);
    --color-chrome-text: var(--color-blue);
    --color-text: var(--color-blue-dark);
    --color-interactive: var(--color-white-pure);
    --color-interactive-label: var(--color-gray-light);
    --color-interactive-highlight: var(--color-white-dark);
    --color-dim: var(--color-gray-light);
  }

  #app.theme-dark {
    --color-primary: var(--color-blue);

    --color-background: var(--color-gray-darker);
    --color-chrome: var(--color-black-pure);
    --color-gutter: var(--color-gray-dark);
    --color-alternative-theme: var(--color-gray-lighter);
    --color-chrome-text: var(--color-blue-light);
    --color-text: var(--color-blue-dark);
    --color-interactive: var(--color-gray-darker);
    --color-interactive-label: var(--color-gray-dark);
    --color-interactive-highlight: var(--color-black-pure);
    --color-interactive-label-highlight: var(--color-gray-darker);
    --color-dim: var(--color-gray-light);
  }

  .logo {
    grid-area: logo;
    display: block;
    width: 4rem;
    height: 4rem;
    padding: 1rem;
    background: var(--color-chrome);
    transition: inherit;
    user-select: none;
  }

  .app-content {
    grid-area: content;
    background: var(--color-background);
    box-shadow: inset 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
    transition: inherit;
  }
</style>
