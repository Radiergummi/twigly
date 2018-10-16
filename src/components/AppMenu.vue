<template>
  <nav class="app-menu">
    <app-menu-item target="Dashboard" icon="dashboard"/>
    <app-menu-item target="FileSystem" icon="folder"/>
    <app-menu-item target="Editor" icon="code"/>
    <app-menu-item target="Settings" icon="settings" class="settings-item"/>
  </nav>
</template>

<script>
  import AppMenuItem from "@/components/AppMenuItem";

  export default {
    name: "AppMenu",

    components: {
      AppMenuItem
    }
  };
</script>

<style scoped>
  .app-menu {
    grid-area: menu;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem 0;

    background: var(--color-chrome);
    transition: inherit;
    user-select: none;
  }

  .menu-item + .menu-item {
    margin-top: 1rem;
  }

  .menu-item.settings-item {
    margin-top: auto;
  }
</style>
