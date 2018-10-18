<template>
  <modal-dialog :visible.sync="visible" @update:visible="close" title="Open file">fsoid</modal-dialog>
</template>

<script>
  import ModalDialog from "@/components/Modals/ModalDialog";

  export default {
    name: "OpenFileModal",

    components: {
      ModalDialog
    },

    props: {
      visible: {
        type: Boolean,
        required: true
      }
    },

    methods: {
      close() {
        this.$emit("update:visible", false);
      }
    }
  };
</script>

<style>
</style>
