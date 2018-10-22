<template>
  <nav class="path-breadcrumbs">
    <template v-for="(breadcrumb, index) in breadcrumbs">
      <span :key="'sep-' + breadcrumb" class="path-breadcrumb-separator">/</span>
      <router-link
        :key="breadcrumb"
        :to="route(breadcrumb)"
        class="path-breadcrumb"
        :tabindex="index < breadcrumbs.length - 1 ? '0' : '-1'"
      >{{ breadcrumb }}</router-link>
    </template>
    <span v-if="!breadcrumbs.length" class="path-breadcrumb-separator">/</span>
  </nav>
</template>

<script>
  import Path from "@/modules/Path";

  export default {
    name: "PathBreadcrumbs",

    props: {
      path: {
        type: String,
        required: true
      }
    },

    computed: {
      breadcrumbs() {
        return this.path.split("/").filter(breadcrumb => !!breadcrumb);
      }
    },

    methods: {
      route(breadcrumb) {
        const segments = this.breadcrumbs.slice(
          0,
          this.breadcrumbs.indexOf(breadcrumb) + 1
        );

        return {
          name: "FileSystem",
          params: {
            path: Path.join(...segments)
          }
        };
      }
    }
  };
</script>


<style scoped>
  .path-breadcrumbs {
    display: flex;
    align-items: center;
    user-select: none;
  }

  .path-breadcrumb,
  .path-breadcrumb-separator {
    display: block;
    padding: 0.5rem;
    font-size: 1.5rem;
  }

  .path-breadcrumb {
    text-decoration: none;
    border-radius: 3px;
    color: var(--color-gray);
    outline: none;
    transition: all 0.125s;
  }

  .path-breadcrumb:focus,
  .path-breadcrumb:hover {
    background: var(--color-interactive-highlight);
  }

  .path-breadcrumb:last-child {
    color: var(--color-primary);
    pointer-events: none;
  }

  .path-breadcrumb-separator {
    color: var(--color-gray-lighter);
    cursor: default;
  }
</style>
