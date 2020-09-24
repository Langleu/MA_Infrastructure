const _ = require('lodash');

class Queue {

  constructor() {
    this.storage = [];
    this.progress = [];
  }

  insert(obj) {
    this.storage.push(obj);
  }

  concat(arr) {
    this.storage = _.unionWith(this.storage, arr, _.isEqual);
  }

  deleteStorageEntry(id) {
    const hasId = (e) => e.id == id;

    let pos = this.storage.findIndex(hasId);
    this.storage.splice(pos, 1);

    console.log('Entry has been deleted from the storage queue');
  }

  deleteProgressEntry(id) {
    const hasId = (e) => e.id == id;

    let pos = this.progress.findIndex(hasId);
    this.progress.splice(pos, 1);

    console.log('Entry has been deleted from the progress queue');
  }

  getRandom() {
    let obj = this.storage[Math.floor((Math.random()*this.storage.length))];
    if (!obj) return;

    this.progress.push(obj);
    this.deleteStorageEntry(obj.id);

    console.log('Returning random object');
    return obj;
  }

  lengthStorage() {
    return this.storage.length;
  }

  lengthProgress() {
    return this.progress.length;
  }

}

module.exports = new Queue();
