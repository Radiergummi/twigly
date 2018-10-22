<template>
  <article class="empty-state">
    <material-icon class="empty-state-icon" :name="icon"/>
    <span class="empty-state-message">{{ message }}</span>
  </article>
</template>

<script>
  import MaterialIcon from "@/components/MaterialIcon";

  export default {
    name: "EmptyState",

    components: {
      MaterialIcon
    },

    props: {
      icon: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>
  .empty-state {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100% - 4rem);
    padding: 2rem;
    color: var(--color-dim);
    user-select: none;
  }

  .empty-state-icon {
    font-size: 6rem;
  }
</style>

