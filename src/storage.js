const fs = require('fs');
const lockfile = require('proper-lockfile');

class Storage {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {};

    // Load data from disk
    this.loadData();
  }

  loadData() {
    const lockFilePath = `${this.filePath}.lock`;

    // Create the lock file if it does not exist
    if (!fs.existsSync(lockFilePath)) {
      fs.writeFileSync(lockFilePath, '');
    }

    lockfile.lockSync(lockFilePath);

    try {
      const fileData = fs.readFileSync(this.filePath);
      this.data = JSON.parse(fileData);
    } catch (error) {
      // Ignore file not found errors
      if (error.code !== 'ENOENT') {
        throw error;
      }
    } finally {
      lockfile.unlockSync(lockFilePath);
    }
  }

  saveData() {
    const lockFilePath = `${this.filePath}.lock`;
    lockfile.lockSync(lockFilePath);

    try {
      const dataString = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(this.filePath, dataString);
    } finally {
      lockfile.unlockSync(lockFilePath);
    }
  }

  set(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  get(key) {
    return this.data[key];
  }

  delete(key) {
    delete this.data[key];
    this.saveData();
  }
}

module.exports = Storage;
