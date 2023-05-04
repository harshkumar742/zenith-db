const fs = require('fs');
const Query = require('./query');
const Storage = require('./storage');
const Replication = require('./replication');
const Index = require('./indexer');
const path = require('path');

class ZenithDB {
    constructor(filePath) {
        this.filePath = filePath;
        this.storage = new Storage(filePath);
        const replicationFilePath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.replication');
        this.replication = new Replication(replicationFilePath);
        this.indexes = {};

        // Load indexes
        this.loadIndexes();
    }

    loadIndexes() {
        const indexFileNames = fs.readdirSync('.')
            .filter((fileName) => fileName.startsWith(`${this.filePath}.`) && fileName.endsWith('.index.json'));

        indexFileNames.forEach((fileName) => {
            const field = fileName.replace(`${this.filePath}.`, '').replace('.index.json', '');
            this.indexes[field] = new Index(field, this.storage);
        });
    }

    set(key, value) {
        const oldValue = this.storage.get(key);
        this.storage.set(key, value);

        // Update indexes
        Object.entries(this.indexes).forEach(([field, index]) => {
            const indexValue = value[field];
            index.update(key, oldValue ? oldValue[field] : null, indexValue);
        });

        // Replicate data
        this.replication.set(key, value);
    }

    get(key) {
        return this.storage.get(key);
    }

    delete(key) {
        const value = this.storage.get(key);
        this.storage.delete(key);

        // Update indexes
        Object.entries(this.indexes).forEach(([field, index]) => {
            index.update(key, value[field], null);
        });

        // Replicate deletion
        this.replication.delete(key);
    }

    query(options) {
        const query = new Query(Object.values(this.storage.data));
        let result = query.filter(options);

        // Use index for equality queries
        if (options.operation === 'equal' && this.indexes[options.field]) {
            result = options.value ? this.indexes[options.field].query(options.value).map((key) => this.get(key)) : [];
        }

        return result;
    }

    replicate(filePath) {
        const replicationData = JSON.parse(fs.readFileSync(filePath));
        Object.entries(replicationData).forEach(([key, value]) => {
            if (this.get(key)) {
                // Update existing record
                this.set(key, value);
            } else {
                // Add new record
                this.set(key, value);
            }
        });
    }
}

module.exports = ZenithDB;
