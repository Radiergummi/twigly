<template>
  <modal-dialog
    :visible="visible"
    title="Add variable"
    :actions="[{ name: 'save', label: 'Save', primary: true, disabled: !variable.name }]"
    @action-save="updateVariable"
    @update:visible="close"
  >
    <text-field
      name="name"
      label="Name"
      v-model="variable.name"
      @submit="updateVariable"
      ref="nameInput"
    />
    <select-field name="type" label="Type" v-model="variable.type" :options="typeOptions"/>
    <component
      :is="fieldType"
      name="value"
      label="Value"
      v-if="!variableTypeIsNull"
      v-model="variable.value"
      :valid="variable.valid"
      @submit="updateVariable"
    />
  </modal-dialog>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";
  import InputField from "@/components/Fields/InputField";
  import TextField from "@/components/Fields/TextField";
  import NumberField from "@/components/Fields/NumberField";
  import CheckboxField from "@/components/Fields/CheckboxField";
  import TextareaField from "@/components/Fields/TextareaField";
  import SelectField from "@/components/Fields/SelectField";

  export default {
    name: "EditVariableModal",

    components: {
      MaterialIcon,
      IconButton,
      ModalDialog,
      TextField,
      NumberField,
      CheckboxField,
      TextareaField,
      SelectField
    },

    props: {
      visible: {
        type: Boolean,
        required: true
      },

      variable: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        typeOptions: {
          "Scalar Types": {
            string: "String",
            number: "Number",
            boolean: "Boolean"
          },
          "Complex Types": {
            json: "Manual (JSON input)",
            null: "null"
          }
        }
      };
    },

    watch: {
      visible() {
        if (this.visible) {
          this.$refs.nameInput.focus();
        }
      },

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
      fieldType() {
        switch (this.variable.type) {
          case "string":
            return "TextField";

          case "number":
            return "NumberField";

          case "boolean":
            return "CheckboxField";

          case "json":
            return "TextareaField";

          default:
            return "TextField";
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
      updateVariable() {
        const value =
          this.variable.type === "json"
            ? JSON.parse(this.variable.value)
            : this.variable.value;

        this.$emit("update", {
          name: this.variable.name,
          value: this.variable.value
        });

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

