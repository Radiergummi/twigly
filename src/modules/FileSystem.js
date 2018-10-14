import FileSystemFile from "./FileSystemFile";
import FileSystemDirectory from "./FileSystemDirectory";

class FileSystem {
  static get FILE_APPEND() {
    return 1;
  };

  static get TYPE_FILE() {
    return 0;
  }

  static get TYPE_DIRECTORY() {
    return 1;
  }

  /**
   * Reads a file
   *
   * @param {String}            path
   *
   * @returns {Promise<String>}
   */
  async readFile(path) { }

  /**
   * Writes a file
   *
   * @param {String}          path
   * @param {String}          [content]
   * @param {Number}          [flags]
   *
   * @returns {Promise<void>}
   */
  async writeFile(path, content = "", flags = 0) { }

  /**
   * Appends to a file
   *
   * @param   {String}         path 
   * @param   {String}         content 
   *
   * @returns {Promise<void>}
   */
  async appendFile(path, content) {
    return this.writeFile(path, content, this.constructor.FILE_APPEND);
  }

  /**
   * Deletes a file
   *
   * @param {String}          path 
   * 
   * @returns {Promise<void>}
   */
  async deleteFile(path) { }

  async exists(path) { }

  async createDirectory(path) { }

  async readDirectory(path) { }

  async deleteDirectory(path, recursive = false) { }

  async getType(path) { }

  async isDirectory(path) { }

  async isFile(path) { }

  async getMetaData(path) { }

  async get(path) {
    if (!await this.exists(path)) {
      throw new Error(`No such file: ${path}`);
    }

    if (await this.isDirectory(path)) {
      return FileSystemDirectory.on(this, path);
    }

    if (await this.isFile(path)) {
      return FileSystemFile.on(this, path);
    }

    throw new Error(`Cannot get item of unknown type: ${path}`)
  }

  async put(file, path) {

  }
}

export default FileSystem;
