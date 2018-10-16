<template>
  <div id="app" :class="'theme-' + theme">
    <img class="logo" src="./assets/logo.png">
    <app-header @theme-change="applyTheme"/>
    <app-menu/>
    <main class="app-content">
      <transition :name="transition">
        <router-view class="current-view"/>
      </transition>
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
        theme: "light",

        transition: "slide-right"
      };
    },

    watch: {
      $route(to, from) {
        const toDepth = to.path.split("/").length;
        const fromDepth = from.path.split("/").length;
        this.transition = toDepth < fromDepth ? "slide-right" : "slide-left";
      }
    },

    methods: {
      applyTheme(theme) {
        this.theme = theme;
      }
    }
  };
</script>

<style>
  @import "./styles/normalize.css";
  @import "./styles/global.css";
  @import "./styles/theme.light.css";
  @import "./styles/theme.dark.css";

  #app {
    display: grid;
    grid-template-areas:
      "logo header"
      "menu content";
    grid-template-columns: 4rem auto;
    grid-template-rows: 4rem calc(100vh - 4rem);

    color: var(--color-text);
    transition: inherit;
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
    position: relative;
    grid-area: content;
    background: var(--color-background);
    box-shadow: inset 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
    transition: inherit;
    overflow: hidden;
  }

  .app-content .view {
    position: relative;
    height: 100%;
  }

  .app-content .current-view {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    transform: translate(10px, 0);
  }
  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    transform: translate(-10px, 0);
  }
</style>
