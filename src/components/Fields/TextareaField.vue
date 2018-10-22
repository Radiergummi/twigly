<template>
  <label :for="`variable-${name}`" class="field">
    <textarea
      :class="classes"
      :type="type"
      :id="`variable-${name}`"
      :placeholder="label"
      :value="value"
      @input="input"
      @keyup.enter="submit"
      :autofocus="autofocus"
      ref="field"
    ></textarea>
    <span class="field-label">{{ fieldLabel }}</span>
  </label>
</template>

<script>
  import BaseField from "@/components/Fields/BaseField";

  export default {
    name: "TextareaField",

    extends: BaseField
  };
</script>

<style>
  @import "../../styles/fields.css";
</style>
