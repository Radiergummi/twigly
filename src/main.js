// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueInputAutowidth from 'vue-input-autowidth'
import FsPlugin from './plugins/Fs';
import LocalStorageFileSystem from './modules/LocalStorageFileSystem';

Vue.config.productionTip = false

Vue.use(VueInputAutowidth)

Vue.use(FsPlugin, {
  fileSystem: new LocalStorageFileSystem('twigly-test-1')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
