<template>
  <li class="file-list-entry" v-if="file">
    <span class="item-icon material-icons">{{ icon }}</span>
    <span class="item-name">{{ file.name }}</span>
    <span class="item-size" v-if="!isDirectory">{{ meta.size }}&hairsp;B</span>
    <span class="item-modified">{{ getDate(meta.mtime) }}</span>
    <button class="delete-item-button" @click.stop="deleteItem">
      <span class="material-icons" title="Delete">delete</span>
    </button>
  </li>
</template>

<script>
  export default {
    name: "FileListEntry",

    props: {
      path: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        file: null,
        meta: {},
        isDirectory: false
      };
    },

    computed: {
      icon() {
        return this.isDirectory ? "folder" : "insert_drive_file";
      }
    },

    mounted() {
      this.loadItem();
    },

    methods: {
      async loadItem() {
        this.file = await this.$fs.get(this.path);
        this.meta = await this.file.getMeta();
        this.isDirectory = await this.file.isDirectory();
      },

      getDate(timestamp) {
        return new Date(timestamp).toLocaleString();
      },

      deleteItem() {
        if (
          confirm(
            `Are you sure you want to delete ${
              this.file.name
            }? This cannot be undone.`
          )
        ) {
          this.$emit("delete");
        }
      }
    }
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
  }

  .file-list-entry:focus,
  .file-list-entry:hover {
    background: var(--color-interactive-highlight);
  }

  .item-icon {
    margin-right: 1rem;
    user-select: none;
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

  .delete-item-button {
    -webkit-appearance: none;
    margin: 0 0 0 1rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.2rem;
    color: var(--color-interactive-label);
    transition: all 0.125s;
    user-select: none;
  }

  .delete-item-button:focus,
  .delete-item-button:hover {
    color: var(--color-red);
  }

  .delete-item-button .material-icons {
    display: block;
    font-size: inherit;
    line-height: 1;
  }
</style>
