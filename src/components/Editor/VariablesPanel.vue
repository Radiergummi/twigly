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
    <modal-dialog
      :visible.sync="addVariableModalVisible"
      title="Add variable"
      :actions="[{ name: 'add', label: 'add', primary: true, disabled: !newVariable.name }]"
      @action-add="addNewVariable()"
    >
      <label for="new-variable-name" class="field">
        <input
          type="text"
          id="new-variable-name"
          class="field-input"
          placeholder="Name"
          autofocus
          v-model="newVariable.name"
        >
        <span class="field-label">Name</span>
      </label>
      <label for="new-variable-type" class="field">
        <select id="new-variable-type" class="field-input" v-model="newVariable.type">
          <optgroup label="Scalar types">
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </optgroup>
          <optgroup label="Complex types">
            <option value="json">Manual (JSON input)</option>
            <option value="null">null</option>
          </optgroup>
        </select>
        <span class="field-label">Type</span>
        <material-icon name="keyboard_arrow_down" class="field-input-icon field-input-icon-right"/>
      </label>
      <label for="new-variable-value" class="field" v-if="!newVariableTypeIsNull">
        <input
          v-if="!newVariableHasComplexType"
          v-model="newVariable.value"
          :type="newVariableInputType"
          :class="'field-input ' + (newVariable.valid !== false ? 'valid' : 'invalid')"
          id="new-variable-value"
          placeholder="Value"
          min="-99999999999999"
          max="99999999999999"
          step="0.001"
        >
        <textarea
          v-if="newVariableHasComplexType"
          v-model="newVariable.value"
          :class="'field-input variable-json-input ' + (newVariable.valid !== false ? 'valid' : 'invalid')"
          id="new-variable-value"
          placeholder=""
        ></textarea>
        <span class="field-label">Value</span>
      </label>
    </modal-dialog>
  </section>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";

  export default {
    name: "VariablesPanel",

    components: {
      MaterialIcon,
      IconButton,
      ModalDialog
    },

    data() {
      return {
        variables: [],

        addVariableModalVisible: false,

        newVariable: {
          name: "",
          type: "string",
          value: null
        }
      };
    },

    watch: {
      "newVariable.value"() {
        if (this.newVariableHasComplexType && !this.newVariableTypeIsNull) {
          let isValid = true;

          try {
            JSON.parse(this.newVariable.value);
          } catch (error) {
            isValid = false;
          }

          this.newVariable.valid = isValid;
        }
      }
    },

    computed: {
      newVariableInputType() {
        switch (this.newVariable.type) {
          case "string":
            return "text";

          case "number":
            return "number";

          case "boolean":
            return "checkbox";

          default:
            return "text";
        }
      },

      newVariableHasComplexType() {
        return this.newVariable.type === "json";
      },

      newVariableTypeIsNull() {
        return this.newVariable.type === "null";
      }
    },

    methods: {
      get(name) {
        return this.variables.find(variable => variable.name === name);
      },

      add(name, value) {
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

      addNewVariable() {
        const value =
          this.newVariable.type === "json"
            ? JSON.parse(this.newVariable.value)
            : this.newVariable.value;

        this.add(this.newVariable.name, this.newVariable.value);

        this.newVariable = {};
        this.hideAddVariableModal();
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
  @import "../../styles/fields.css";

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

  .field-input.variable-json-input {
    font-family: "Courier New", Courier, monospace;
  }
</style>
