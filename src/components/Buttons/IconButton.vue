<template>
  <button :class="'button icon-button ' + size">
    <material-icon :name="icon"/>
  </button>
</template>

<script>
  import MaterialIcon from "@/components/MaterialIcon";

  export default {
    name: "IconButton",

    components: {
      MaterialIcon
    },

    props: {
      icon: {
        type: String,
        required: true
      },

      size: {
        type: String,
        required: false
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";
</style>
