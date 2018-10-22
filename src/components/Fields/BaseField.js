/**
 * Base field functionality for other fields to inherit from
 */
export default {
  props: {
    label: {
      type: String,
      required: false
    },

    name: {
      type: String,
      required: true
    },

    value: {
      type: null,
      required: false
    },

    type: {
      type: String,
      default: 'text',
    },

    autofocus: {
      type: Boolean,
      required: false
    },

    min: {
      type: Number,
      required: false
    },

    max: {
      type: Number,
      required: false
    },

    minlength: {
      type: Number,
      required: false
    },

    maxlength: {
      type: Number,
      required: false
    },

    required: {
      type: Boolean,
      default: false
    },

    valid: {
      type: Boolean,
      default: true
    },

    help: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      pristine: true
    }
  },

  computed: {
    fieldLabel() {
      if (!this.label) {
        return this.name.slice(0, 1).toUpperCase() + this.name.slice(1);
      }

      return this.label;
    },

    classes() {
      return {
        'field-input': true,
        'valid': this.valid,
        'invalid': !this.valid,
        'pristine': this.pristine
      }
    }
  },

  methods: {
    input(event) {
      this.pristine = false;
      this.$emit('input', event.target.value);
    },

    changeChecked(event) {
      this.pristine = false;
      this.$emit('change', event.target.checked);
    },

    submit(event) {
      this.$emit('submit', event.target.value);
    },

    focus() {
      if (this.$refs.hasOwnProperty('field')) {
        this.$nextTick(() => this.$refs.field.focus());
      }
    }
  }
};
