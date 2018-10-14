import FileSystem from "./FileSystem";
import Path from "./Path";

class FileSystemFile {
  constructor(path) {
    this.path = path;
  }

  getName() {
    return Path.basename(this.path);
  }

  get name() {
    return this.getName();
  }

  getPath() {
    return this.path;
  }

  async getMeta() {
    return await this.fileSystem.getMetaData(this.path);
  }

  get meta() {
    return this.getMeta();
  }

  async isDirectory() {
    const meta = await this.meta;

    return meta.type === FileSystem.TYPE_DIRECTORY;
  }

  async isFile() {
    const meta = await this.meta;

    return meta.type === FileSystem.TYPE_FILE;
  }

  async delete() {
    if (await this.isDirectory()) {
      return this.fileSystem.deleteDirectory(this.path);
    }

    return this.fileSystem.deleteFile(this.path);
  }

  /**
   * Sets the filesytem instance this file is located on
   * 
   * @param {FileSystem} fileSystem 
   */
  set fileSystem(fileSystem) {
    if (!fileSystem instanceof FileSystem) {
      throw new Error('Cannot set filesystem: Invalid filesystem provided');
    }

    this._fileSystem = fileSystem;
  }

  /**
   * Retrieves the filesystem instance for this file
   * 
   * @returns {FileSystem}
   */
  get fileSystem() {
    if (!this._fileSystem) {
      throw new Error('No filesystem set');
    }

    return this._fileSystem;
  }

  /**
   * Creates a new file instance on a specific file system
   * 
   * @param {FileSystem} fileSystem 
   * @param {String}     path
   */
  static on(fileSystem, path) {
    const file = new this(path);

    file.fileSystem = fileSystem;

    return file;
  }
}

export default FileSystemFile;
