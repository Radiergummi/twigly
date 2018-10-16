<template>
  <div class="modal-container">
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
          <button class="base-button modal-dialog-close-button" @click="close">
            <span class="material-icons">close</span>
          </button>
        </header>
        <div class="modal-dialog-body">
          <slot/>
        </div>
        <footer class="modal-dialog-footer" v-if="actions">
          <button class="button modal-dialog-footer-action-button" @click="close">Cancel</button>
          <button
            :class="'button modal-dialog-footer-action-button ' + (action.danger ? 'button-danger' : '')"
            v-for="action in actions"
            :key="action.name"
            @click="callAction(action)"
          >{{ action.label }}</button>
        </footer>
      </article>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "ModalDialog",

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
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }

  .modal-dialog {
    position: relative;
    min-width: 25vw;
    border-radius: 3px;
    z-index: 12;
    background: var(--color-chrome);
    box-shadow: 0 1px 5px -1px rgba(0, 0, 0, 0.5),
      0 2px 15px -2px rgba(0, 0, 0, 0.25);
    pointer-events: all;
  }

  .modal-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .modal-dialog-title {
    margin: 0 1rem 0 0;
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
    padding: 1rem;
  }

  .modal-dialog-footer-action-button {
    color: var(--color-interactive-label);
  }

  .modal-dialog-footer-action-button.button-danger {
    color: var(--color-red);
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: transform 0.125s, opacity 0.25s;
  }

  .fade-scale-enter,
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
</style>
