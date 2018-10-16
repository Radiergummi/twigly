<template>
  <article class="code-editor">
    <textarea class="code-editor-input" v-model="content" autofocus ref="editorInput"></textarea>
  </article>
</template>

<script>
  export default {
    name: "CodeEditor",

    props: {
      initialContent: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        content: ""
      };
    },

    mounted() {
      this.content = this.initialContent;
      this.$refs.editorInput.focus();
    }
  };
</script>

<style scoped>
  .code-editor {
    display: flex;
    height: 100%;
    padding: 1rem;
  }

  .code-editor-input {
    display: block;
    background: transparent;
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    resize: none;
  }
</style>
