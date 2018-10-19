<template>
  <article class="view editor-view">
    <nav class="editor-tabs">
      <button
        v-for="file in files"
        :key="file.path"
        :class="'base-button editor-tab' + (currentFile === file ? ' editor-tab-active' : '')"
        @click="switchTab(file)"
      >
        <div class="editor-tab-content">
          <span class="editor-tab-label">{{ file.name }}</span>
          <icon-button
            icon="close"
            @click.stop="closeTab(file)"
            size="extra-small"
            class="close-editor-tab-button"
          />
        </div>
      </button>
      <div class="actions">
        <icon-button
          icon="add"
          slot="actions"
          size="small"
          class="action"
          @click="toggleFilePicker"
        />
      </div>
    </nav>
    <multipane class="editor-content" layout="horizontal">
      <multipane layout="vertical" class="input-area">
        <code-editor
          v-if="file === currentFile"
          v-for="file in files"
          :key="file.path"
          :file="file"
          :auto-save="autoSaveEnabled"
          class="pane"
        />
        <multipane-resizer class="multipane-resizer-vertical"/>
        <variables-panel v-if="currentFile" class="pane"/>
      </multipane>
      <multipane-resizer class="multipane-resizer-horizontal"/>
      <div class="preview-area pane"></div>
    </multipane>
    <empty-state v-if="!files.length" icon="insert_drive_file" message="No open file"/>
    <modal-dialog :visible.sync="openFileModalVisible" title="Open file">
      <directory-browser path="/" @open="openFile"/>
    </modal-dialog>
  </article>
</template>

<script>
  import { Multipane, MultipaneResizer } from "vue-multipane";
  import EmptyState from "@/components/EmptyState";
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import Path from "@/modules/Path";
  import Tabs from "@/components/Tabs/Tabs";
  import Tab from "@/components/Tabs/Tab";
  import CodeEditor from "@/components/Editor/CodeEditor";
  import ModalDialog from "@/components/Modals/ModalDialog";
  import DirectoryBrowser from "@/components/FileSystem/DirectoryBrowser";
  import VariablesPanel from "@/components/Editor/VariablesPanel";

  export default {
    name: "EditorView",

    components: {
      Multipane,
      MultipaneResizer,
      IconButton,
      MaterialIcon,
      EmptyState,
      Tabs,
      Tab,
      CodeEditor,
      VariablesPanel,
      ModalDialog,
      DirectoryBrowser
    },

    props: {
      file: {
        type: String,
        required: false
      }
    },

    data() {
      const files = [];

      return {
        currentFile: null,

        files: files,

        autoSaveEnabled: false,

        openFileModalVisible: false
      };
    },

    beforeRouteEnter(to, from, next) {
      return next(async vm => {
        await vm.loadFile(vm.file);

        if (vm.files.length === 0) {
          vm.openFilePicker();
        }

        await vm.loadSettings();
      });
    },

    methods: {
      async loadSettings() {
        this.autoSaveEnabled = await this.$settings.value(
          "editorAutoSaveEnabled",
          false
        );
      },

      async loadFile(pathOrFile) {
        if (!pathOrFile) {
          return;
        }

        let file = this.getFile(pathOrFile);

        // If this file is already opened, focus the tab
        if (file) {
          return this.switchTab(file);
        }

        file =
          typeof pathOrFile === "string"
            ? await this.$fs.get(pathOrFile)
            : pathOrFile;

        // Add the new file
        this.files.push(file);
        this.currentFile = file;
      },

      getFile(fileOrPath) {
        const filePath =
          typeof fileOrPath === "string" ? fileOrPath : fileOrPath.path;
        return this.files.find(file => file.path === filePath);
      },

      closeTab({ slug }) {
        console.log(slug);
        this.files = this.files.filter(file => file.path !== slug);
      },

      switchTab(file) {
        if (this.files.includes(file)) {
          this.currentFile = file;
        }
      },

      toggleFilePicker() {
        this.openFileModalVisible = !this.openFileModalVisible;
      },

      closeFilePicker() {
        this.openFileModalVisible = false;
      },

      openFilePicker() {
        this.openFileModalVisible = true;
      },

      async openFile(file) {
        console.log("going to open ", file);
        await this.loadFile(file);
        this.closeFilePicker();
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";

  .editor-tabs {
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    min-height: 2.5rem;
    padding-top: 5px;
    border-bottom: 3px solid var(--color-chrome);
    background-color: var(--color-white-dark);
    box-shadow: inset 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
    overflow-x: auto;
  }

  .editor-tab {
    position: relative;
    margin: 0 -1.5rem 0 0;
    padding: 0 0.25rem;
    left: 1rem;
    overflow: hidden;
    transition: all 0.3s;
    outline: none;
    z-index: 0;
  }

  .editor-tab::before,
  .editor-tab::after {
    content: "";
    position: absolute;
    bottom: -10px;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    border-width: 10px;
    border-style: solid;
    border-color: transparent;
    background: transparent;
    transition: inherit;
  }

  .editor-tab::before {
    transform: rotate(48deg);
    left: -18px;
  }

  .editor-tab::after {
    transform: rotate(-48deg);
    right: -18px;
  }

  .editor-tab-active {
    z-index: 1;
  }

  .editor-tab-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.5rem;
    padding: 0.5rem 0.5rem 0.5rem 0.75rem;
    border-radius: 0.5rem 0.5rem 0 0;
    color: var(--color-gray-medium-darker);
    white-space: nowrap;
    font-size: 0.9rem;
    outline: none;
    user-select: none;
    transition: inherit;
  }

  .editor-tab-active .editor-tab-content {
    background: var(--color-chrome);
    border-bottom-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0 2px 0 -1px var(--color-primary),
      1px 2px 0 -1px var(--color-primary), -1px 2px 0 -1px var(--color-primary);
  }

  .editor-tab:not(.editor-tab-active):focus-within::before,
  .editor-tab:not(.editor-tab-active):hover::before {
    border-color: transparent var(--color-chrome-highlight) transparent
      transparent;
  }

  .editor-tab:not(.editor-tab-active):focus-within::after,
  .editor-tab:not(.editor-tab-active):hover::after {
    border-color: transparent transparent transparent
      var(--color-chrome-highlight);
  }

  .editor-tab-active::before {
    border-color: transparent var(--color-chrome) transparent transparent;
  }

  .editor-tab-active::after {
    border-color: transparent transparent transparent var(--color-chrome);
  }

  .editor-tab:hover {
    transition: all 0.3s;
  }

  .editor-tab:not(.editor-tab-active):focus-within .editor-tab-content,
  .editor-tab:not(.editor-tab-active):hover .editor-tab-content {
    background: var(--color-chrome-highlight);
    border-bottom-color: var(--color-inactive);
    color: var(--color-inactive);
    box-shadow: 0 2px 0 -1px var(--color-inactive),
      1px 2px 0 -1px var(--color-inactive), -1px 2px 0 -1px var(--color-inactive);
  }

  .editor-tab:not(.editor-tab-active):not(:hover)
    + .editor-tab:not(.editor-tab-active):not(:hover)
    .editor-tab-content::before {
    background: var(--color-inactive);
  }

  .editor-tab .editor-tab-content::before {
    content: "";
    position: absolute;
    left: 11px;
    top: 0.5rem;
    height: 1rem;
    width: 1px;
    pointer-events: none;
    transition: background 0.125s;
  }

  .editor-tab .close-editor-tab-button {
    margin-left: 0.5rem;
    pointer-events: all;
  }

  .actions {
    display: flex;
    align-items: center;
    margin: 0 0.5rem 0 auto;
  }

  .actions .action + .action {
    margin-left: 0.5rem;
  }

  .editor-content {
    display: flex;
    height: calc(100% - 0.5rem);
    overflow: hidden;
  }

  .editor-content .pane {
    overflow: hidden;
    box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.25);
  }

  .layout-v .pane {
    min-height: 100%;
    max-height: 100%;
  }

  .editor-content .multipane,
  .editor-content .multipane-resizer {
    position: relative;
    z-index: unset;
  }

  .editor-content .code-editor {
    min-width: 60%;
  }

  .editor-content .variables-panel {
    flex-grow: 1;
    min-width: 20%;
  }

  .editor-content .input-area {
    min-height: 20%;
  }

  .editor-content .preview-area {
    flex-grow: 1;
    min-height: 20%;
    box-shadow: inset 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
  }

  .editor-content .multipane-resizer-vertical {
    position: relative;
    left: 0;
    width: 8px;
    height: auto;
    margin-left: 0;
    background: var(--color-chrome);
  }

  .editor-content .multipane-resizer-horizontal {
    position: relative;
    top: 0;
    height: 8px;
    margin-top: 0;
    background: var(--color-chrome);
  }

  .editor-content .multipane-resizer::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-color: var(--color-dim);
    transition: all 0.125s;
  }

  .editor-content .multipane-resizer:hover::after {
    border-color: var(--color-inactive);
  }

  .editor-content .multipane-resizer-vertical::after {
    top: 50%;
    left: 2.5px;
    transform: translateY(-50%);
    height: 4rem;
    width: 1px;
    border-width: 0 1px;
  }

  .editor-content .multipane-resizer-horizontal::after {
    left: 50%;
    top: 2.5px;
    transform: translateX(-50%);
    width: 4rem;
    height: 1px;
    border-width: 1px 0;
  }
</style>
 