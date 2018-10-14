<template>
  <article class="view file-system-view">
    <aside class="tree-area"></aside>
    <section class="directory-area">
      <header class="directory-info">
        <nav class="path-breadcrumbs">
          <template v-for="breadcrumb in breadcrumbs">
            <span :key="'sep-' + breadcrumb" class="path-breadcrumb-separator">/</span>
            <router-link
              :key="breadcrumb"
              :to="{name:'FileSystem',params: {path: ''}}"
              class="path-breadcrumb"
            >{{ breadcrumb }}</router-link>
          </template>
          <span v-if="!breadcrumbs.length" class="path-breadcrumb-separator">/</span>
        </nav>
      </header>
      <ul class="current-path-content">
        <file-list-parent-entry
          v-if="!isRoot"
          class="current-path-item parent-item"
          :path="parentDirectory"
          @click.native="navigate(parentDirectory)"
        />
        <file-list-entry
          class="current-path-item"
          v-for="path in currentDirectoryContents"
          :path="path"
          :key="path"
          @delete="deleteItem(path)"
          @click.native="navigate(path)"
        />
      </ul>
      <empty-state
        v-show="currentDirectoryContents.length === 0"
        message="This folder is empty."
        icon="folder_open"
      />
      <floating-action-button icon="add" @click="createDirectory"/>
    </section>
  </article>
</template>

<script>
  import Path from "@/modules/Path";
  import FileListEntry from "@/components/FileSystem/FileListEntry";
  import FileListParentEntry from "@/components/FileSystem/FileListParentEntry";
  import FloatingActionButton from "@/components/FloatingActionButton";
  import EmptyState from "@/components/EmptyState";

  export default {
    name: "FileSystemView",

    components: {
      FileListEntry,
      FileListParentEntry,
      FloatingActionButton,
      EmptyState
    },

    props: {
      path: {
        type: String,
        default: "/"
      }
    },

    data() {
      return {
        currentDirectoryContents: []
      };
    },

    watch: {
      workingDirectory() {
        this.listDirectory();
      }
    },

    computed: {
      breadcrumbs() {
        return this.workingDirectory
          .split("/")
          .filter(breadcrumb => !!breadcrumb);
      },

      workingDirectory() {
        return Path.normalize("/" + this.path);
      },

      isRoot() {
        return this.workingDirectory === "/";
      },

      parentDirectory() {
        return Path.parent(this.workingDirectory);
      },

      currentDirectoryName() {
        return Path.basename(this.workingDirectory);
      }
    },

    mounted() {
      this.listDirectory();
    },

    methods: {
      navigate(path) {
        this.$router.push({
          name: "FileSystem",
          params: { path }
        });
      },

      async listDirectory() {
        let list;

        try {
          list = await this.$fs.readDirectory(this.workingDirectory);
        } catch (error) {
          alert(error.message);
        }

        this.currentDirectoryContents = list;
      },

      async createDirectory() {
        const name = prompt("Please enter the name of the new directory");

        if (!name) {
          return;
        }

        // Create the directory
        await this.$fs.createDirectory(Path.join(this.workingDirectory, name));

        // Reload the directory list
        this.listDirectory();
      },

      async deleteItem(path) {
        const item = await this.$fs.get(path);

        await item.delete();

        this.listDirectory();
      }
    }
  };
</script>

<style scoped>
  .file-system-view {
    display: flex;
    height: 100%;
  }

  .tree-area {
    flex: 0 0 20%;
    border-right: 1px solid var(--color-gutter);
  }

  .directory-area {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
  }

  .directory-info {
    padding: 1rem;
    line-height: 1;
    border-bottom: 1px solid var(--color-gutter);
  }

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

  .current-path {
    margin: 0;
  }

  .current-path-content {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
  }
</style>

