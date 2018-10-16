<template>
  <router-link :to="route" :class="classes">
    <material-icon :name="icon"/>
  </router-link>
</template>

<script>
  import MaterialIcon from "@/components/MaterialIcon";

  export default {
    name: "AppMenuItem",

    components: {
      MaterialIcon
    },

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
      },

      classes() {
        return {
          "menu-item": true,
          "menu-item-active": this.active
        };
      }
    }
  };
</script>

<style scoped>
  .menu-item {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 1rem);
    height: 3rem;
    padding: 1rem;
    border-radius: 50%;
    font-size: 1.4rem;
    text-decoration: none;
    color: var(--color-chrome-text);
    transition: inherit;
  }

  .menu-item-active,
  .menu-item:focus,
  .menu-item:hover {
    background: var(--color-interactive-highlight);
  }
</style>
