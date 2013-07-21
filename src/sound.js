bb.Sound = (function() {
  "use strict";

  /**
   * Represent a sound asset.
   *
   * @class bb.Sound
   * @property {Number} volume volume of the sound, ranging from 0 to 1
   * @property {Boolean} isLoaded if the sound has been loaded
   * @property {Boolean} isPaused true if the sound has been paused
   * @property {Boolean} isPlaying true if the sound is being play
   */
  var Sound = bb.Class.extend({
    /**
     * @constructor
     * @param {String} url the path to the sound file
     */
    init: function(url) {
      this.url = url;
      this._volume = 1;

      this.isLoaded = false;
      this.isPaused = false;

      Object.defineProperty(this, "volume", {
        set: this.setVolume.bind(this),
        get: this.getVolume.bind(this)
      });

      Object.defineProperty(this, "isPlaying", {
        get: function() {
          return !this.element.ended;
        }.bind(this)
      });
    },

    /**
     * Loads a sound file and executes the callback when loaded.
     *
     * @method load
     * @param {Function} onLoadCallback callback that will be
     *     called when the sound file is loaded
     */
    load: function(onLoadCallback) {
      if (this.isLoaded) {
        if (onLoadCallback) {
          onLoadCallback(this);
        }
      } else {
        this.onLoadCallback = onLoadCallback;

        this.element = new Audio;
        this.element.preload = "auto";

        this.element.onload = this.onAudioLoaded.bind(this);
        this.element.onerror = this.onLoadError.bind(this);
        this.element.addEventListener("canplaythrough", this.onAudioLoaded.bind(this), false);
        this.element.addEventListener("error", this.onLoadError.bind(this), false);

        this.element.src = this.url;
        this.element.load();
      }
    },

    /**
     * Plays the sound file.
     *
     * @method play
     * @param {Boolean} loop the sound should loop
     */
    play: function(loop) {
      if (!this.isLoaded) return;
      if (typeof loop != "undefined" && typeof loop != "null") {
        this.element.loop = !!loop;
      }

      this.element.play();
      this.element.isPaused = false;
    },

    /**
     * Stops the sound.
     *
     * @method stop
     * @param {Boolean} loop the sound should loop
     */
    stop: function() {
      this.element.pause();
      this.element.currentTime = 0;
    },

    /**
     * Pauses the sound.
     *
     * @method pause
     * @param {Boolean} loop the sound should loop
     */
    pause: function() {
      this.element.pause();
      this.isPaused = true;
    },

    /**
     * Pauses the sound.
     *
     * @method setVolume
     * @private
     * @param {Number} volume the volume of this sound, from 0 to 1
     */
    setVolume: function(volume) {
      this._volume = volume;
      this.element.volume = this._volume * bb.Sound.masterVolume;
    },

    /**
     * Get the sound volume.
     *
     * @method getVolume
     * @private
     * @return {Number} the volume of this sound, from 0 to 1
     */
    getVolume: function() {
      return this._volume;
    },

    /**
     * @method onAudioLoaded
     * @private
     */
    onAudioLoaded: function(event) {
      this.isLoaded = true;
      this.setVolume(this.volume);

      bb.Sound.sounds.push(this);

      if (this.onLoadCallback) {
        this.onLoadCallback(this);
      }
    },

    /**
     * @method onLoadError
     * @private
     */
    onLoadError: function() {
      throw "Error while loading sound: " + this.url;
    }
  });

  /**
   * The list of all loaded sounds.
   * @property {Array} sounds list of all the loaded sounds.
   */
  Sound.sounds = [];

  /**
   * The global sound volume.
   * @property {Number} masterVolume
   */
  Sound._masterVolume = 1;

  Sound.setMasterVolume = function(volume) {
    bb.Sound._masterVolume = volume;
    bb.Sound.sounds.forEach(function(sound) {
      sound.setVolume(sound.volume);
    });
  }

  Sound.getMasterVolume = function() {
    return bb.Sound._masterVolume;
  }

  Object.defineProperty(Sound, "masterVolume", {
    set: Sound.setMasterVolume,
    get: Sound.getMasterVolume
  });

  /**
   * Pauses all the sounds current playing.
   * @method pause
   */
  Sound.pause = function() {
    bb.Sound.sounds.forEach(function(sound) {
      if (sound.isPlaying) {
        sound.pause();
      }
    });
  }

  /**
   * Stops all the sounds current playing.
   * @method stop
   */
  Sound.stop = function() {
    bb.Sound.sounds.forEach(function(sound) {
      if (sound.isPlaying) {
        sound.stop();
      }
    });
  }

  /**
   * Resumes all the sounds current paused.
   * @method resume
   */
  Sound.resume = function() {
    bb.Sound.sounds.forEach(function(sound) {
      if (sound.isPaused) {
        sound.play();
      }
    });
  }

  return Sound;
})();
