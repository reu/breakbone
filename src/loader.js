bb.Loader = (function() {
  "use strict";

  /**
   * The loader helps to organize multiple assets loading.
   *
   * @class bb.Loader
   * @property {Number} loadedCount the number of current loaded resources
   * @event onFinish fired when all the resources are loaded
   * @event onProgress fired when each resource is loaded
   */
  var Loader = bb.Class.extend({
    /**
     * @constructor
     */
    init: function() {
      this.resources = [];
      this.loadedCount = 0;

      this.onProgress = function(percentage, count) {};
      this.onFinish = function() {};
    },

    /**
     * Adds resources to the loading queue.
     *
     * @method add
     * @param {Arguments} resources
     */
    add: function() {
      for (var i = 0; i < arguments.length; i++) {
        var resource = arguments[i];

        if (typeof resource.load == "function") {
          this.resources.push(resource);
        } else {
          throw "Invalid resource.";
        }
      }
      return this;
    },

    /**
     * Loads all the resources and fires the callback when finished.
     *
     * @method load
     * @param {Function} callback
     */
    load: function(callback) {
      this.loadedCount = 0;

      this.onProgress(0, this.loadedCount);

      var _this = this;
      this.resources.forEach(function(resource) {
        resource.load(function() {
          _this.loadedCount += 1;
          _this.onProgress(_this.loadedCount / _this.resources.length * 100, _this.loadedCount);
          if (_this.loadedCount == _this.resources.length) {
            _this.onFinish();
            callback();
          }
        });
      });
    },

    /**
     * Event fired when each resource is loaded.
     * @event onProgress
     */
    onProgress: function(percentage, count) {},

    /**
     * Event fired when all the resources are loaded.
     * @event onFinish
     */
    onFinish: function() {}
  });

  return Loader;
})();
