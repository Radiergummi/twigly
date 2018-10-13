<template>
  <transition name="slide">
    <div v-show="visible" class="snack-bar">{{ message }}</div>
  </transition>
</template>

<script>
  export default {
    name: "SnackBar",

    props: {
      message: {
        type: String,
        required: true
      },

      visible: {
        type: Boolean,
        default: false
      },

      duration: {
        type: Number,
        default: 3000
      }
    },

    data() {
      return {
        timeout: null
      };
    },

    watch: {
      visible() {
        console.log("visible changed to " + this.visible + ", scheduling");
        this.scheduleHiding(this.duration);
      },

      duration() {
        console.log("duration changed to " + this.duration + ", scheduling");
        this.scheduleHiding(this.duration);
      }
    },

    methods: {
      scheduleHiding(duration = 3000) {
        if (this.visible && duration > 0) {
          console.log("scheduling snackbar hide in" + duration);
          this.timeout = setTimeout(() => {
            this.$emit("update:visible", false);
          }, duration);
        }
      }
    }
  };
</script>

<style scoped>
  .snack-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem;
    min-width: 25vw;
    border-radius: 4px 4px 0 0;
    background: #333;
    color: #fafafa;
    text-shadow: 1px 1px #000;
    box-shadow: inset 0 -1rem 4rem -1rem #000;
    font-size: 1rem;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: margin-bottom 0.25s ease-out, color 0.45s ease-out;
  }

  .slide-enter,
  .slide-leave-to {
    margin-bottom: -3rem;
    color: #333;
  }

  .slide-enter-to,
  .slide-leave {
    margin-bottom: 0px;
    color: #fafafa;
  }
</style>

