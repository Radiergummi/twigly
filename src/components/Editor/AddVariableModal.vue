<template>
  <modal-dialog
    :visible="visible"
    title="Add variable"
    :actions="[{ name: 'add', label: 'add', primary: true, disabled: !variable.name }]"
    @action-add="addVariable"
    @update:visible="close"
  >
    <label for="variable-name" class="field">
      <input
        type="text"
        id="variable-name"
        class="field-input"
        placeholder="Name"
        autofocus
        v-model="variable.name"
      >
      <span class="field-label">Name</span>
    </label>
    <label for="variable-type" class="field">
      <select id="variable-type" class="field-input" v-model="variable.type">
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
    <label for="variable-value" class="field" v-if="!variableTypeIsNull">
      <input
        v-if="!variableHasComplexType"
        v-model="variable.value"
        :type="variableInputType"
        :class="'field-input ' + (variable.valid !== false ? 'valid' : 'invalid')"
        id="variable-value"
        placeholder="Value"
        min="-99999999999999"
        max="99999999999999"
        step="0.001"
      >
      <textarea
        v-if="variableHasComplexType"
        v-model="variable.value"
        :class="'field-input variable-json-input ' + (variable.valid !== false ? 'valid' : 'invalid')"
        id="variable-value"
        placeholder=""
      ></textarea>
      <span class="field-label">Value</span>
    </label>
  </modal-dialog>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";

  export default {
    name: "AddVariableModal",

    components: {
      MaterialIcon,
      IconButton,
      ModalDialog
    },

    props: {
      visible: {
        type: Boolean,
        required: true
      }
    },

    data() {
      return {
        variable: {
          name: "",
          type: "string",
          value: null
        }
      };
    },

    watch: {
      "variable.value"() {
        if (this.variableHasComplexType && !this.variableTypeIsNull) {
          let isValid = true;

          try {
            JSON.parse(this.variable.value);
          } catch (error) {
            isValid = false;
          }

          this.variable.valid = isValid;
        }
      }
    },

    computed: {
      variableInputType() {
        switch (this.variable.type) {
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

      variableHasComplexType() {
        return this.variable.type === "json";
      },

      variableTypeIsNull() {
        return this.variable.type === "null";
      }
    },

    methods: {
      addVariable() {
        const value =
          this.variable.type === "json"
            ? JSON.parse(this.variable.value)
            : this.variable.value;

        this.$emit("add", {
          name: this.variable.name,
          value: this.variable.value
        });

        // Reset the new variable data
        this.variable = {
          name: "",
          type: "string",
          value: null
        };

        this.close();
      },

      close() {
        this.$emit("update:visible", false);
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";
  @import "../../styles/fields.css";

  .field-input.variable-json-input {
    font-family: "Courier New", Courier, monospace;
  }
</style>

