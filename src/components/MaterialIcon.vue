<template>
  <span class="icon material-icons">{{ name }}</span>
</template>

<script>
  export default {
    name: "MaterialIcon",

    props: {
      name: {
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>
  .icon {
    font-size: inherit;
  }
</style>

