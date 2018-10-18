<template>
  <article class="view file-system-view">
    <aside class="tree-area"></aside>
    <directory-browser
      class="directory-area"
      :path="path"
      :show-actions="true"
      ref="browser"
      @navigate="navigate"
      @open="openFile"
    />
  </article>
</template>

<script>
  import Path from "@/modules/Path";
  import DirectoryBrowser from "@/components/FileSystem/DirectoryBrowser";
  import FloatingActionButtonSpeedDial from "@/components/FloatingActionButtonSpeedDial";

  export default {
    name: "FileSystemView",

    components: {
      DirectoryBrowser,
      FloatingActionButtonSpeedDial
    },

    props: {
      path: {
        type: String,
        default: "/"
      }
    },

    data() {
      return {};
    },

    methods: {
      /**
       * Creates a new directory
       * TODO: Real prompt
       */
      async createDirectory() {
        const name = prompt("Please enter the name of the new directory:");

        if (!name) {
          return;
        }

        // Create the directory
        await this.$fs.createDirectory(Path.join(this.workingDirectory, name));

        // Reload the directory list
        this.$refs.browser.listDirectory();
      },

      async createFile() {
        const name = prompt("Please enter the name of the new file:");

        if (!name) {
          return;
        }

        // Create the file
        await this.$fs.writeFile(Path.join(this.workingDirectory, name));

        // Reload the directory list
        this.$refs.browser.listDirectory();
      },

      async startUpload() {
        alert("not yet implemented");
      },

      /**
       * Deletes a file or directory
       */
      async deleteItem(path) {
        const item = await this.$fs.get(path);

        await item.delete();

        this.$refs.browser.listDirectory();
      },

      openFile(file) {
        this.$router.push({
          name: "Editor",
          params: {
            file: target.path
          }
        });
      },

      navigate(target) {
        this.$router.push({
          name: "FileSystem",
          params: {
            path: target.path
          }
        });
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
</style>

