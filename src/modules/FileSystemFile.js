import FileSystemItem from "@/modules/FileSystemItem";

class FileSystemFile extends FileSystemItem {
  async getContent() {
    return this.fileSystem.readFile(this.path);
  }

  get content() {
    return this.getContent();
  }

  async write(content) {
    return this.fileSystem.writeFile(this.path, content);
  }

  async append(content) {
    return this.fileSystem.append(this.path, content);
  }

  async getSize() {
    const meta = await this.fileSystem.getMetaData(this.path);

    return meta.size;
  }
}

export default FileSystemFile;
