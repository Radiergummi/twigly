<template>
  <article class="directory-browser" v-if="currentDirectoryContents">
    <header class="directory-info">
      <path-breadcrumbs :path="workingDirectory"/>
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
    <floating-action-button-speed-dial
      v-if="showActions"
      icon="add"
      :actions="actions"
      @action-new-directory="createDirectory"
      @action-new-file="createFile"
      @action-new-upload="startUpload"
    />
  </article>
</template>

<script>
  import Path from "@/modules/Path";
  import FileListEntry from "@/components/FileSystem/FileListEntry";
  import FileListParentEntry from "@/components/FileSystem/FileListParentEntry";
  import PathBreadcrumbs from "@/components/FileSystem/PathBreadcrumbs";
  import FloatingActionButtonSpeedDial from "@/components/FloatingActionButtonSpeedDial";
  import EmptyState from "@/components/EmptyState";

  export default {
    name: "DirectoryBrowser",

    components: {
      FileListEntry,
      FileListParentEntry,
      PathBreadcrumbs,
      FloatingActionButtonSpeedDial,
      EmptyState
    },

    props: {
      path: {
        type: String,
        default: "/"
      },

      showActions: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        workingDirectory: "",

        currentDirectoryContents: [],

        actions: [
          { name: "new-directory", icon: "folder", label: "New folder" },
          { name: "new-file", icon: "insert_drive_file", label: "New file" },
          { name: "new-upload", icon: "cloud_upload", label: "Upload" }
        ]
      };
    },

    watch: {
      workingDirectory() {
        console.log("working directory changed");
        this.listDirectory();
      }
    },

    computed: {
      /**
       * Whether the current directory is the root directory
       */
      isRoot() {
        return this.workingDirectory === "/";
      },

      /**
       * Retrieves the parent directory of the current directory
       */
      parentDirectory() {
        return Path.parent(this.workingDirectory);
      }
    },

    mounted() {
      this.workingDirectory = Path.normalize("/" + this.path);

      this.listDirectory();
    },

    methods: {
      /**
       * Navigates to a path
       *
       * @param {String} path
       */
      async navigate(path) {
        console.log("navigating to ", path);
        const target = await this.$fs.get(path);

        if (await target.isFile()) {
          return this.$emit("open", target);
        }

        this.$emit("navigate", target);
        this.$emit("update:path", target.path);
      },

      /**
       * Lists the contents of a directory
       */
      async listDirectory() {
        let list;

        try {
          list = await this.$fs.readDirectory(this.workingDirectory);
          console.log("current directory content:", list);
        } catch (error) {
          alert(error.message);
        }

        this.currentDirectoryContents = list;
      },

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
        this.listDirectory();
      },

      async createFile() {
        const name = prompt("Please enter the name of the new file:");

        if (!name) {
          return;
        }

        // Create the file
        await this.$fs.writeFile(Path.join(this.workingDirectory, name));

        // Reload the directory list
        this.listDirectory();
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

        this.listDirectory();
      }
    }
  };
</script>

<style scoped>
  .directory-info {
    padding: 1rem;
    line-height: 1;
    border-bottom: 1px solid var(--color-gutter);
  }

  .current-path-content {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
  }
</style>