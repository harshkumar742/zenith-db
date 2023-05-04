# ZenithDB

ZenithDB is a lightweight, easy-to-use database implementation for Node.js. It provides a simple API for storing and querying data, with support for aggregation, replication, concurrency, and more. With ZenithDB, you can quickly and easily add database functionality to your Node.js projects, without the need for a full-fledged database management system.

## Installation

You can install ZenithDB using npm:

```bash
npm install zenith-db
```


## Usage

Here's an example of how to use ZenithDB:

```javascript
const ZenithDB = require('zenith-db');

// Create a new instance of ZenithDB
const db = new ZenithDB('my-data.json');

// Set some data
db.set('key1', { name: 'Alice', age: 25 });
db.set('key2', { name: 'Bob', age: 30 });
db.set('key3', { name: 'Charlie', age: 35 });

// Query the data
const result1 = db.query({ field: 'name', operation: 'equal', value: 'Alice' });
console.log(result1); // [{ name: 'Alice', age: 25 }]

const result2 = db.query({ field: 'age', operation: 'greaterThan', value: 30 });
console.log(result2); // [{ name: 'Charlie', age: 35 }]

const result3 = db.query({ field: 'name', operation: 'equal', value: 'Alice', count: true });
console.log(result3); // 1

const result4 = db.query({ field: 'age', aggregate: 'average' });
console.log(result4); // 30

const result5 = db.query({ map: (item) => item.age, reduce: (acc, value) => acc + value });
console.log(result5); // 90

// Delete a record
db.delete('key2');

// Replicate data to another instance of ZenithDB
db.replicate('replicationFilePath');
```

## ZenithDB API

`new ZenithDB(filePath: string): ZenithDB` - creates a new instance of ZenithDB with the given file path for data storage.

`set(key: string, value: any): void` - sets the value for the given key.

`get(key: string): any` - retrieves the value for the given key.

`delete(key: string): void` - deletes the value for the given key.

`query(query: Query): any[] | number` - queries the data using the given query object and returns an array of results or a count.

`replicate(filePath: string): void` - replicates the data to the given file path.

The `filePath` parameter in the constructor and the `replicate` function should be the path to the file where the data will be stored and replicated. The `query` parameter in the `query` function should be an object with the following properties:

- `field` (string) - the field to search for.
- `operation` (string) - the operation to perform on the field, such as 'equal', 'greaterThan', etc.
- `value` (any) - the value to compare the field to.
- `count` (boolean) - whether to return the count of the results instead of the results themselves.
- `aggregate` (string) - the type of aggregation to perform, such as 'average', 'sum', etc.
- `map` (function) - a mapping function to apply to each item before reducing.
- `reduce` (function) - a reducing function to aggregate the mapped values.

Note that ZenithDB creates a replication file with the same name as the data file but with the extension `.replication.json`. This file is used to store the replicated data.
