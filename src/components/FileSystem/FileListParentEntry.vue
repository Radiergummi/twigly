<template>
  <li class="file-list-entry" v-if="file">
    <span class="item-icon material-icons">arrow_upward</span>
    <span class="item-name">..</span>
  </li>
</template>

<script>
  import FileListEntry from "./FileListEntry";

  export default {
    name: "FileListParentEntry",
    extends: FileListEntry
  };
</script>

<style scoped>
  .file-list-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-gutter);
    background: var(--color-interactive);
    cursor: pointer;
    transition: all 0.125s;
    user-select: none;
  }

  .file-list-entry:focus,
  .file-list-entry:hover {
    background: var(--color-interactive-highlight);
  }

  .item-icon {
    margin-right: 1rem;
    color: var(--color-primary);
  }

  .item-name {
    margin-right: auto;
    color: var(--color-primary);
  }

  .item-size {
    margin-left: 1rem;
    color: var(--color-gray);
  }

  .item-modified {
    margin-left: 1rem;
  }
</style>
