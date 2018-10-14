import FileSystemItem from "./FileSystemItem";
import Path from "./Path";

class FileSystemFile extends FileSystemItem {
  async getContent() {
    return this.fileSystem.readFile(this.path);
  }

  get content() {
    return this.getContent();
  }

  async getSize() {
    const meta = await this.fileSystem.getMetaData(this.path);

    return meta.size;
  }
}

export default FileSystemFile;
