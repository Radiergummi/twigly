<template>
  <div class="view settings-view">
    <page v-if="settings" class="settings-page" title="Settings">
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
      <section class="editor-settings">
        <div class="setting">
          <label
            for="setting-editorAutoSaveEnabled"
          >Whether to enable or disable the auto-save feature of the editor.</label>
          <input
            type="checkbox"
            id="setting-editorAutoSaveEnabled"
            v-model="settings.editorAutoSaveEnabled"
          >
        </div>
      </section>
      <section class="danger-zone">
        <header>
          <h3>Danger Zone</h3>
        </header>
        <ul class="danger-settings">
          <li class="danger-setting">
            <p
              class="danger-description"
            >If there is something wrong with the filesystem or you want to trash all files on it, you can format the filesystem.
              <br>This will clear the whole directory structure, leaving you with a fresh root.
            </p>
            <button
              class="button danger-action format-filesystem-button"
              @click="formatFileSystem"
            >Format filesystem</button>
          </li>
        </ul>
      </section>
      <modal-dialog
        title="test"
        :visible.sync="formatFileSystemModalShown"
        :actions="[{name:'format',label:'Format filesystem',danger:true}]"
      >this is in body</modal-dialog>
    </page>
    <empty-state v-show="!settings" icon="save" message="Loading settings file..."/>
    <transition name="appear">
      <floating-action-button
        v-show="settings && pendingChanges"
        icon="save"
        @click="updateSettings"
      />
    </transition>
  </div>
</template>

<script>
  import ModalDialog from "@/components/Modals/ModalDialog";
  import Page from "@/components/Page";
  import EmptyState from "@/components/EmptyState";
  import FloatingActionButton from "@/components/FloatingActionButton";

  export default {
    name: "SettingsView",

    components: {
      Page,
      ModalDialog,
      EmptyState,
      FloatingActionButton
    },

    props: {
      page: {
        type: String,
        default: "overview"
      }
    },

    data() {
      return {
        formatFileSystemModalShown: false,

        defaultSettings: {
          editorAutoSaveEnabled: false
        },

        settings: null,

        lastState: ""
      };
    },

    computed: {
      pendingChanges() {
        return this.lastState !== JSON.stringify(this.settings);
      }
    },

    mounted() {
      this.loadSettings();
    },

    methods: {
      async loadSettings() {
        let settings;

        try {
          settings = await this.$settings.readRaw();
        } catch (error) {
          settings = JSON.stringify(this.defaultSettings);
        }

        // Set the last-saved-state to the current settings string
        this.lastState = settings;

        // Set the actual settings to the parsed JSON settings object
        this.settings = JSON.parse(settings);
      },

      async updateSettings() {
        const settings = JSON.stringify(this.settings);

        await this.$settings.write(settings);

        // Set the last-saved-state to the current JSON string
        this.lastState = settings;
      },

      formatFileSystem() {
        this.formatFileSystemModalShown = true;
        //        alert("This feature is not yet implemented");
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";

  .danger-zone .danger-settings {
    margin: 1rem 0 0 0;
    padding: 1rem;
    border: 2px dashed var(--color-red);
    border-radius: 6px;
    list-style: none;
  }

  .danger-setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  .danger-setting + .danger-setting {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-dim);
  }

  .danger-setting .danger-description {
    margin: 0 1rem 0 0;
    padding: 0;
    line-height: 1.4;
    font-size: 0.9rem;
  }

  .danger-setting .danger-action {
    color: var(--color-red);
  }

  .danger-setting .danger-action:focus,
  .danger-setting .danger-action:hover {
    background: var(--color-red);
    color: var(--color-white);
  }
</style>
