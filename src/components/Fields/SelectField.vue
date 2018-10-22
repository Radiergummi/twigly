<template>
  <label :for="`variable-${name}`" class="field">
    <select
      :id="`variable-${name}`"
      class="field-input"
      :value="value"
      @input="input"
      :autofocus="autofocus"
      ref="field"
    >
      <select-field-option v-for="(value, key) in options" :key="key" :name="key" :option="value"/>
    </select>
    <span class="field-label">{{ fieldLabel }}</span>
    <material-icon name="keyboard_arrow_down" class="field-input-icon field-input-icon-right"/>
  </label>
</template>

<script>
  import MaterialIcon from "@/components/MaterialIcon";
  import BaseField from "@/components/Fields/BaseField";
  import SelectFieldOption from "@/components/Fields/SelectFieldOption";

  export default {
    name: "SelectField",

    extends: BaseField,

    components: {
      MaterialIcon,
      SelectFieldOption
    },

    props: {
      options: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style>
  @import "../../styles/fields.css";
</style>
