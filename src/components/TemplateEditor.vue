<template>
  <article class="template-editor">
    <header>
      <h2 class="editor-heading">Twig Template editor</h2>
    </header>
    <section class="variable-editor">
      <header>
        <h3 class="variables-heading">
          Variables
          <span class="variable-count">{{ Object.keys(this.variables).length }}</span>
        </h3>
      </header>
      <div class="variables-container">
        <div class="variable-field" v-for="(value, name) in variables" :key="name">
          <span class="variable-name">{{ name }}</span>
          <span class="variable-value">{{ displayValue(value) }}</span>
          <button class="remove-variable-button" @click="removeVariable(name)">⨉</button>
        </div>
        <div class="new-variable-field">
          <input
            type="text"
            class="new-variable-name"
            placeholder="Name"
            v-model="newVariable.name"
            v-autowidth="{maxWidth: '300px', minWidth: '48px', comfortZone: 16}"
          >
          <input
            type="text"
            class="new-variable-value"
            placeholder="Value"
            v-model="newVariable.value"
            v-autowidth="{maxWidth: '500px', minWidth: '48px', comfortZone: 16}"
          >
          <button class="button add-variable-button" @click="addVariable">Add</button>
        </div>
      </div>
    </section>
    <section class="template-editor-body">
      <div class="template-editor-area template-editor-input-area">
        <textarea
          class="template-input"
          v-model="template"
          placeholder="Start writing your template!"
        ></textarea>
      </div>
      <div
        :class="['template-editor-area','template-editor-output-area', {error}, {rendering}]"
        v-html="output"
      ></div>
    </section>
    <snack-bar :message="snackbarMessage" :visible.sync="snackbarShown" :duration="error ? 0 : null"/>
  </article>
</template>

<script>
  import SnackBar from "./SnackBar";
  import { TwingEnvironment, TwingLoaderArray } from "twing";

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  export default {
    name: "template-editor",

    components: {
      SnackBar
    },

    data() {
      return {
        /**
         * Whether the app is currently rendering a template
         */
        rendering: false,

        /**
         * Whether there occurred an error during rendering
         */
        error: false,

        /**
         * Holds the user-written template
         */
        template: "",

        /**
         * Holds the user-defined variables
         */
        variables: {},

        /**
         * Holds the rendered output
         */
        output: "",

        /**
         * Holds the new variable name and value
         */
        newVariable: {
          name: "",
          value: ""
        },

        /**
         * Toggles the message snackbar
         */
        snackbarShown: false,

        /**
         * Message for the snackbar to show
         */
        snackbarMessage: ""
      };
    },

    watch: {
      /**
       * Triggers a new render on template changes
       */
      template() {
        this.render();
      }
    },

    methods: {
      /**
       * Renders the current template. This method is debounced to prevent flooding the parser
       */
      render: debounce(function() {
        // If the template string is empty, we don't need to render and flush the output
        if (!this.template) {
          this.output = "";
          return;
        }

        this.rendering = true;

        const loader = new TwingLoaderArray({
          main: this.template
        });
        const twing = new TwingEnvironment(loader);

        try {
          this.output = twing.render("main", this.variables);
          this.error = false;
        } catch (error) {
          this.error = true;
          this.showNotification(`Template error: ${error.message}`);
        }

        this.rendering = false;
      }, 200),

      /**
       * Adds a new variable to the list
       */
      addVariable() {
        // We'll need a name
        if (this.newVariable.name.length === 0) {
          return this.showNotification("Variable name is required");
        }

        // No duplicates
        if (this.newVariable.name in this.variables) {
          return this.showNotification(
            `Variable ${this.newVariable.name} has already been set`
          );
        }

        let value = this.parseVariable(this.newVariable.value);

        this.variables[this.newVariable.name] = value;

        this.newVariable.name = "";
        this.newVariable.value = "";

        // Trigger a new render, since Vue won't notice the deep object change (sigh)
        this.render();
      },

      /**
       * Removes a variable from the list
       */
      removeVariable(name) {
        if (name in this.variables) {
          // Use the Vue delete handler, since it won't notice the deep object change
          this.$delete(this.variables, name);
          this.render();
        }
      },

      /**
       * Parses a user-provided variable
       */
      parseVariable(data) {
        // Seems to be something nullable
        if (data === "" || data === null || typeof data === "undefined") {
          return null;
        }

        if (data === "true") {
          return true;
        }

        if (data === "false") {
          return false;
        }

        // This is a number
        if (!isNaN(data)) {
          // ...a floating number, as it seems
          if (data.includes(".")) {
            return parseFloat(data);
          }

          // Nope, just an integer
          return parseInt(data);
        }

        // Seems to be an ordinary string
        return data;
      },

      /**
       * Creates a display representation of a value
       */
      displayValue(value) {
        if (value === null) {
          return "<NULL>";
        }

        return value.toLocaleString();
      },

      /**
       * Toggles the snackbar with the provided message
       */
      showNotification(message = "") {
        this.snackbarMessage = message;
        this.snackbarShown = true;
      }
    }
  };
</script>

<style scoped>
  .variables-heading {
    margin: 0 0 1rem;
  }

  .variable-count {
    margin-left: 0.5rem;
    padding: 0.125rem 0.5rem;
    background: #eee;
    border-radius: 4px;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
  }

  .template-editor {
    max-width: 80vw;
    margin: 0 auto;
    border: 2px solid #eee;
    border-radius: 5px;
  }

  .variable-editor {
    text-align: left;
    padding: 1rem;
    border-top: 2px solid #eee;
  }

  .variables-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .variable-field {
    display: inline-flex;
    align-items: center;
    margin: 0.25rem 0.25rem 0.25rem 0;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    border-radius: 3rem;
    background: #eee;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
  }

  .variable-name {
    margin-right: 0.5rem;
    font-weight: bold;
  }

  .variable-value {
    color: #666;
    max-width: 15vw;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .remove-variable-button {
    position: relative;
    -webkit-appearance: none;
    border: none;
    display: block;
    width: 1.2rem;
    height: 1.2rem;
    padding: 0;
    border-radius: 50%;
    margin-left: 1rem;
    background: transparent;
    transition: all 0.125s;
    text-align: center;
    line-height: 1;
    color: transparent;
  }

  .remove-variable-button::before,
  .remove-variable-button::after {
    position: absolute;
    content: "";
    display: block;
    top: 25%;
    left: 50%;
    width: 1px;
    height: 50%;
    background: #555;
  }

  .remove-variable-button::before {
    transform: rotate(45deg);
  }

  .remove-variable-button::after {
    transform: rotate(-45deg);
  }

  .remove-variable-button:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 1px -1px rgba(0, 0, 0, 0.25);
  }

  .new-variable-field {
    display: inline-flex;
    align-items: center;
    margin: 0.25rem 0.25rem 0.25rem 0;
    padding: 0.25rem 0.35rem 0.25rem 1rem;
    border-radius: 3rem;
    background: #eee;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
  }

  .new-variable-name,
  .new-variable-value {
    -webkit-appearance: none;
    border: none;
    background: transparent;
    outline: none;
  }

  .new-variable-name::-webkit-input-placeholder,
  .new-variable-value::-webkit-input-placeholder {
    text-shadow: 1px 1px rgba(255, 255, 255, 0.5);
  }

  .new-variable-name {
    font-weight: bold;
    color: #2c3e50;
    text-shadow: 1px 1px rgba(255, 255, 255, 0.5);
  }

  .new-variable-value {
    color: #666;
  }

  .add-variable-button {
    -webkit-appearance: none;
    border-radius: 2rem;
    border: none;
    padding: 0.35rem 1rem;
    color: #fff;
    background: #41b883;
    outline: none;
    box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
    text-shadow: -1px -1px rgba(0, 0, 0, 0.15);
    transition: all 0.125s;
  }

  .add-variable-button:hover,
  .add-variable-button:focus {
    background: #2d8b61;
    cursor: pointer;
  }

  .variable-name,
  .variable-value,
  .new-variable-name,
  .new-variable-value {
    font-size: 14px;
  }

  .template-editor-body {
    position: relative;
    display: flex;
    align-items: stretch;
    border-top: 2px solid #eee;
  }

  .template-editor-area {
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 0 0 50%;
  }

  .template-editor-input-area {
    background: #f9f9f9;
    border-right: 2px solid #eee;
    border-bottom-left-radius: 5px;
  }

  .template-editor-output-area {
    position: relative;
    padding: 1rem;
    max-width: calc(50% - 2rem);
    min-height: 4rem;
  }

  .template-editor-output-area.rendering::before,
  .template-editor-output-area.error::before {
    display: block;
    content: "";
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    z-index: 2;
  }

  .template-editor-output-area.rendering::before {
    background: rgb(99, 121, 218);
    animation: pulse;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }

  .template-editor-output-area.error::before {
    background: rgb(218, 99, 99);
  }

  .template-editor-output-area:empty::after {
    content: "The rendered output will appear in here";
    margin-top: 1.5rem;
    color: #ccc;
    text-align: center;
    font-size: 14px;
    font-weight: thin;
  }

  .template-input {
    display: block;
    margin: 0;
    padding: 0.5rem;
    border: none;
    -webkit-appearance: none;
    background: transparent;
    resize: vertical;
    width: auto;
    min-height: calc(100% - 1rem);
    border-bottom-left-radius: 4px;
    transition: all 0.125s;
  }

  .template-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6ad8a6;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(0.75);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
