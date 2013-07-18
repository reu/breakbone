(function(scope) {
  Array.prototype.remove = function(item) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === item) {
        this.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  Array.prototype.contains = function(item) {
    for (var i = 0, length = this.length; i < length; i++) {
      if (this[i] === item) {
        return true;
      }
    }

    return false;
  }

  // Fastest array clear implementation, see: http://jsperf.com/array-destroy/32
  Array.prototype.clear = function() {
    while (this.length > 0) {
      this.pop();
    }
  }

  /**
   * @module bb
   */
  scope.bb = {};

  bb.nextObjectId = 1;

  /**
   * Creates or returns a object id
   *
   * @function objectId
   * @returns {Number} id of the object
   */
  bb.objectId = function(object) {
    if (object) {
      if (typeof object.objectId == "undefined") {
        Object.defineProperty(object, "objectId", {
          enumerable: false,
          writable: false,
          configurable: false,
          value: bb.nextObjectId++
        });
      }

      return object.objectId;
    }
  }
})(typeof window == "undefined" ? global : window);
