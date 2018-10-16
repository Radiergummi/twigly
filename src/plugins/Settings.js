export default function (Vue, options = { path: '/settings.json' }) {
  let cache = null;

  const fileSystem = options.fileSystem;

  Vue.prototype.$settings = {
    settingsFilePath: options.path,

    async readRaw() {
      let settingsJson;

      try {
        settingsJson = await fileSystem.readFile(this.settingsFilePath);
      } catch (error) {
        throw new Error(`No settings file available at ${this.settingsFilePath}: ${error.message}`);
      }

      return settingsJson;
    },

    async read() {
      if (cache) {
        return cache;
      }

      const settingsJson = await this.readRaw();

      // Create an additional copy for the cache
      cache = JSON.parse(settingsJson);

      return JSON.parse(settingsJson);
    },

    async value(key, fallback = null) {
      const settings = await this.read();

      return (settings.hasOwnProperty(key))
        ? settings[key]
        : fallback;
    },

    async write(settings) {
      if (typeof settings !== 'string') {
        settings = JSON.stringify(settings);
      }

      await fileSystem.writeFile(this.settingsFilePath, settings);

      cache = null;
    }
  }
}
