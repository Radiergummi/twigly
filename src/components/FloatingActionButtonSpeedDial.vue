<template>
  <div :class="'floating-action-button-speed-dial' + (open ? ' speed-dial-open' : '')">
    <button class="floating-action-button" @click="toggleSpeedDial">
      <span class="material-icons">{{ icon }}</span>
    </button>
    <div class="speed-dial-actions">
      <button
        class="speed-dial-action"
        v-for="(action, index) in actions"
        :key="index"
        @click="emitAction(action)"
        :data-label="action.label"
        :tabindex="open ? 0 : -1"
      >
        <span class="material-icons">{{ action.icon }}</span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FloatingActionButtonSpeedDial",

    props: {
      icon: {
        type: String,
        default: "add"
      },

      actions: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        open: false
      };
    },

    methods: {
      toggleSpeedDial() {
        this.open = !this.open;
      },

      emitAction(action) {
        this.$emit(`action-${action.name}`);
        this.open = false;
      }
    }
  };
</script>

<style scoped>
  .floating-action-button-speed-dial {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    user-select: none;
  }

  .speed-dial-actions {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    bottom: 4rem;
    right: 0;
    padding: 0 0.5rem;
    transition: all 0.125s;
    opacity: 0;
    transform: translateY(4rem) scale(0.8);
  }

  .speed-dial-action {
    position: relative;
    -webkit-appearance: none;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 1rem;
    background: var(--color-interactive);
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    pointer-events: none;
    transition: all 0.25s;
    outline: none;
  }

  .speed-dial-action + .speed-dial-action {
    margin-bottom: 1rem;
  }

  .speed-dial-action .material-icons {
    font-size: 1rem;
    line-height: 2rem;
  }

  .speed-dial-action:focus,
  .speed-dial-action:hover {
    box-shadow: 0 4px 15px -2px rgba(0, 0, 0, 0.25);
  }

  .speed-dial-action::after,
  .speed-dial-action::after {
    content: attr(data-label);
    position: absolute;
    top: 0;
    right: 3rem;
    margin: 0.35rem 0;
    padding: 0.25rem 0.5rem;
    border-radius: 2px;
    font-size: 0.8rem;
    white-space: nowrap;
    background: black;
    color: white;
    opacity: 0;
    transform: translateX(-0.25rem);
    transition: all 0.25s, opacity 0.45s;
    pointer-events: none;
  }

  .speed-dial-action:focus::after,
  .speed-dial-action:hover::after {
    opacity: 1;
    transform: translateX(0);
  }

  .floating-action-button-speed-dial.speed-dial-open .speed-dial-actions {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .floating-action-button-speed-dial.speed-dial-open .speed-dial-action {
    pointer-events: all;
  }

  .floating-action-button {
    position: absolute;
    right: 0;
    bottom: 0;
    text-align: center;
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 2rem;
    background: var(--color-primary);
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    transition: all 0.25s;
    z-index: 5;
  }

  .floating-action-button .material-icons {
    line-height: 3rem;
    transition: all 0.125s;
  }

  .floating-action-button:focus,
  .floating-action-button:hover {
    outline: none;
    box-shadow: 0 2px 5px -1px rgba(0, 0, 0, 0.25),
      0 6px 15px -1px rgba(0, 0, 0, 0.25);
  }

  .floating-action-button-speed-dial.speed-dial-open
    .floating-action-button
    .material-icons {
    transform: rotate(45deg);
  }
</style>
