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
bb.Class = (function() {
  "use strict";

  /**
   * Class based on (Jonh Resig)[http://ejohn.org/blog/simple-javascript-inheritance/]
   * and Impactjs implementation.
   *
   * @class bb.Class
   * @constructor
   */
  var Class = function Class() {}

  /**
   * Reopens the class and inject new methods on it.
   *
   * @method reopen
   * @param {Object} properties the properties to inject on the class
   */
  Class.reopen = function(properties) {
    for (var name in properties) {
      var property = properties[name];
      var currentProperty = this.prototype[name]

      if (typeof property == "function" && typeof currentProperty == "function") {
        this.prototype[name] = (function(parentFn, fn) {
          return function() {
            var tmp = this.parent;
            this.parent = parentFn;
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            if (typeof this.parent ==  "undefined") delete this.parent;
            return ret;
          }
        })(currentProperty, property);
      } else {
        this.prototype[name] = property;
      }
    }
  }

  /**
   * Extends a class.
   * You can call the function `this.parent` when overriding methods
   * to refer to the same method of the superclass.
   *
   * @method extend
   * @param {Object} properties the properties of the new class
   * @example
   *     var Person = bb.Class.extend({
   *       init: function(name) {
   *         if (!name || name == "") throw "We don't allow anonymous people here";
   *         this.name = name;
   *       },
   *       sayHello: function() {
   *         return "Hello, my name is " + this.name;
   *       }
   *     });
   *
   *     var Ninja = Person.extend({
   *       init: function(name, stars) {
   *         this.parent(name) // Call the Person constructor method
   *         this.stars = stars || 0;
   *       },
   *
   *       sayHello: function() {
   *         return this.parent() + " **disapears in the shadows**";
   *       },
   *
   *       throwStars: function() {
   *         this.stars--;
   *         return "Star throwed!";
   *       }
   *     });
   */
  Class.extend = function(properties) {
    var parent = this.prototype;
    var child = Object.create(parent);

    for (var name in properties) {
      var property = properties[name];
      var parentProperty = parent[name];

      if (typeof property == "function" && typeof parentProperty == "function") {
        child[name] = (function(parentFn, fn) {
          return function() {
            var tmp = this.parent;
            this.parent = parentFn;
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            if (typeof this.parent ==  "undefined") delete this.parent;
            return ret;
          }
        })(parentProperty, property);
      } else {
        child[name] = properties[name];
      }
    }

    function Class() {
      if (child.init) child.init.apply(this, arguments);
    }
    Class.prototype = child;
    Class.prototype.constructor = Class;
    Class.extend = bb.Class.extend;
    Class.reopen = bb.Class.reopen;

    return Class;
  }

  return Class;
})();
bb.Vector = (function() {
  "use strict";

  var Vector = bb.Class.extend({
    init: function(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    },

    add: function(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    },

    subtract: function(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    },

    multiply: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },

    divide: function(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },

    lengthSquared: function() {
      return this.x * this.x + this.y * this.y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    normalize: function() {
      var length = this.length();
      if (length > 0 && length != 1) this.divide(length);
      return this;
    },

    limit: function(max) {
      if (this.length() > max) return this.normalize() && this.multiply(max);
    },

    dot: function(vector) {
      return this.x * vector.x + this.y * vector.y;
    },

    distance: function(vector) {
      var dx = this.x - vector.x,
          dy = this.y - vector.y;

      return Math.sqrt(dx * dx + dy * dy);
    },

    reverse: function() {
      this.x *= -1;
      this.y *= -1;
      return this;
    },

    clone: function() {
      return new Vector(this.x, this.y);
    },

    toString: function() {
      return "(" + ([this.x, this.y].join(", ")) + ")";
    }
  });

  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  Vector.multiply = function(vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
  }

  Vector.divide = function(vector, scalar) {
    return new Vector(vector.x / scalar, vector.y / scalar);
  }

  Vector.distance = function(v1, v2) {
    var dx = v1.x - v2.x,
        dy = v1.y - v2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  return Vector;
})();
bb.KEY = (function() {
  /**
   * The list of all the supported keys.
   *
   * @property {Object} KEY
   * @static
   */
  var KEY = {
    MOUSE1: 1,
    MOUSE2: 2,
    RETURN: 13,
    ENTER: 13,
    BACKSPACE: 8,
    TAB: 9,
    CLEAR: 12,
    ESC: 27,
    ESCAPE: 27,
    SPACE: 32,
    DEL: 46,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACKTICK: 192,
    DASH: 189,
    EQUAL: 187,
    SEMICOLON: 186,
    BACKSLASH: 222,
    LEFTBRACKET: 219,
    RIGHTBRACKET: 221,
    REVERSE_SLASH: 220,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    OPTION: 18,
    COMMAND: 91,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }

  var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  for (var i = 0, length = letters.length; i < length; i++) {
    KEY[letters[i]] = i + 65;
  }

  for (var number = 0; number <= 9; number++) {
    KEY["NUMBER" + number] = number + 48;
  }

  return KEY;
})();
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
bb.Entity = (function() {
  "use strict";

  /**
   * A entity represent every "thing" of your game.
   *
   * @class bb.Entity
   * @property {bb.World} world world that this entity belongs to
   * @property {Number} id the unique id of this entity
   */
  var Entity = bb.Class.extend({
    /**
     * @constructor
     * @param {bb.World} world
     */
    init: function(world) {
      this.world = world;
      this.id = bb.objectId(this);
    },

    /**
     * Checks if the entity contains the specified component type.
     *
     * @method hasComponent
     * @param {String} componentType
     * @return {Boolean} true if the entity contains the specified component
     */
    hasComponent: function(componentType) {
      return !!this.getComponent(componentType);
    },

    /**
     * Adds a new component to this entity.
     *
     * @method addComponent
     * @param {bb.Component}
     * @return {bb.Entity} itself
     */
    addComponent: function(component) {
      this.world.addEntityComponent(this, component);
      this[component.type] = component;
      return this;
    },

    /**
     * Returns the list of components this entitiy has.
     *
     * @method getComponents
     * @return {Array} components
     */
    getComponents: function() {
      return this.world.getEntityComponents(this);
    },

    /**
     * Gets the component of a specific type.
     *
     * @method getComponent
     * @param {String} componentType
     * @return {bb.Component}
     */
    getComponent: function(componentType) {
      return this.world.getEntityComponent(this, componentType);
    },

    /**
     * Removes a component from this entity.
     *
     * @method removeComponent
     * @param {bb.Component | String} componentOrType
     * @return {bb.Entity} itself
     */
    removeComponent: function(component) {
      if (typeof component == "string") {
        component = this.getComponent(component);
      }

      this.world.removeEntityComponent(this, component);
      delete this[component.type];

      return this;
    },

    /**
     * Removes itself from the world.
     * @method remove
     */
    remove: function() {
      this.world.removeEntity(this);
    },

    /**
     * Enables itself in the world.
     * @method enable
     */
    enable: function() {
      this.world.enableEntity(this);
    },

    /**
     * Disables itself in the world.
     * @method disable
     */
    disable: function() {
      this.world.disableEntity(this);
    },

    /**
     * Add a tag to itself
     * @method tag
     * @return {bb.Entity} itself
     */
    tag: function(name) {
      this.world.tagEntity(this, name);
      return this;
    },

    /**
     * Removes a tag from itself
     * @method untag
     * @return {bb.Entity} itself
     */
    untag: function(name) {
      this.world.untagEntity(this, name);
      return this;
    },

    /**
     * Check if this entity has a tag.
     * @method hasTag
     * @param {String} name the tag name
     * @return {Boolean}
     */
    hasTag: function(name) {
      return this.world.taggedWith(name).has(this);
    }
  });

  return Entity;
})();
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
          return !this.data.ended;
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

        this.data = new Audio;
        this.data.preload = "auto";

        this.data.onload = this.onAudioLoaded.bind(this);
        this.data.onerror = this.onLoadError.bind(this);
        this.data.addEventListener("canplaythrough", this.onAudioLoaded.bind(this), false);
        this.data.addEventListener("error", this.onLoadError.bind(this), false);

        this.data.src = this.url;
        this.data.load();
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
        this.data.loop = !!loop;
      }

      this.data.play();
      this.data.isPaused = false;
    },

    /**
     * Stops the sound.
     *
     * @method stop
     * @param {Boolean} loop the sound should loop
     */
    stop: function() {
      this.data.pause();
      this.data.currentTime = 0;
    },

    /**
     * Pauses the sound.
     *
     * @method pause
     * @param {Boolean} loop the sound should loop
     */
    pause: function() {
      this.data.pause();
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
      this.data.volume = this._volume * bb.Sound.masterVolume;
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
bb.World = (function() {
  "use strict";

  /**
   * The world is where all your entites live, and where all your systems
   * are processed.
   * @class bb.World
   * @property {Array} entities the enabled entities
   * @property {Array} disabledEntities the disabled entities
   * @property {Array} systems the systems your world processes
   */
  var World = bb.Class.extend({
    /**
     * @constructor
     */
    init: function() {
      this.systems = [];

      this.entities = new Set;
      this.disabledEntities = new Set;

      this.addedEntities = new Set;
      this.changedEntities = new Set;
      this.disabledEntities = new Set;
      this.enabledEntities = new Set;
      this.removedEntities = new Set;

      this.components = {};

      this.tags = {};
    },

    /**
     * Notifies and processes all the systems.
     * @method process
     */
    process: function() {
      this.notifySystems();
      this.processSystems();
    },

    /**
     * Helper method to yield all the systems with all the entities.
     * @method check
     * @private
     */
    check: function(entities, action) {
      if (entities.size) {
        var systems = this.systems;

        entities.forEach(function(entity) {
          systems.forEach(function(system) {
            action(entity, system);
          });
        });

        entities.clear();
      }
    },

    /**
     * Notifies the systems about entities added, changed, disabled,
     * enabled and removed.
     * @method notifySystems
     */
    notifySystems: function() {
      this.check(this.addedEntities, function(entity, system) {
        system.entityAdded(entity);
      });

      this.check(this.changedEntities, function(entity, system) {
        system.entityChanged(entity);
      });

      this.check(this.disabledEntities, function(entity, system) {
        system.entityDisabled(entity);
      });

      this.check(this.enabledEntities, function(entity, system) {
        system.entityEnabled(entity);
      });

      this.check(this.removedEntities, function(entity, system) {
        system.entityRemoved(entity);
      });
    },

    /**
     * Processes all the systems.
     * @method processSystems
     */
    processSystems: function() {
      for (var i = 0, length = this.systems.length; i < length; i++) {
        var system = this.systems[i];
        if (system.shouldProcess()) system.process();
      }
    },

    /**
     * Creates a new entity and adds it to the world.
     * @method createEntity
     */
    createEntity: function() {
      var entity = new bb.Entity(this);
      this.addEntity(entity);
      return entity;
    },

    /**
     * Adds an entity to the world.
     * @method addEntity
     * @param {bb.Entity} entity
     */
    addEntity: function(entity) {
      this.entities.add(entity);
      this.addedEntities.add(entity);
    },

    /**
     * Adds a system to the world
     * @method addSystem
     * @param {bb.System} system
     * @return {bb.World} this world
     */
    addSystem: function(system) {
      system.world = this;
      this.systems.push(system);
      return this;
    },

    /**
     * Removes an entity from the world.
     * @method removeEntity
     * @param {bb.Entity} entity
     */
    removeEntity: function(entity) {
      this.entities.delete(entity);
      this.removedEntities.add(entity);

      for (var tag in this.tags) {
        this.tags[tag].delete(entity);
      }
    },

    /**
     * Changes an entity
     * @method changeEntity
     * @param {bb.Entity} entity
     */
    changeEntity: function(entity) {
      this.changedEntities.add(entity);
    },

    /**
     * Enable an entity of the world.
     * @method enableEntity
     * @param {bb.Entity} entity
     */
    enableEntity: function(entity) {
      this.enabledEntities.add(entity);
    },

    /**
     * Disable an entity of the world.
     * @method disableEntity
     * @param {bb.Entity} entity
     */
    disableEntity: function(entity) {
      this.disabledEntities.add(entity);
    },

    /**
     * Add a component to an entity.
     * @method addEntityComponent
     * @param {bb.Entity} entity
     * @param {bb.Component} component
     * @return {bb.Component} the component added to the entity
     */
    addEntityComponent: function(entity, component) {
      var components = this.getComponentsByType(component.type);
      components[entity.id] = component;
      this.changeEntity(entity);
      return component;
    },

    /**
     * Add a component to an entity.
     * @method getEntityComponent
     * @param {bb.Entity} entity
     * @param {String} componentType the type of the component
     * @return {bb.Component} the component or undefined if it is not found
     */
    getEntityComponent: function(entity, componentType) {
      var components = this.getComponentsByType(componentType);

      for (var entityId in components) {
        if (entityId == entity.id) {
          return components[entityId];
        }
      }
    },

    /**
     * Retrives all the components of an entity.
     * @method getEntityComponents
     * @param {bb.Entity} entity
     * @return {Array} all the components the entity has
     */
    getEntityComponents: function(entity) {
      var components = [];

      for (var type in this.components) {
        for (var entityId in this.components[type]) {
          if (entityId == entity.id) {
            components.push(this.components[type][entityId]);
          }
        }
      }

      return components;
    },

    /**
     * Removes a component from an entity.
     * @method removeEntityComponent
     * @param {bb.Entity} entity
     * @param {bb.Component} component
     */
    removeEntityComponent: function(entity, component) {
      this.changeEntity(entity);
      delete this.components[component.type][entity.id];
    },

    /**
     * Gets all the components of the specified type.
     * @method getComponentsByType
     * @private
     * @param {String} componentType
     * @return {Object} components of the specified type
     */
    getComponentsByType: function(componentType) {
      if (!this.components[componentType]) {
        this.components[componentType] = {}
      }
      return this.components[componentType];
    },

    /**
     * Tags an entity.
     *
     * @method tagEntity
     * @param {bb.Entity} entity
     * @param {String} tag
     */
    tagEntity: function(entity, tag) {
      if (typeof this.tags[tag] == "undefined") {
        this.tags[tag] = new Set;
      }

      this.tags[tag].add(entity);
    },

    /**
     * Retrives the entities with the specified tag.
     *
     * @method taggedWith
     * @param {String} tag
     * @return {Set} entities with this tag
     */
    taggedWith: function(tag) {
      return this.tags[tag] || new Set;
    },

    /**
     * Removes the tag from an entity.
     *
     * @method untagEntity
     * @param {String} tag
     */
    untagEntity: function(entity, tag) {
      var entities = this.tags[tag];
      if (entities) {
        entities.delete(entity);
      }
    }
  });

  return World;
})();
bb.System = (function() {
  "use strict";

  /**
   * The base System class, that already handles all the world events.
   *
   * A System processes the components of entities and manipulates them.
   * We can say that a System is where we define the "how" the things works,
   * different from the components, where we define the "what" the things are.
   *
   * @class bb.System
   * @example
   *     var GravitySystem = bb.System.extend({
   *       var STANDARD_GRAVITY = 0.9;
   *
   *       allowEntity: function(entity) {
   *         // Only allow entities that have both onAir and velocity components
   *         return entity.hasComponent("onAir") && entity.hasComponent("velocity");
   *       },
   *
   *       // Apply gravity to all entities on this system.
   *       process: function() {
   *         this.entities.forEach(function(entity) {
   *           entity.velocity.y += STANDARD_GRAVITY;
   *         });
   *       }
   *     });
   */
  var System = bb.Class.extend({
    /**
     * @constructor
     */
    init: function() {
      this.entities = new Set;
    },

    /**
     * Process a game tick.
     * @method process
     */
    process: function() {},

    /**
     * Checks if an entity should belong to this system.
     *
     * You should override this method on your own systems.
     *
     * @method allowEntity
     * @param {bb.Entity} entity
     * @return {Boolean} true if the entity should belong to this system.
     */
    allowEntity: function(entity) {
      throw "Not implemented";
    },

    /**
     * Checks if this system should be processed.
     * @method shouldProcess
     */
    shouldProcess: function() {
      return true;
    },

    /**
     * Callback that is called when an entity is added to this system.
     * @event onEntityAdd
     * @param {bb.Entity} entity
     */
    onEntityAdd: function(entity) {},

    /**
     * Callback that is called when an entity of this system is changed.
     * @event onEntityChange
     * @param {bb.Entity} entity
     */
    onEntityChange: function(entity) {},

    /**
     * Callback that is called when an entity of this system is removed.
     * @event onEntityRemoval
     * @param {bb.Entity} entity
     */
    onEntityRemoval: function(entity) {},

    /**
     * Callback that is called when an entity of this system is enabled.
     * @event onEntityEnable
     * @param {bb.Entity} entity
     */
    onEntityEnable: function(entity) {},

    /**
     * Callback that is called when an entity of this system is disabled.
     * @event onEntityDisable
     * @param {bb.Entity} entity
     */
    onEntityDisable: function(entity) {},

    /**
     * Adds the entity to this system and fires the callbacks.
     * @method addEntity
     * @private
     * @param {bb.Entity} entity
     */
    addEntity: function(entity) {
      if (this.entities.has(entity)) {
        this.entities.add(entity);
      } else {
        this.entities.add(entity);
        this.onEntityAdd(entity);
      }
    },

    /**
     * Removes the entity from this system and fires the callbacks.
     * @method removeEntity
     * @private
     * @param {bb.Entity} entity
     */
    removeEntity: function(entity) {
      if (this.entities.delete(entity)) {
        this.onEntityRemoval(entity);
      }
    },

    /**
     * Everytime a entity is added to the world, it calls this method, to
     * check if the entity should be added to this system.
     *
     * @method entityAdded
     * @param {bb.Entity} entity
     */
    entityAdded: function(entity) {
      if (this.allowEntity(entity)) {
        this.addEntity(entity);
      }
    },

    /**
     * Everytime a entity is removed to the world, this method is called,
     * so we can remove (or not) the entity from this system.
     *
     * @method entityRemoved
     * @param {bb.Entity} entity
     */
    entityRemoved: function(entity) {
      this.removeEntity(entity);
    },

    /**
     * Everytime we add or remove a component from an entity in the world,
     * this method will be called to check if the entity should belong
     * to this system or not.
     *
     * @method entityChanged
     * @param {bb.Entity} entity
     */
    entityChanged: function(entity) {
      if (this.allowEntity(entity)) {
        if (this.entities.has(entity)) {
          this.onEntityChange(entity);
        } else {
          this.addEntity(entity);
        }
      } else {
        this.removeEntity(entity);
      }
    },

    /**
     * Everytime a entity is enabled in the world, this method is called.
     * @method entityEnabled
     * @param {bb.Entity} entity
     */
    entityEnabled: function(entity) {
      if (this.allowEntity(entity)) {
        this.entities.add(entity);
        this.onEntityEnable(entity);
      }
    },

    /**
     * Everytime a entity is disabled in the world, this method is called.
     * @method entityDisabled
     * @param {bb.Entity} entity
     */
    entityDisabled: function(entity) {
      if (this.entities.delete(entity)) {
        this.onEntityDisable(entity);
      }
    }
  });

  return System;
})();
bb.VoidSystem = (function() {
  /**
   * This system processes no entities, but still gets invoked.
   * You can use this system if you need to execute some game logic
   * that doesn't concern about entities.
   *
   * @class bb.VoidSystem
   */
  var VoidSystem = bb.System.extend({
    allowEntity: function() {},
    entityAdded: function() {},
    entityRemoved: function() {},
    entityChanged: function() {},
    entityEnabled: function() {},
    entityDisabled: function() {}
  });

  return VoidSystem;
})();
bb.InputSystem = (function() {
  "use strict";

  var InputSystem = bb.System.extend({
    init: function(container) {
      this.parent();
      this.activeCommands = {};
      this.container = container;
      this.mouse = { x: 0, y: 0 };
      this.pmouse = { x: 0, y: 0 };
    },

    /**
     * Allows only entities that have an input component.
     */
    allowEntity: function(entity) {
      return entity.hasComponent("input");
    },

    /**
     * Starts to capture keyboard inputs.
     *
     * @method startKeyboardCapture
     * @param {EventTarget} container the container that this input is handling.
     */
    startKeyboardCapture: function() {
      this.container.addEventListener("keydown", this.keyDown.bind(this), false);
      this.container.addEventListener("keyup", this.keyUp.bind(this), false);
    },

    /**
     * Starts to capture mouse position.
     *
     * @method startMouseCapture
     * @param {EventTarget} container the container that this input is handling.
     *   This is important as the mouse coordinates will be translated to a relative location
     *   of the container area.
     */
    startMouseCapture: function() {
      this.container.addEventListener("mouseup", this.mouseUp.bind(this), false);
      this.container.addEventListener("mousemove", this.mouseMove.bind(this), false);
      this.container.addEventListener("mousedown", this.mouseDown.bind(this), false);
    },

    /**
     * Checks if a given action is active.
     *
     * @method isPressing
     * @param {Integer} keyCode the keycode
     * @returns {Boolean} the action is active or not.
     */
    isPressing: function(keyCode) {
      return this.activeCommands[keyCode] || false;
    },

    /**
     * Handles the browser keyDown event and adds the pressed
     * key to the activeCommands list.
     *
     * @method keyDown
     * @private
     */
    keyDown: function(event) {
      var keyCode = event.which || event.keyCode;
      this.activeCommands[keyCode] = true;
    },

    /**
     * Handles the browser keyDown event and removes the pressed
     * key from the activeCommands list.
     *
     * @method onKeyDown
     * @private
     */
    keyUp: function(event) {
      var keyCode = event.which || event.keyCode;
      delete this.activeCommands[keyCode];
    },

    /**
     * Handles the browser mouseDown event and adds the pressed
     * button to the activeCommands list.
     *
     * @method mouseDown
     * @private
     */
    mouseDown: function(event) {
      var button = event.which || event.button;
      this.activeCommands[button] = true;
    },

    /**
     * Handles the browser mouseDown event and removes the pressed
     * button from the activeCommands list.
     *
     * @method mouseUp
     * @private
     */
    mouseUp: function(event) {
      var button = event.which || event.button;
      delete this.activeCommands[button];
    },

    /**
     * Handles the browser mouseMove event and stores the current
     * mouse position in the mouse property, and the old position
     * to the pmouse property.
     *
     * @method mouseMove
     * @private
     */
    mouseMove: function(event) {
      this.pmouse = this.mouse.clone();

      if (event.offsetX) {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
      } else {
        var clientRect = this.container.getBoundingClientRect();
        this.mouse.x = event.pageX - Math.round(clientRect.left + window.pageXOffset);
        this.mouse.y = event.pageY - Math.round(clientRect.top + window.pageYOffset);
      }
    }
  });

  return InputSystem;
})();
bb.Component = (function() {
  "use strict";

  /**
   * A basic component class.
   *
   * Note that you dont't necessary need to subclass this to create
   * your own components, as any objects which responds to `type`
   * is considered a valid component.
   *
   * @class bb.Component
   * @property {String} type
   */
  var Component = bb.Class.extend({
    type: "component"
  });

  return Component;
})();
bb.InputComponent = (function() {
  "use strict";

  var InputComponent = bb.Component.extend({
    type: "input",

    init: function(input) {
      this.input = input;
      this.mappings = {};
    },

    /**
     * Binds a key to a action.
     *
     * Note that you can bind different keys for the same action,
     * but you CAN'T bind two or more actions for the same key.
     *
     * @method add
     * @param {bb.KEY} key the key which will activate this action.
     * @param {String} action the action to be activate when the informed
     *   key is pressed.
     * @return {bb.InputComponent} itself
     *
     * @example
     *     input.bind(bb.KEY.SPACE, "jump");
     *
     *     // Binding the same action to different keys
     *     input.bind(bb.KEY.D, "walk forward");
     *     input.bind(bb.KEY.RIGHT, "walk forward");
     */
    add: function(key, action) {
      this.mappings[key] = action;
      return this;
    },

    /**
     * Unbinds a given key
     * @method unbind
     * @param {bb.KEY} key the key that will be unbinded
     */
    remove: function(action) {
      for (var key in this.mappings) {
        if (this.mappings[key] == action) {
          delete this.mappings[key];
        }
      }
    },

    /**
     * Returns the key of an action.
     * @method action
     * @param {String} action the action name
     */
    action: function(actionName) {
      for (var key in this.mappings) {
        if (this.mappings[key] == actionName) {
          return key;
        }
      }
    }
  });

  return InputComponent;
})();
