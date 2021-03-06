<template>
  <modal-dialog
    :visible="visible"
    title="Add variable"
    :actions="[{ name: 'add', label: 'add', primary: true, disabled: !variable.name }]"
    @action-add="addVariable"
    @update:visible="close"
  >
    <text-field
      name="name"
      label="Name"
      v-model="variable.name"
      @submit="addVariable"
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
      @submit="addVariable"
    />
  </modal-dialog>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";
  import MaterialIcon from "@/components/MaterialIcon";
  import ModalDialog from "@/components/Modals/ModalDialog";
  import TextField from "@/components/Fields/TextField";
  import NumberField from "@/components/Fields/NumberField";
  import CheckboxField from "@/components/Fields/CheckboxField";
  import TextareaField from "@/components/Fields/TextareaField";
  import SelectField from "@/components/Fields/SelectField";

  export default {
    name: "AddVariableModal",

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
      }
    },

    data() {
      return {
        variable: {
          name: "",
          type: "string",
          value: null
        },

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

