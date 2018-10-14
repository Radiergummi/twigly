import FileSystemItem from "./FileSystemItem";
import Path from "./Path";

class FileSystemDirectory extends FileSystemItem {
  async getChildren() {
    return this.fileSystem.readDirectory(this.path);
  }

  get children() {
    return this.getChildren();
  }
}

export default FileSystemDirectory;
