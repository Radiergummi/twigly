<template>
  <article class="empty-state">
    <span class="empty-state-icon material-icons">{{ icon }}</span>
    <span class="empty-state-message">{{ message }}</span>
  </article>
</template>

<script>
  export default {
    name: "EmptyState",

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--color-dim);
  }

  .empty-state-icon {
    font-size: 6rem;
  }
</style>

