<template>
  <section class="panel variables-panel">
    <header class="panel-header variables-panel-header">
      <h3 class="panel-title">Variables</h3>
      <span class="variable-count">{{ variables.length }}</span>
    </header>
    <div class="panel-content">
      <ul class="variables-list">
        <li v-for="variable in variables" :key="variable.name" class="variable">
          <span class="variable-value">{{ displayValue(variable.value) }}</span>
          <icon-button icon="close" class="remove-variable-button" @click="removeVariable(variable.name)"/>
        </li>
      </ul>
    </div>
    <footer class="variables-panel-actions">
      <button class="button add-variable-button" @click="showAddVariableModal">
        <material-icon name="add"/>
        <span>Add</span>
      </button>
    </footer>
    <modal-dialog :visible.sync="addVariableModalVisible" title="Add variable">
      TODO
      <div slot="footer">
        <button class="button add-variable-button" @click="add(newVariable.name, newVariable.value)">
          Add
        </button>
      </div>
    </modal-dialog>
  </section>
</template>

<script>
  import IconButton from '@/components/Buttons/IconButton';
  import MaterialIcon from '@/components/MaterialIcon';
  import ModalDialog from '@/components/Modals/ModalDialog';

  export default {
    name: 'VariablesPanel',

    components: {
      IconButton
    },

    data() {
      return {
        variables: [],

        addVariableModalVisible: false,

        newVariable: {
          name: '',
          value: null
        }
      }
    },

    methods: {
      get(name) {
        return this.variables.find(variable => variable.name === name);
      },

      add(name, value) {

        // Permit duplicates
        if (this.get(name)) {
          return;
        }

        const variable = { name, value };

        this.variables.push(variable);
        this.$emit('add-variable', variable);
      },

      remove(name) {
        const variable = this.get(name);

        if (!variable) {
          return;
        }

        this.variables.splice(this.variables.indexOf(variable), 1);
        this.$emit('remove-variable', variable);
      },

      displayValue(value) {
        return value.toLocaleString();
      },

      showAddVariableModal() {
        this.addVariableModalVisible = true;
      }
    }
  };
</script>
