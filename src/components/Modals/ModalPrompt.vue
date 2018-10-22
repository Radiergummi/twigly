<template>
  <modal-dialog
    :visible="visible"
    @update:visible="close"
    :actions="actions"
    @action-confirm="confirm"
  >
    <input-field name="prompt-input" :label="label" v-model="value" @submit="confirm" ref="input"/>
  </modal-dialog>
</template>

<script>
  import ModalDialog from "@/components/Modals/ModalDialog";
  import InputField from "@/components/Fields/InputField";

  export default {
    name: "ModalPrompt",

    components: {
      ModalDialog,
      InputField
    },

    props: {
      visible: {
        type: Boolean,
        required: true
      },

      label: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        value: "",

        actions: [{ name: "confirm", label: "Confirm", primary: true }]
      };
    },

    watch: {
      visible() {
        if (this.visible) {
          this.$refs.input.focus();
        }
      }
    },

    methods: {
      close() {
        this.$emit("update:visible", false);
      },

      confirm() {
        this.$emit("confirm", this.value);
        this.close();
      }
    }
  };
</script>

<style>
</style>
