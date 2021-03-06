import FileSystem from '@/modules/FileSystem';
import Path from '@/modules/Path';

class LocalStorageFileSystem extends FileSystem {

  /**
   * Creates a new filesystem in localStorage. Accepts a key prefix that will be used as the "root key".
   * 
   * @param {String} rootKey 
   */
  constructor(rootKey) {
    super();
    this._rootKey = rootKey;
    this._metaKey = rootKey + '__META__';

    this.mount();
  }

  mount() {

    // Initialize the cache
    this._cache = new Map()
    this._metaCache = new Map();

    if (!this._checkKey('/')) {

      // Create the filesystem root 
      this._writeKey('/', '[]');
      this._writeMetaKey('/', {
        type: FileSystem.TYPE_DIRECTORY,
        ctime: Date.now(),
        mtime: Date.now(),
        atime: Date.now(),
      });

      return;
    }
  }

  /**
   * Resolves a key name by prepending the root key name
   * 
   * @param   {String} keyName 
   * @returns {String}
   */
  _resolveKey(keyName) {
    return `${this._rootKey}:${keyName}`;
  }

  /**
   * Resolves a meta key name by prepending the root meta key name
   * 
   * @param   {String} keyName 
   * @returns {String}
   */
  _resolveMetaKey(keyName) {
    return `${this._metaKey}:${keyName}`;
  }

  /**
   * Checks whether a key exists in the storage
   * 
   * @param   {String}  keyName 
   * @returns {Boolean}
   */
  _checkKey(keyName) {
    return this._resolveKey(keyName) in window.localStorage;
  }

  /**
   * Reads a key from localStorage. If the cache has an entry for this key, return the cached item.
   * Otherwise, query the localStorage, cache the result and return it.
   *
   * @param   {String} keyName
   * @returns {String}
   */
  _readKey(keyName) {
    const key = this._resolveKey(keyName);

    if (this._cache.has(key)) {
      return this._cache.get(key);
    }

    const data = window.localStorage.getItem(key);

    this._cache.set(key, data);

    return data;
  }

  /**
   * Writes a key to localStorage. Any cached entries for the key will be deleted, so on subsequent
   * access we'll return a fresh copy.
   * 
   * @param   {String} keyName 
   * @param   {String} content 
   * @returns {void}
   */
  _writeKey(keyName, content) {
    const key = this._resolveKey(keyName);

    // Flush the cache
    this._cache.delete(key);

    return window.localStorage.setItem(key, content);
  }

  /**
   * Deletes a key from localStorage. Any entries in file and meta cache will be deleted to avoid
   * orphaned entries in the cache.
   * 
   * @param   {String} keyName 
   * @returns {void}
   */
  _deleteKey(keyName) {
    const key = this._resolveKey(keyName);

    // Flush the cache
    this._cache.delete(key);

    // Delete the meta key
    this._deleteMetaKey(keyName);

    return window.localStorage.removeItem(key);
  }

  /**
   * Reads a meta key from localStorage. IIf the cache has an entry for this key, return the cached item.
   * Metadata is stored as a JSON string, so we'll attempt to read and parse the JSON. If there is no meta
   * data yet, store an empty object in the cache.
   * 
   * @param   {String} keyName 
   * @returns {Object}
   */
  _readMetaKey(keyName) {
    const key = this._resolveMetaKey(keyName);

    if (this._metaCache.has(key)) {
      return this._metaCache.get(key);
    }

    const meta = window.localStorage.getItem(key);
    const parsedMeta = !!meta ? JSON.parse(meta) : {};

    this._metaCache.set(key, parsedMeta);

    return parsedMeta;
  }

  /**
   * Writes a meta key to localStorage. Any cached entries for the key will be deleted, so on subsequent
   * access we'll return a fresh copy.
   *
   * @param   {String} keyName 
   * @param   {Object} meta 
   * @returns {void}
   */
  _writeMetaKey(keyName, meta) {
    const key = this._resolveMetaKey(keyName);

    this._metaCache.delete(key);

    return window.localStorage.setItem(key, JSON.stringify(meta));
  }

  /**
   * Deletes a meta key from localStorage. Any entries in file and meta cache will be deleted to avoid
   * orphaned entries in the cache.
   * 
   * @param   {String} keyName 
   * @returns {void}
   */
  _deleteMetaKey(keyName) {
    const key = this._resolveMetaKey(keyName);

    this._metaCache.delete(key);

    return window.localStorage.removeItem(key);
  }

  /**
   * Adds a child to the directory index of the parent directory. All directories in the file system only
   * know their direct children.
   * 
   * @param {String} parentPath 
   * @param {String} childPath
   */
  _addToDirectoryIndex(parentPath, childPath) {
    const normalized = Path.normalize(parentPath);

    let parentIndex = JSON.parse(this._readKey(normalized));

    if (!Array.isArray(parentIndex)) {
      parentIndex = [];
    }

    const relativePath = './' + Path.relative(normalized, childPath);

    if (!parentIndex.includes(relativePath)) {
      parentIndex.push(relativePath);
    }

    this._writeKey(normalized, JSON.stringify(parentIndex));
  }

  /**
   * Removes a child from the directory index of the parent directory.
   * 
   * @param {String} parentPath 
   * @param {String} childPath
   */
  _removeFromDirectoryIndex(parentPath, childPath) {
    const normalized = Path.normalize(parentPath);

    let parentIndex = JSON.parse(this._readKey(normalized));

    if (!Array.isArray(parentIndex)) {
      return;
    }

    const relativePath = './' + Path.relative(normalized, childPath);

    if (parentIndex.includes(relativePath)) {
      parentIndex.splice(parentIndex.indexOf(relativePath), 1);
    }

    this._writeKey(normalized, JSON.stringify(parentIndex));
  }

  async touch(path) {
    const normalized = Path.normalize(path);

    if (!await this.exists(normalized)) {
      throw new Error(`No such file or directory: ${normalized}`);
    }

    const meta = this._readMetaKey(normalized);

    // Update the access time
    meta.atime = Date.now();

    this._writeMetaKey(normalized, meta);
  }

  /**
   * Reads the file at the given path
   * 
   * @param {String} path 
   */
  async readFile(path) {
    const normalized = Path.normalize(path);

    if (!await this.exists(normalized)) {
      throw new Error(`No such file or directory: ${normalized}`);
    }

    if (!await this.isFile(normalized)) {
      throw new Error(`Cannot read ${path}: Not a file`);
    }

    await this.touch(normalized);

    return this._readKey(normalized);
  }

  /**
   * Writes the given content to the file at the given path. If the FileSystem.FILE_APPEND flag gets
   * passed, the content will be appended to the existing file.
   * @param {String} path 
   * @param {String} content 
   * @param {Number} flags 
   */
  async writeFile(path, content = '', flags = 0) {
    const normalized = Path.normalize(path);
    const parent = Path.parent(normalized);
    let meta = {};

    if (!await this.isDirectory(parent)) {
      throw new Error(`Not a directory: ${parent}`);
    }

    if (await this.exists(normalized)) {
      if (!await this.isFile(normalized)) {
        throw new Error(`Cannot write to ${path}: Not a file`);
      }

      meta = this._readMetaKey(normalized);
      meta.mtime = Date.now();
    } else {
      const timestamp = Date.now();

      meta.type = FileSystem.TYPE_FILE;
      meta.ctime = timestamp;
      meta.mtime = timestamp;
      meta.atime = timestamp;
    }


    let newContent = '';

    if (flags & FileSystem.FILE_APPEND) {
      newContent = await this.readFile(normalized);
    }

    newContent += content;

    // Set the file size
    meta.size = newContent.length;

    this._writeKey(normalized, content);
    this._writeMetaKey(normalized, meta);
    this._addToDirectoryIndex(parent, normalized);
  }

  /**
   * Deletes the file at the given path
   * 
   * @param {String} path 
   */
  async deleteFile(path) {
    const normalized = Path.normalize(path);

    if (!await this.exists(normalized)) {
      throw new Error(`No such file or directory: ${normalized}`);
    }

    if (!await this.isFile(normalized)) {
      throw new Error(`Cannot delete ${normalized}: Not a file`);
    }

    this._deleteKey(normalized);
    this._deleteMetaKey(normalized);
    this._removeFromDirectoryIndex(Path.parent(normalized), normalized);
  }

  /**
   * Checks whether the file or directory at the given path exists
   * 
   * @param {String} path 
   */
  async exists(path) {
    return this._checkKey(Path.normalize(path));
  }

  /**
   * Creates a directory at the given path. If recursive is passed, all missing segments will 
   * be created, too.
   * 
   * @param {String}  path 
   * @param {Boolean} recursive 
   */
  async createDirectory(path, recursive = false) {
    const normalized = Path.normalize(path);
    const parent = Path.parent(normalized);

    if (!recursive && !await this.isDirectory(parent)) {
      throw new Error(`Not a directory: ${parent}`);
    }

    if (!recursive && await this.exists(normalized)) {
      throw new Error(`Cannot create directory ${path}: File exists`)
    }

    if (recursive && !await this.exists(normalized)) {
      console.log(`Parent ${parent} is not a directory`);
      this.createDirectory(parent, true);
    }

    this._writeKey(normalized, '[]');
    this._writeMetaKey(normalized, {
      type: FileSystem.TYPE_DIRECTORY,
      ctime: Date.now(),
      mtime: Date.now(),
      atime: Date.now(),
      size: 0
    });
    this._addToDirectoryIndex(parent, normalized);
  }

  /**
   * Reads the children paths of the given directory
   * 
   * @param {String} path 
   */
  async readDirectory(path) {
    const normalized = Path.normalize(path);
    const cacheKey = this._resolveKey(normalized);

    if (!await this.isDirectory(normalized)) {
      throw new Error(`Not a directory: ${normalized}`);
    }

    const paths = JSON.parse(this._readKey(normalized))
      .map(path => Path.join(normalized, path));

    this.touch(normalized);

    return paths;
  }

  /**
   * Deletes the directory at the given path. If recursive is passed, any children nodes will be deleted, too.
   * 
   * @param {String}  path 
   * @param {Boolean} recursive 
   */
  async deleteDirectory(path, recursive = false) {
    const normalized = Path.normalize(path);

    if (!await this.isDirectory(normalized)) {
      throw new Error(`Cannot delete ${normalized}: Not a directory`);
    }

    const directoryContent = await this.readDirectory(normalized);

    if (directoryContent.length > 0) {
      if (!recursive) {
        throw new Error(`Cannot delete ${normalized}: Directory is not empty`);
      }

      console.log('Recursively deleting all children of ' + normalized);

      // TODO: Delete children
      for (let child of directoryContent) {
        const childPath = Path.normalize(Path.join(normalized, child));

        console.log('Deleting child ' + childPath);
        this.deleteDirectory(childPath, true);
      }

      alert('Recursive deletion is not implemented yet.')
    }

    this._removeFromDirectoryIndex(Path.parent(normalized), normalized);
    this._deleteKey(normalized);
    this._deleteMetaKey(normalized);
  }

  async getType(path) {
    const normalized = Path.normalize(path);

    if (!await this.exists(normalized)) {
      throw new Error(`No such file or directory: ${normalized}`);
    }

    const metaEntry = this._readMetaKey(normalized);

    return metaEntry.type;
  }

  async isDirectory(path) {
    return await this.getType(path) === FileSystem.TYPE_DIRECTORY;
  }

  async isFile(path) {
    return await this.getType(path) === FileSystem.TYPE_FILE;
  }

  async getMetaData(path) {
    const normalized = Path.normalize(path);

    if (!await this.exists(normalized)) {
      throw new Error(`No such file or directory: ${normalized}`)
    }

    await this.touch(normalized);

    return this._readMetaKey(normalized);
  }

  /**
   * Retrieves the user space in bytes
   *
   * @returns {Number}
   */
  async getUsed() {
    return new Blob(Object.values(window.localStorage)).size;
  }

  /**
   * Retrieves the available space in bytes.
   * Note: For the LocalStorage file system, this number is fixed to 5MB, 
   * since that's what the W3C proposes.
   * 
   * @returns {Number}
   */
  async getTotal() {
    return 5242880;
  }

  /**
   * Retrieves the available space in bytes
   * 
   * @returns {Number}
   */
  async getAvailable() {
    const [total, used] = await Promise.all([
      this.getTotal(),
      this.getUsed()
    ]);

    return total - used;
  }
}

export default LocalStorageFileSystem;
