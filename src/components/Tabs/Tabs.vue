<template>
  <article class="tabs">
    <nav class="tab-list">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        :class="'tab' + (tab.active ? ' active' : '')"
        :tabindex="tab.active ? '-1' : '0'"
        role="tab"
        @click="event => selectTab(tab.hash, event)"
      >
        <span class="tab-name">{{ tab.name }}</span>
        <icon-button
          v-if="closeButtons"
          icon="close"
          size="extra-small"
          class="close-tab-button"
          @click.native.stop="closeTab(tab)"
        />
      </div>
      <div v-if="$slots.actions" class="actions">
        <slot name="actions"/>
      </div>
    </nav>
    <div class="tabs-content">
      <slot/>
    </div>
  </article>
</template>

<script>
  import IconButton from "@/components/Buttons/IconButton";

  /**
   * Tab navigation
   * ==============
   *
   * This component, in conjunction with the Tab compoent, provides a simple tab navigation. The tabs are identified
   * internally through a so-called "hash" - that's essentially just a slug string. Using this (unique in the tabs
   * context) slug, the tabs are switched. This includes updating the current route: On switching tabs, the new slug
   * is replaced in the current route path. That way, users can jump directly to the desired path or bookmark it.
   * The component also provides the ability to preselect a tab, in order to show a certain tab after load, without
   * the user having to click one by himself.
   *
   * <tabs selected="preselected-tab-slug">
   * <tab name="Tab display name" slug="preselected-tab-slug">
   * foo
   * </tab>
   * <tab name="Tab display name 2" slug="another-tab-slug">
   * bar
   * </tab>
   * </tabs>
   */
  export default {
    name: "tabs",

    components: {
      IconButton
    },

    props: {
      /**
       * Holds an eventual preselected tab hash
       *
       * @type {String}
       */
      selected: {
        type: String,
        required: false
      },

      closeButtons: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        /**
         * Holds all tabs
         *
         * @type {Array}
         */
        tabs: [],

        /**
         * Holds the currently active tab hash
         *
         * @type {String}
         */
        activeTabHash: ""
      };
    },

    /**
     * After the component is mounted, we gather all children tabs
     */
    mounted() {
      this.loadTabs();

      // if we have any tabs, try to find the selected tab
      if (this.tabs.length) {
        this.selectTab(this.selected || this.tabs[0].hash);
      }
    },

    methods: {
      loadTabs() {
        // find all children components that are instances of tabs
        this.tabs = this.$slots.default
          .map(node => node.componentInstance)
          .filter(child => child && child.$options.name === "tab");
      },

      /**
       * Retrieves a tab by it's hash
       *
       * @param {String} hash tab slug to find
       * @returns {Object|undefined} tab component, if found
       */
      findTab(hash) {
        return this.tabs.find(tab => tab.hash === hash);
      },

      /**
       * Marks a tab as active
       *
       * @param {String} selectedTabHash tab slug that has been selected
       * @param {Event} [event] optional event handler parameter
       * @returns {void}
       */
      selectTab(selectedTabHash, event) {
        // if this has been initiated from an event handler, prevent the default from happening now
        if (event) {
          event.preventDefault();
        }

        // try to find the given tab
        const selectedTab = this.findTab(selectedTabHash);

        // if the tab doesn't exist, stop now
        if (!selectedTab) {
          return;
        }

        this.tabs.forEach(tab => {
          tab.active = tab.hash === selectedTab.hash;
        });

        // emit the changed event, holding the new tab
        this.$emit("changed", selectedTab);

        // set the currently active tab to the new tab's hash
        this.activeTabHash = selectedTab.hash;

        // update the current route without creating a new history entry. Otherwise, that'd result in a lot of
        // useless history entries if you switch between different views of the same page --> pointless.
        this.$router.replace({
          // keep the current route name
          name: this.$router.currentRoute.name,

          // update the current route parameters
          params: Object.assign({}, this.$router.currentRoute.params, {
            file: selectedTab.slug || undefined
          }),
          query: this.$route.query
        });
      },

      closeTab(tab) {
        this.$emit("close", tab);
        this.$nextTick(() => this.loadTabs());
      }
    }
  };
</script>

<style scoped>
  @import "../../styles/buttons.css";

  .tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .tabs .tab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0.5rem;
    padding: 0.75rem 0.25rem 0.5rem;
    border: 0;
    border-bottom: 0.125rem solid transparent;
    color: var(--color-gray-medium-darker);
    white-space: nowrap;
    font-size: 0.9rem;
    outline: none;
    user-select: none;
    transition: all 0.125s;
  }

  .tabs .tab.active {
    border-bottom-color: var(--color-primary);
    color: var(--color-primary);
    box-shadow: 0 2px 0 -1px var(--color-primary),
      1px 2px 0 -1px var(--color-primary), -1px 2px 0 -1px var(--color-primary);
    pointer-events: none;
  }

  .tabs .tab:focus {
    color: var(--color-primary);
  }

  .tabs .tab:not(.active):hover {
    border-bottom-color: var(--color-inactive);
    color: var(--color-inactive);
    box-shadow: 0 2px 0 -1px var(--color-inactive),
      1px 2px 0 -1px var(--color-inactive), -1px 2px 0 -1px var(--color-inactive);
  }

  .tabs .tab .close-tab-button {
    margin-left: 0.25rem;
    pointer-events: all;
  }

  .tabs-content {
    flex: 0 1 100%;
    overflow: hidden;
  }

  .tab-list {
    flex: 1 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid var(--color-gray-light);
    background-color: var(--color-white);
    box-shadow: inset 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
  }

  .tab-list .actions {
    display: flex;
    align-items: center;
    margin: 0 0.5rem 0 auto;
  }

  .tab-list .actions .action + .action {
    margin-left: 0.5rem;
  }
</style>
