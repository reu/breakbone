bb.Runner = (function(window) {
  "use strict";

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
  class Runner {
    /**
     * @constructor
     * @param {Integer} fps the frames per second that this runner will run
     */
    constructor(fps) {
      this.fps = fps || 60;
      this.onTick = function(elapsedTime) {};
    }

    /**
     * Starts the run loop.
     *
     * @method start
     */
    start() {
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
    }

    /**
     * Stops the run loop.
     */
    stop() {
      if (this.fps == 60) {
        displayUnbind(this.runLoop);
      } else {
        window.clearTimeout(this.runLoop);
      }

      delete this.runLoop;
    }
  };

  return Runner;
})(typeof window != "undefined" ? window : global);
