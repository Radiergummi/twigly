<template>
  <article class="code-editor">
    <textarea class="code-editor-input" v-model="content" autofocus ref="editorInput"></textarea>
    <transition name="appear">
      <floating-action-button v-show="pendingChanges && !autoSave" icon="save" @click="updateFile"/>
    </transition>
  </article>
</template>

<script>
  import FloatingActionButton from "@/components/FloatingActionButton";
  import debounce from "@/utils/debounce";

  export default {
    name: "CodeEditor",

    components: {
      FloatingActionButton
    },

    props: {
      /**
       * Holds the FileSystemFile instance for the file to edit. Sadly, we cannot pass said
       * constructor for type checking, since that results in a circular dependency...
       * TODO: Solve this. Starting point: https://stackoverflow.com/a/42704874/2532203
       *
       * @type {FileSystemFile}
       */
      file: {
        type: Object,
        default: () => {}
      },

      autoSave: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        content: "",
        savedState: ""
      };
    },

    watch: {
      content() {
        if (this.autoSave && this.pendingChanges) {
          this.save();
        }
      }
    },

    computed: {
      pendingChanges() {
        return this.content !== this.savedState;
      }
    },

    async mounted() {
      this.savedState = await this.file.getContent();
      this.content = await this.file.getContent();
      this.$refs.editorInput.focus();
    },

    methods: {
      save: debounce(function() {
        return this.updateFile();
      }, 100),

      async updateFile() {
        await this.file.write(this.content);

        this.savedState = this.content;
      }
    }
  };
</script>

<style scoped>
  .code-editor {
    display: flex;
    padding: 1rem;
  }

  .code-editor-input {
    display: block;
    margin: 0;
    padding: 0;
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    background: transparent;
    resize: none;
  }
</style>
