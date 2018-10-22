<template>
  <label :for="`variable-${name}`" class="field">
    <input
      :class="classes"
      type="text"
      :id="`variable-${name}`"
      :placeholder="label"
      :value="value"
      @input="input"
      @keyup.enter="submit"
      ref="field"
      :autofocus="autofocus"
      :minlength="minlength"
      :maxlength="maxlength"
      :required="required"
    >
    <span class="field-label">{{ fieldLabel }}</span>
    <div class="field-extra">
      <span v-if="help && !validationError" class="field-help">{{ help }}</span>
      <span v-if="validationError" class="field-error">{{ validationError }}</span>
      <span v-if="minlength || maxlength" class="field-length-indicator">{{ lengthIndicator }}</span>
    </div>
  </label>
</template>
 
<script>
  import BaseField from "@/components/Fields/BaseField";

  export default {
    name: "TextField",

    extends: BaseField,

    computed: {
      validationError() {
        if (this.required && !this.value) {
          return `${this.name} is a required field`;
        }

        if (this.minlength && this.value.length < this.minlength) {
          return `${this.name} must be at least ${this.minlength} characters`;
        }
      },

      lengthIndicator() {
        if (typeof this.value !== "string") {
          return "";
        }

        if (this.minlength && this.value.length < this.minlength) {
          return this.minlength - this.value.length + " to go...";
        }

        if (this.maxlength && this.value.length <= this.maxlength) {
          return `${this.value.length}/${this.maxlength}`;
        }
      }
    }
  };
</script>

<style>
  @import "../../styles/fields.css";
</style>
