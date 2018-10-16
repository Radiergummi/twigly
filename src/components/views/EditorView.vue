<template>
  <article class="view editor-view">
    <tabs :close-buttons="true" @close="closeTab" @changed="setCurrent">
      <tab v-for="file in openFiles" :key="file.path" :slug="file.path" :name="file.name">
        <code-editor>{{file.name}}</code-editor>
      </tab>
      <icon-button icon="add" slot="actions" size="small" class="action"/>
      <empty-state v-if="!openFiles" icon="insert_drive_file" message="No open file"/>
    </tabs>
  </article>
</template>

<script>
  import EmptyState from "@/components/EmptyState";
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import Path from "@/modules/Path";
  import Tabs from "@/components/Tabs/Tabs";
  import Tab from "@/components/Tabs/Tab";
  import CodeEditor from "@/components/Editor/CodeEditor";

  export default {
    name: "EditorView",

    components: {
      IconButton,
      MaterialIcon,
      EmptyState,
      Tabs,
      Tab,
      CodeEditor
    },

    props: {},

    data() {
      return {
        currentFile: null,

        openFiles: [
          { path: "a", name: "EditorView.vue" },
          { path: "b", name: "AppMenuItem.vue" },
          { path: "c", name: "theme.dark.css" }
        ]
      };
    },

    computed: {},

    methods: {
      closeTab({ slug }) {
        console.log(slug);
        this.openFiles = this.openFiles.filter(file => file.path !== slug);
      },

      setCurrent(tab) {
        const file = this.openFiles.find(file => file.path === tab.slug);

        if (!file) {
          return;
        }

        this.currentFile = file;
      }
    }
  };
</script>

<style scoped>
</style>


 