/**
 * Onordered collection of unique objects, which is faster on insertions and removals.
 *
 * @class bb.Set
 * @property {Integer} length the number of items this set contains
 */
bb.Set = bb.Class.extend({
  /**
   * @constructor
   */
  init: function() {
    this.length = 0;
    this.data = {};
  },

  /**
   * Adds an item to the set.
   * @method add
   * @param {Object} item
   * @return {Boolean} true if the item wasn't present on the set, false otherwise
   */
  add: function(item) {
    if (!this.contains(item)) {
      this.length += 1;
      this.data[bb.objectId(item)] = item;
      return true;
    }

    return false;
  },

  /**
   * Removes an item of the set.
   * @method remove
   * @param {Object} item
   * @return {Boolean} true if the item was present on the set, false otherwise
   */
  remove: function(item) {
    if (this.contains(item)) {
      delete this.data[bb.objectId(item)];
      this.length -= 1;
      return true;
    }

    return false;
  },

  /**
   * Checks if the set contains a specific item.
   * @method contains
   * @param {Object} item
   * @return {Boolean} true if the item is present on the set, false otherwise
   */
  contains: function(item) {
    return typeof this.data[bb.objectId(item)] != "undefined";
  },

  /**
   * Removes all the items from the set.
   * @method clear
   */
  clear: function() {
    this.data = {};
    this.length = 0;
  },

  /**
   * Iterates over the set, yelling all the items.
   * @method forEach
   * @param {Callback} callback
   * @param {Scope} scope
   * @example
   *     set.forEach(function(item) {
   *       console.log(item);
   *     });
   */
  forEach: function(callback, scope) {
    scope = scope || this;

    for (var key in this.data) {
      callback.call(scope, this.data[key]);
    }
  }
});
