class Query {
    constructor(data) {
      this.data = data;
    }
  
    filter(options) {
      let filteredData = this.data;
  
      if (options.field && options.value) {
        switch (options.operation) {
          case 'equal':
            filteredData = filteredData.filter((item) => item[options.field] === options.value);
            break;
          case 'greaterThan':
            filteredData = filteredData.filter((item) => item[options.field] > options.value);
            break;
          case 'lessThan':
            filteredData = filteredData.filter((item) => item[options.field] < options.value);
            break;
          default:
            filteredData = filteredData.filter((item) => item[options.field] === options.value);
        }
      }
  
      if (options.count) {
        return filteredData.length;
      }
  
      if (options.aggregate) {
        const values = filteredData.map((item) => item[options.field]);
  
        switch (options.aggregate) {
          case 'sum':
            return values.reduce((acc, value) => acc + value, 0);
          case 'average':
            return values.reduce((acc, value) => acc + value, 0) / values.length;
          case 'min':
            return Math.min(...values);
          case 'max':
            return Math.max(...values);
          default:
            return filteredData;
        }
      }
  
      if (options.map && options.reduce) {
        return filteredData.map(options.map).reduce(options.reduce);
      }
  
      return filteredData;
    }
  }
  
  module.exports = Query;
  