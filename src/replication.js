const fs = require('fs');
const lockfile = require('proper-lockfile');

class Replication {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = {};

        // Create the file if it does not exist
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}');
        }

        // Load data from disk
        this.load();
    }

    load() {
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
            console.log(`Error loading replication data: ${error}`);
        } finally {
            lockfile.unlockSync(lockFilePath);
        }
    }

    save() {
        const lockFilePath = `${this.filePath}.lock`;
        lockfile.lockSync(lockFilePath);

        try {
            const fileData = JSON.stringify(this.data);
            fs.writeFileSync(this.filePath, fileData);
        } catch (error) {
            console.log(`Error saving replication data: ${error}`);
        } finally {
            lockfile.unlockSync(lockFilePath);
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    delete(key) {
        delete this.data[key];
        this.save();
    }
}

module.exports = Replication;
