<template>
  <article class="page">
    <header class="page-header">
      <h2 class="page-title">{{ title }}</h2>
      <h3 class="page-subtitle" v-if="subtitle">{{ subtitle }}</h3>
    </header>
    <div class="page-content">
      <slot/>
    </div>
  </article>
</template>

<script>
  export default {
    name: "Page",

    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String,
        required: false
      }
    }
  };
</script>

<style scoped>
  .page {
    width: 100%;
    max-width: 49.5rem;
    margin: 1rem auto 0;
    padding: 1rem;
    border-radius: 3px;
    background: var(--color-chrome);
    box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.5),
      0 1px 5px -1px rgba(0, 0, 0, 0.1);
  }

  .page-header {
    padding-bottom: 1rem;
  }

  .page-title {
    margin: 0;
    font-size: 3rem;
  }

  .page-content p {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .page-content h3 {
    margin: 0;
  }

  .page-content section {
    margin-top: 2rem;
  }
</style>
