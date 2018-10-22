<template>
  <label :for="`variable-${name}`" class="field">
    <input
      class="field-input"
      type="checkbox"
      :id="`variable-${name}`"
      :value="value"
      :checked="checked"
      @change="changeChecked"
      :autofocus="autofocus"
      ref="field"
    >
    <span class="field-label">{{ fieldLabel }}</span>
  </label>
</template>

<script>
  import BaseField from "@/components/Fields/BaseField";

  export default {
    name: "CheckboxField",

    extends: BaseField,

    model: {
      prop: "checked",
      event: "change"
    },

    props: {
      checked: {
        type: Boolean,
        default: false
      },

      value: {
        type: null,
        required: false
      }
    }
  };
</script>

<style>
</style>
