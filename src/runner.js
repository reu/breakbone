bb.Runner = (function(window) {
  var displayBind = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                      window.setTimeout(callback, 1000 / 60);
                    };

  var displayUnbind = window.cancelAnimationFrame || window.clearTimeout;

  /**
   * The runner provides a infinite loop on a specific frame rate.
   *
   * @class Runner
   */
  var Runner = bb.Class.extend({
    /**
     * @constructor
     * @param {Integer} fps the frames per second that this runner will run
     */
    init: function(fps) {
      this.fps = fps || 60;
      this.onTick = function(elapsedTime) {};
    },

    /**
     * Starts the run loop.
     *
     * @method start
     */
    start: function() {
      var time = new Date;
      var _this = this;

      if (this.fps == 60) {
        this.runLoop = displayBind(function tick() {
          _this.onTick(new Date - time);
          _this.runLoop = displayBind(tick);
          time = new Date;
        });
      } else {
        this.runLoop = setTimeout(function tick() {
          _this.onTick(new Date - time);
          _this.runLoop = setTimeout(tick, 1000 / _this.fps);
          time = new Date;
        }, 1000 / this.fps);
      }
    },

    /**
     * Stops the run loop.
     */
    stop: function() {
      if (this.fps == 60) {
        displayUnbind(this.runLoop);
      } else {
        window.clearTimeout(this.runLoop);
      }

      delete this.runLoop;
    },
  });

  return Runner;
})(typeof window != "undefined" ? window : global);
