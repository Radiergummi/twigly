export default function (Vue, options) {
  Vue.prototype.$fs = options.fileSystem;
}
