<template>
  <section class="panel variables-panel">
    <header class="panel-header variables-panel-header">
      <h3 class="panel-title">Variables</h3>
      <span class="variable-count">{{ variables.length }}</span>
    </header>
    <div class="panel-content">
      <ul class="variables-list">
        <li
          v-for="(variable, index) in variables"
          :key="index"
          class="variable"
          @click="showEditVariableModal(index)"
        >
          <span class="variable-name">{{ variable.name }}</span>
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
    <edit-variable-modal
      v-for="(variable, index) in variables"
      :key="index"
      :visible.sync="editModalVisibility[index]"
      :variable="variable"
      @update="update"
    />
  </section>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";
  import AddVariableModal from "@/components/Editor/AddVariableModal";
  import EditVariableModal from "@/components/Editor/EditVariableModal";

  export default {
    name: "VariablesPanel",

    components: {
      MaterialIcon,
      IconButton,
      ModalDialog,
      AddVariableModal,
      EditVariableModal
    },

    data() {
      return {
        variables: [],
        editModalVisibility: [],
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
        this.editModalVisibility.push(false);
        this.$emit("add-variable", variable);
      },

      update({ name, value }) {
        const variable = this.get(name);

        // Permit duplicates
        if (!variable) {
          return;
        }

        variable.name = name;
        variable.value = value;

        this.editModalVisibility[this.variables.indexOf(variable)] = false;
        this.$emit("update-variable", variable);
      },

      remove(name) {
        const variable = this.get(name);

        if (!variable) {
          return;
        }

        const index = this.variables.indexOf(variable);

        this.$delete(this.editModalVisibility, index);
        this.variables.splice(index, 1);
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
      },

      showEditVariableModal(index) {
        this.$set(this.editModalVisibility, index, true);
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
    user-select: none;
  }

  .variables-list {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 1rem 0;
  }

  .variables-list .variable {
    display: flex;
    align-items: center;
    max-width: 50%;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    background: var(--color-interactive-highlight);
    box-shadow: var(--shadow-base);
    cursor: pointer;
    user-select: none;
  }

  .variables-list .variable .variable-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .variables-list .variable .remove-variable-button {
    margin-left: 0.5rem;
  }

  .variables-list .variable + .variable {
    margin-left: 0.5rem;
  }
</style>
