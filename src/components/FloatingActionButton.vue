<template>
  <button class="floating-action-button" @click="$emit('click')">
    <span class="material-icons">{{ icon }}</span>
  </button>
</template>

<script>
  export default {
    name: "FloatingActionButton",

    props: {
      icon: {
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>
  .floating-action-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;

    -webkit-appearance: none;
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 2rem;
    background: var(--color-primary);
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    transition: all 0.25s;
  }

  .floating-action-button:focus,
  .floating-action-button:hover {
    outline: none;
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25),
      0 4px 15px -2px rgba(0, 0, 0, 0.25);
  }
</style>
