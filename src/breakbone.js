bb = (function() {
  "use strict";

  /**
   * @module bb
   */
  var bb = {};

  /**
   * Creates or returns a object id
   *
   * @function objectId
   * @returns {Number} id of the object
   */
  var nextObjectId = 0;
  bb.objectId = function(object) {
    if (object) {
      if (typeof object.objectId == "undefined") {
        Object.defineProperty(object, "objectId", {
          enumerable: false,
          writable: false,
          configurable: false,
          value: nextObjectId++
        });
      }

      return object.objectId;
    }
  }

  return bb;
})();
