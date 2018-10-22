<template>
  <component :is="type" :value="name" :label="label">
    <select-field-option
      v-if="type === 'optgroup'"
      v-for="(subOptionValue, subOptionName) in option"
      :key="subOptionName"
      :name="subOptionName"
      :option="subOptionValue"
    />
    <template v-else>{{ option }}</template>
  </component>
</template>

<script>
  export default {
    name: "SelectFieldOption",

    props: {
      option: {
        type: [Object, String],
        required: true
      },

      name: {
        type: String,
        required: true
      }
    },

    computed: {
      type() {
        return typeof this.option === "string" ? "option" : "optgroup";
      },

      label() {
        return this.type === "option" ? this.option : this.name;
      }
    }
  };
</script>

<style>
</style>
