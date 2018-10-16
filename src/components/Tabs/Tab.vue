<template>
  <section v-if="active" class="tab-content" role="tabpanel">
    <slot/>
  </section>
</template>

<script>
  /**
   * Tabs navigation tab
   * ===================
   *
   * Resembles a single tab. Tabs need to be contained within the Tabs component to be actually useful. On their
   * own, they are nothing more than sections with an "active" parameter that controls whether they are shown or
   * not, relying on the parent (tabs) component to control that paramter. Tabs can carry a name (that is shown
   * on the tab navigation) and a slug (that is used for route navigation purposes). The latter is optional and
   * will be generated from the tab name, if missing.
   *
   * @see Tabs.vue
   *
   * <tab name="My tab name" slug="foo">
   * Tab content
   * </tab>
   */
  export default {
    name: "tab",

    props: {
      /**
       * Holds the user-visible display name of the tab
       *
       * @type {String}
       */
      name: {
        type: String,
        required: true
      },

      /**
       * Holds the unique name used as the URL slug to the tab. If none is given, it is extrapolated from the
       * tab name by lowercasing it and replacing any white-space with dashes.
       *
       * @type {String}
       */
      slug: {
        type: String,
        required: false
      }
    },

    data() {
      return {
        /**
         * Whether the tab is currently active
         *
         * @type {Boolean}
         */
        active: false
      };
    },

    computed: {
      /**
       * The URL-usable version of the slug or the name if no slug given
       *
       * @return {String}
       */
      hash() {
        return this.slug
          ? this.slug
          : this.name.toLowerCase().replace(/\s/g, "-");
      }
    }
  };
</script>

<style scoped>
  .tab-content {
    height: 100%;
  }
</style>
