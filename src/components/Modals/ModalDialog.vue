<template>
  <div :class="'modal-container' + (visible ? ' visible' : '')">
    <transition name="fade">
      <div class="modal-backdrop" @click="close" v-show="visible"></div>
    </transition>
    <transition name="fade-scale">
      <article class="modal-dialog" v-show="visible">
        <header class="modal-dialog-header" v-if="title">
          <h2 class="modal-dialog-title">{{ title }}</h2>
          <div class="modal-dialog-header-actions">
            <slot name="header"/>
          </div>
          <icon-button icon="close" class="modal-dialog-close-button" @click="close"/>
        </header>
        <div class="modal-dialog-body">
          <slot/>
        </div>
        <footer class="modal-dialog-footer" v-if="actions">
          <button class="button modal-dialog-footer-action-button" @click="close">Cancel</button>
          <button
            :class="{ 'button': true, 'modal-dialog-footer-action-button': true, 'button-danger': action.danger, 'button-primary': action.primary }"
            v-for="action in actions"
            :key="action.name"
            :disabled="action.disabled"
            @click="callAction(action)"
          >{{ action.label }}</button>
        </footer>
      </article>
    </transition>
  </div>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";

  export default {
    name: "ModalDialog",

    components: {
      IconButton
    },

    props: {
      title: {
        type: String,
        required: false
      },

      visible: {
        type: Boolean,
        required: true
      },

      actions: {
        type: Array,
        required: false
      }
    },

    methods: {
      close() {
        this.$emit("update:visible", false);
      },

      callAction(action) {
        this.$emit(`action-${action.name}`);
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .modal-container.visible {
    overflow-y: auto;
    z-index: 1;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-dialog {
    position: relative;
    margin: 10vh 0;
    min-width: 25vw;
    border-radius: 3px;
    background: var(--color-chrome);
    box-shadow: 0 1px 5px -1px rgba(0, 0, 0, 0.5),
      0 2px 15px -2px rgba(0, 0, 0, 0.25);
  }

  .modal-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .modal-dialog-title {
    margin: 0 1rem 0 0;
    user-select: none;
  }

  .modal-dialog-close-button {
    -webkit-appearance: none;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
  }

  .modal-dialog-body {
    padding: 1rem;
  }

  .modal-dialog-footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    padding: 1rem;
  }

  .modal-dialog-footer-action-button {
    color: var(--color-interactive-label);
  }

  .modal-dialog-footer-action-button.button-danger {
    color: var(--color-red);
  }

  @media screen and (max-width: 400px) {
    .modal-dialog {
      width: 100vw;
      height: 100vh;
      border-radius: 0;
    }

    .modal-dialog-header {
      padding: 0.5rem 0.5rem 0.5rem 1rem;
    }
  }
</style>
