bb.Image = (function() {
  "use strict";

  /**
   * Represent an image asset.
   *
   * @class bb.Image
   * @property {Object} data
   * @property {Number} width
   * @property {Number} height
   */
  bb.Image = bb.Class.extend({
    /**
     * @constructor
     * @param {String} url the path to the image
     */
    init: function(url) {
      this.url = url;
      this.isLoaded = false;
    },

    /**
     * Loads a image and executes the callback when loaded.
     *
     * @method load
     * @param {Function} onLoadCallback callback that will be
     *     called when the image is loaded
     */
    load: function(onLoadCallback) {
      if (this.isLoaded) {
        if (onLoadCallback) {
          onLoadCallback(this);
        }
      } else if (!this.isLoaded) {
        this.onLoadCallback = onLoadCallback;

        var image = new Image;
        image.onload = this.onImageLoaded.bind(this);
        image.onerror = this.onLoadError.bind(this);
        image.src = this.url;
      }
    },

    /**
     * @method onImageLoaded
     * @private
     */
    onImageLoaded: function(event) {
      this.data = event.srcElement;
      this.width = this.data.width;
      this.height = this.data.height;
      this.isLoaded = true;

      if (this.onLoadCallback) {
        this.onLoadCallback(this);
      }
    },

    /**
     * @method onLoadError
     * @private
     */
    onLoadError: function() {
      throw "Error while loading image: " + this.url;
    }
  });

  return bb.Image;
})();
