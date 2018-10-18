<template>
  <section class="panel variables-panel">
    <header class="panel-header variables-panel-header">
      <h3 class="panel-title">Variables</h3>
      <span class="variable-count">{{ variables.length }}</span>
    </header>
    <div class="panel-content">
      <ul class="variables-list">
        <li v-for="variable in variables" :key="variable.name" class="variable">
          <span class="variable-value">{{ variable.name }}</span>
          <icon-button
            icon="close"
            class="remove-variable-button"
            size="extra-small"
            @click.native.stop="remove(variable.name)"
          />
        </li>
      </ul>
    </div>
    <footer class="variables-panel-actions">
      <button class="button add-variable-button" @click="showAddVariableModal">
        <material-icon name="add"/>
        <span>Add</span>
      </button>
    </footer>
    <add-variable-modal :visible.sync="addVariableModalVisible" @add="add"/>
  </section>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";
  import AddVariableModal from "@/components/Editor/AddVariableModal";

  export default {
    name: "VariablesPanel",

    components: {
      MaterialIcon,
      IconButton,
      ModalDialog,
      AddVariableModal
    },

    data() {
      return {
        variables: [],

        addVariableModalVisible: false
      };
    },

    methods: {
      get(name) {
        return this.variables.find(variable => variable.name === name);
      },

      add({ name, value }) {
        // Permit duplicates
        if (this.get(name)) {
          return;
        }

        const variable = { name, value };

        this.variables.push(variable);
        this.$emit("add-variable", variable);
      },

      remove(name) {
        const variable = this.get(name);

        if (!variable) {
          return;
        }

        this.variables.splice(this.variables.indexOf(variable), 1);
        this.$emit("remove-variable", variable);
      },

      displayValue(value) {
        return value.toLocaleString();
      },

      showAddVariableModal() {
        this.addVariableModalVisible = true;
      },

      hideAddVariableModal() {
        this.addVariableModalVisible = false;
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";

  .panel {
    padding: 1rem;
    background: var(--color-chrome);
  }

  .panel .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel .panel-title {
    margin: 0;
  }

  .variables-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 1rem 0;
  }

  .variables-list .variable {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background: var(--color-interactive-highlight);
    box-shadow: var(--shadow-base);
    cursor: pointer;
  }

  .variables-list .variable .remove-variable-button {
    margin-left: 0.5rem;
  }
</style>
