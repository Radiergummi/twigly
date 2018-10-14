<template>
  <router-link :to="route" :class="'menu-item' + (active ? ' menu-item-active' : '')">
    <span class="material-icons">{{icon}}</span>
  </router-link>
</template>

<script>
  export default {
    name: "AppMenuItem",

    props: {
      target: {
        type: null,
        required: true
      },

      icon: {
        type: String,
        required: true
      }
    },

    computed: {
      route() {
        return {
          name: this.target
        };
      },

      active() {
        return this.$route.name === this.target;
      }
    }
  };
</script>

<style scoped>
  .menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 1rem);
    height: 3rem;
    padding: 1rem;
    border-radius: 50%;
    text-decoration: none;
    color: var(--color-interactive-label);
    transition: inherit;
  }

  .menu-item:focus,
  .menu-item:hover {
    background: var(--color-interactive-highlight);
  }

  .menu-item.menu-item-active {
    color: var(--color-primary);
  }
</style>
