<template>
  <label :for="`variable-${name}`" class="field">
    <input
      class="field-input"
      type="number"
      :id="`variable-${name}`"
      :placeholder="label"
      :value="value"
      @input="input"
      @keyup.enter="submit"
      :autofocus="autofocus"
      ref="field"
    >
    <span class="field-label">{{ fieldLabel }}</span>
  </label>
</template>

<script>
  import BaseField from "@/components/Fields/BaseField";

  export default {
    name: "NumberField",

    extends: BaseField
  };
</script>

<style>
  @import "../../styles/fields.css";
</style>
