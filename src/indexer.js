class Index {
    constructor(field, storage) {
      this.field = field;
      this.storage = storage;
      this.data = {};
  
      this.load();
    }
  
    load() {
      const records = Object.entries(this.storage.data);
      records.forEach(([key, value]) => {
        const indexValue = value[this.field];
        if (!this.data[indexValue]) {
          this.data[indexValue] = [];
        }
        this.data[indexValue].push(key);
      });
    }
  
    update(key, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (this.data[oldValue]) {
          const indexValue = this.data[oldValue];
          const indexValueIndex = indexValue.indexOf(key);
          indexValue.splice(indexValueIndex, 1);
          if (indexValue.length === 0) {
            delete this.data[oldValue];
          }
        }
        if (newValue) {
          if (!this.data[newValue]) {
            this.data[newValue] = [];
          }
          this.data[newValue].push(key);
        }
        this.save();
      }
    }
  
    query(value) {
      return this.data[value] || [];
    }
  
    save() {
      const indexData = JSON.stringify(this.data);
      const indexFilePath = `${this.storage.filePath}.${this.field}.index.json`;
      fs.writeFileSync(indexFilePath, indexData);
    }
  }
  
  module.exports = Index;
  