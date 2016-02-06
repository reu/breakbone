bb = (function() {
  "use strict";

  /**
   * @module bb
   */
  var bb = {};
  return bb;
})();
bb.Vector = (function() {
  "use strict";

  class Vector {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }

    subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }

    multiply(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }

    divide(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    }

    lengthSquared() {
      return this.x * this.x + this.y * this.y;
    }

    length() {
      return Math.sqrt(this.lengthSquared());
    }

    normalize() {
      var length = this.length();
      if (length > 0 && length != 1) this.divide(length);
      return this;
    }

    limit(max) {
      if (this.length() > max) return this.normalize() && this.multiply(max);
    }

    dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }

    distance(vector) {
      var dx = this.x - vector.x,
          dy = this.y - vector.y;

      return Math.sqrt(dx * dx + dy * dy);
    }

    reverse() {
      this.x *= -1;
      this.y *= -1;
      return this;
    }

    clone() {
      return new Vector(this.x, this.y);
    }

    toString() {
      return "(" + ([this.x, this.y].join(", ")) + ")";
    }
  };

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
bb.Entity = (function() {
  "use strict";

  var nextObjectId = 0;

  /**
   * A entity represent every "thing" of your game.
   *
   * @class bb.Entity
   * @property {bb.World} world world that this entity belongs to
   * @property {Number} id the unique id of this entity
   */
  class Entity {
    /**
     * @constructor
     * @param {bb.World} world
     */
    constructor(world) {
      Object.defineProperty(this, "id", {
        enumerable: true,
        writable: false,
        configurable: false,
        value: nextObjectId++
      });

      this.world = world;
    }

    /**
     * Checks if the entity contains the specified component type.
     *
     * @method hasComponent
     * @param {String} componentType
     * @return {Boolean} true if the entity contains the specified component
     */
    hasComponent(componentType) {
      return !!this.getComponent(componentType);
    }

    /**
     * Adds a new component to this entity.
     *
     * @method addComponent
     * @param {bb.Component}
     * @return {bb.Entity} itself
     */
    addComponent(component) {
      this.world.addEntityComponent(this, component);

      Object.defineProperty(this, component.type, {
        enumerable: false,
        configurable: true,
        writable: false,
        value: component
      });

      return this;
    }

    /**
     * Returns the list of components this entitiy has.
     *
     * @method getComponents
     * @return {Array} components
     */
    getComponents() {
      return this.world.getEntityComponents(this);
    }

    /**
     * Gets the component of a specific type.
     *
     * @method getComponent
     * @param {String} componentType
     * @return {bb.Component}
     */
    getComponent(componentType) {
      return this.world.getEntityComponent(this, componentType);
    }

    /**
     * Removes a component from this entity.
     *
     * @method removeComponent
     * @param {bb.Component | String} componentOrType
     * @return {bb.Entity} itself
     */
    removeComponent(component) {
      if (typeof component == "string") {
        component = this.getComponent(component);
      }

      this.world.removeEntityComponent(this, component);
      delete this[component.type];

      return this;
    }

    /**
     * Removes itself from the world.
     * @method remove
     */
    remove() {
      this.world.removeEntity(this);
    }

    /**
     * Enables itself in the world.
     * @method enable
     */
    enable() {
      this.world.enableEntity(this);
    }

    /**
     * Disables itself in the world.
     * @method disable
     */
    disable() {
      this.world.disableEntity(this);
    }

    /**
     * Add a tag to itself
     * @method tag
     * @return {bb.Entity} itself
     */
    tag(name) {
      this.world.tagEntity(this, name);
      return this;
    }

    /**
     * Removes a tag from itself
     * @method untag
     * @return {bb.Entity} itself
     */
    untag(name) {
      this.world.untagEntity(this, name);
      return this;
    }

    /**
     * Check if this entity has a tag.
     * @method hasTag
     * @param {String} name the tag name
     * @return {Boolean}
     */
    hasTag(name) {
      return this.world.taggedWith(name).has(this);
    }
  };

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
  class Image {
    /**
     * @constructor
     * @param {String} url the path to the image
     */
    constructor(url) {
      this.url = url;
      this.isLoaded = false;
    }

    /**
     * Loads a image and executes the callback when loaded.
     *
     * @method load
     * @param {Function} onLoadCallback callback that will be
     *     called when the image is loaded
     */
    load(onLoadCallback) {
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
    }

    /**
     * @method onImageLoaded
     * @private
     */
    onImageLoaded(event) {
      this.data = event.srcElement;
      this.width = this.data.width;
      this.height = this.data.height;
      this.isLoaded = true;

      if (this.onLoadCallback) {
        this.onLoadCallback(this);
      }
    }

    /**
     * @method onLoadError
     * @private
     */
    onLoadError() {
      throw "Error while loading image: " + this.url;
    }
  };

  return Image;
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
  class Loader {
    /**
     * @constructor
     */
    constructor() {
      this.resources = [];
      this.loadedCount = 0;

      this.onProgress = function(percentage, count) {};
      this.onFinish = function() {};
    }

    /**
     * Adds resources to the loading queue.
     *
     * @method add
     * @param {Arguments} resources
     */
    add() {
      for (var i = 0; i < arguments.length; i++) {
        var resource = arguments[i];

        if (typeof resource.load == "function") {
          this.resources.push(resource);
        } else {
          throw "Invalid resource.";
        }
      }
      return this;
    }

    /**
     * Loads all the resources and fires the callback when finished.
     *
     * @method load
     * @param {Function} callback
     */
    load(callback) {
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
    }

    /**
     * Event fired when each resource is loaded.
     * @event onProgress
     */
    onProgress(percentage, count) {}

    /**
     * Event fired when all the resources are loaded.
     * @event onFinish
     */
    onFinish() {}
  };

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
  class Sound {
    /**
     * @constructor
     * @param {String} url the path to the sound file
     */
    constructor(url) {
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
    }

    /**
     * Loads a sound file and executes the callback when loaded.
     *
     * @method load
     * @param {Function} onLoadCallback callback that will be
     *     called when the sound file is loaded
     */
    load(onLoadCallback) {
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
    }

    /**
     * Plays the sound file.
     *
     * @method play
     * @param {Boolean} loop the sound should loop
     */
    play(loop) {
      if (!this.isLoaded) return;
      if (typeof loop != "undefined" && typeof loop != "null") {
        this.data.loop = !!loop;
      }

      this.data.play();
      this.data.isPaused = false;
    }

    /**
     * Stops the sound.
     *
     * @method stop
     * @param {Boolean} loop the sound should loop
     */
    stop() {
      this.data.pause();
      this.data.currentTime = 0;
    }

    /**
     * Pauses the sound.
     *
     * @method pause
     * @param {Boolean} loop the sound should loop
     */
    pause() {
      this.data.pause();
      this.isPaused = true;
    }

    /**
     * Pauses the sound.
     *
     * @method setVolume
     * @private
     * @param {Number} volume the volume of this sound, from 0 to 1
     */
    setVolume(volume) {
      this._volume = volume;
      this.data.volume = this._volume * bb.Sound.masterVolume;
    }

    /**
     * Get the sound volume.
     *
     * @method getVolume
     * @private
     * @return {Number} the volume of this sound, from 0 to 1
     */
    getVolume() {
      return this._volume;
    }

    /**
     * @method onAudioLoaded
     * @private
     */
    onAudioLoaded(event) {
      this.isLoaded = true;
      this.setVolume(this.volume);

      bb.Sound.sounds.push(this);

      if (this.onLoadCallback) {
        this.onLoadCallback(this);
      }
    }

    /**
     * @method onLoadError
     * @private
     */
    onLoadError() {
      throw "Error while loading sound: " + this.url;
    }
  };

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
  class World {
    /**
     * @constructor
     */
    constructor() {
      this.systems = [];

      this.entities = new Set;
      this.disabledEntities = new Set;

      this.addedEntities = new Set;
      this.changedEntities = new Set;
      this.disabledEntities = new Set;
      this.enabledEntities = new Set;
      this.removedEntities = new Set;

      this.components = new Map;
      this.tags = {};
    }

    /**
     * Notifies and processes all the systems.
     * @method process
     */
    process() {
      this.notifySystems();
      this.processSystems();
    }

    /**
     * Helper method to yield all the systems with all the entities.
     * @method check
     * @private
     */
    check(entities, action) {
      if (entities.size) {
        var systems = this.systems;

        entities.forEach(function(entity) {
          systems.forEach(function(system) {
            action(entity, system);
          });
        });

        entities.clear();
      }
    }

    /**
     * Notifies the systems about entities added, changed, disabled,
     * enabled and removed.
     * @method notifySystems
     */
    notifySystems() {
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
    }

    /**
     * Processes all the systems.
     * @method processSystems
     */
    processSystems() {
      for (var i = 0, length = this.systems.length; i < length; i++) {
        var system = this.systems[i];
        if (system.shouldProcess()) system.process();
      }
    }

    /**
     * Creates a new entity and adds it to the world.
     * @method createEntity
     */
    createEntity() {
      var entity = new bb.Entity(this);
      this.addEntity(entity);
      return entity;
    }

    /**
     * Adds an entity to the world.
     * @method addEntity
     * @param {bb.Entity} entity
     */
    addEntity(entity) {
      this.entities.add(entity);
      this.addedEntities.add(entity);
    }

    /**
     * Adds a system to the world
     * @method addSystem
     * @param {bb.System} system
     * @return {bb.World} this world
     */
    addSystem(system) {
      system.world = this;
      this.systems.push(system);
      return this;
    }

    /**
     * Removes an entity from the world.
     * @method removeEntity
     * @param {bb.Entity} entity
     */
    removeEntity(entity) {
      this.entities.delete(entity);
      this.removedEntities.add(entity);

      for (var components of this.components.values()) {
        components.delete(entity);
      }

      for (var tag in this.tags) {
        this.tags[tag].delete(entity);
      }
    }

    /**
     * Changes an entity
     * @method changeEntity
     * @param {bb.Entity} entity
     */
    changeEntity(entity) {
      this.changedEntities.add(entity);
    }

    /**
     * Enable an entity of the world.
     * @method enableEntity
     * @param {bb.Entity} entity
     */
    enableEntity(entity) {
      this.enabledEntities.add(entity);
    }

    /**
     * Disable an entity of the world.
     * @method disableEntity
     * @param {bb.Entity} entity
     */
    disableEntity(entity) {
      this.disabledEntities.add(entity);
    }

    /**
     * Add a component to an entity.
     * @method addEntityComponent
     * @param {bb.Entity} entity
     * @param {bb.Component} component
     * @return {bb.Component} the component added to the entity
     */
    addEntityComponent(entity, component) {
      var components = this.getComponentsByType(component.type);
      components.set(entity, component);
      this.changeEntity(entity);
      return component;
    }

    /**
     * Gets an entity component.
     * @method getEntityComponent
     * @param {bb.Entity} entity
     * @param {String} componentType the type of the component
     * @return {bb.Component} the component or undefined if it is not found
     */
    getEntityComponent(entity, componentType) {
      var components = this.getComponentsByType(componentType);
      return components.get(entity);
    }

    /**
     * Retrives all the components of an entity.
     * @method getEntityComponents
     * @param {bb.Entity} entity
     * @return {Array} all the components the entity has
     */
    getEntityComponents(entity) {
      var entityComponents = [];

      for (var components of this.components.values()) {
        var component = components.get(entity);
        if (component) entityComponents.push(component);
      }

      return entityComponents;
    }

    /**
     * Removes a component from an entity.
     * @method removeEntityComponent
     * @param {bb.Entity} entity
     * @param {bb.Component} component
     */
    removeEntityComponent(entity, component) {
      this.changeEntity(entity);
      return this.getComponentsByType(component.type).delete(entity);
    }

    /**
     * Gets all the components of the specified type.
     * @method getComponentsByType
     * @private
     * @param {String} componentType
     * @return {Object} components of the specified type
     */
    getComponentsByType(componentType) {
      if (!this.components.has(componentType)) {
        this.components.set(componentType, new WeakMap);
      }

      return this.components.get(componentType);
    }

    /**
     * Tags an entity.
     *
     * @method tagEntity
     * @param {bb.Entity} entity
     * @param {String} tag
     */
    tagEntity(entity, tag) {
      if (typeof this.tags[tag] == "undefined") {
        this.tags[tag] = new Set;
      }

      this.tags[tag].add(entity);
    }

    /**
     * Retrives the entities with the specified tag.
     *
     * @method taggedWith
     * @param {String} tag
     * @return {Set} entities with this tag
     */
    taggedWith(tag) {
      return this.tags[tag] || new Set;
    }

    /**
     * Removes the tag from an entity.
     *
     * @method untagEntity
     * @param {String} tag
     */
    untagEntity(entity, tag) {
      var entities = this.tags[tag];
      if (entities) {
        entities.delete(entity);
      }
    }
  };

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
  class System {
    /**
     * @constructor
     */
    constructor() {
      this.entities = new Set;
    }

    /**
     * Process a game tick.
     * @method process
     */
    process() {}

    /**
     * Checks if an entity should belong to this system.
     *
     * You should override this method on your own systems.
     *
     * @method allowEntity
     * @param {bb.Entity} entity
     * @return {Boolean} true if the entity should belong to this system.
     */
    allowEntity(entity) {
      throw "Not implemented";
    }

    /**
     * Checks if this system should be processed.
     * @method shouldProcess
     */
    shouldProcess() {
      return true;
    }

    /**
     * Callback that is called when an entity is added to this system.
     * @event onEntityAdd
     * @param {bb.Entity} entity
     */
    onEntityAdd(entity) {}

    /**
     * Callback that is called when an entity of this system is changed.
     * @event onEntityChange
     * @param {bb.Entity} entity
     */
    onEntityChange(entity) {}

    /**
     * Callback that is called when an entity of this system is removed.
     * @event onEntityRemoval
     * @param {bb.Entity} entity
     */
    onEntityRemoval(entity) {}

    /**
     * Callback that is called when an entity of this system is enabled.
     * @event onEntityEnable
     * @param {bb.Entity} entity
     */
    onEntityEnable(entity) {}

    /**
     * Callback that is called when an entity of this system is disabled.
     * @event onEntityDisable
     * @param {bb.Entity} entity
     */
    onEntityDisable(entity) {}

    /**
     * Adds the entity to this system and fires the callbacks.
     * @method addEntity
     * @private
     * @param {bb.Entity} entity
     */
    addEntity(entity) {
      if (this.entities.has(entity)) {
        this.entities.add(entity);
      } else {
        this.entities.add(entity);
        this.onEntityAdd(entity);
      }
    }

    /**
     * Removes the entity from this system and fires the callbacks.
     * @method removeEntity
     * @private
     * @param {bb.Entity} entity
     */
    removeEntity(entity) {
      if (this.entities.delete(entity)) {
        this.onEntityRemoval(entity);
      }
    }

    /**
     * Everytime a entity is added to the world, it calls this method, to
     * check if the entity should be added to this system.
     *
     * @method entityAdded
     * @param {bb.Entity} entity
     */
    entityAdded(entity) {
      if (this.allowEntity(entity)) {
        this.addEntity(entity);
      }
    }

    /**
     * Everytime a entity is removed to the world, this method is called,
     * so we can remove (or not) the entity from this system.
     *
     * @method entityRemoved
     * @param {bb.Entity} entity
     */
    entityRemoved(entity) {
      this.removeEntity(entity);
    }

    /**
     * Everytime we add or remove a component from an entity in the world,
     * this method will be called to check if the entity should belong
     * to this system or not.
     *
     * @method entityChanged
     * @param {bb.Entity} entity
     */
    entityChanged(entity) {
      if (this.allowEntity(entity)) {
        if (this.entities.has(entity)) {
          this.onEntityChange(entity);
        } else {
          this.addEntity(entity);
        }
      } else {
        this.removeEntity(entity);
      }
    }

    /**
     * Everytime a entity is enabled in the world, this method is called.
     * @method entityEnabled
     * @param {bb.Entity} entity
     */
    entityEnabled(entity) {
      if (this.allowEntity(entity)) {
        this.entities.add(entity);
        this.onEntityEnable(entity);
      }
    }

    /**
     * Everytime a entity is disabled in the world, this method is called.
     * @method entityDisabled
     * @param {bb.Entity} entity
     */
    entityDisabled(entity) {
      if (this.entities.delete(entity)) {
        this.onEntityDisable(entity);
      }
    }
  };

  return System;
})();
bb.VoidSystem = (function() {
  "use strict";

  /**
   * This system processes no entities, but still gets invoked.
   * You can use this system if you need to execute some game logic
   * that doesn't concern about entities.
   *
   * @class bb.VoidSystem
   */
  class VoidSystem extends bb.System {
    allowEntity() {}
    entityAdded() {}
    entityRemoved() {}
    entityChanged() {}
    entityEnabled() {}
    entityDisabled() {}
  };

  return VoidSystem;
})();
bb.InputSystem = (function() {
  "use strict";

  class InputSystem extends bb.System {
    constructor(container) {
      super();
      this.activeCommands = {};
      this.container = container;
      this.mouse = { x: 0, y: 0 };
      this.pmouse = { x: 0, y: 0 };
    }

    /**
     * Allows only entities that have an input component.
     */
    allowEntity(entity) {
      return entity.hasComponent("input");
    }

    /**
     * Starts to capture keyboard inputs.
     *
     * @method startKeyboardCapture
     * @param {EventTarget} container the container that this input is handling.
     */
    startKeyboardCapture() {
      this.container.addEventListener("keydown", this.keyDown.bind(this), false);
      this.container.addEventListener("keyup", this.keyUp.bind(this), false);
    }

    /**
     * Starts to capture mouse position.
     *
     * @method startMouseCapture
     * @param {EventTarget} container the container that this input is handling.
     *   This is important as the mouse coordinates will be translated to a relative location
     *   of the container area.
     */
    startMouseCapture() {
      this.container.addEventListener("mouseup", this.mouseUp.bind(this), false);
      this.container.addEventListener("mousemove", this.mouseMove.bind(this), false);
      this.container.addEventListener("mousedown", this.mouseDown.bind(this), false);
    }

    /**
     * Checks if a given action is active.
     *
     * @method isPressing
     * @param {Integer} keyCode the keycode
     * @returns {Boolean} the action is active or not.
     */
    isPressing(keyCode) {
      return this.activeCommands[keyCode] || false;
    }

    /**
     * Handles the browser keyDown event and adds the pressed
     * key to the activeCommands list.
     *
     * @method keyDown
     * @private
     */
    keyDown(event) {
      var keyCode = event.which || event.keyCode;
      this.activeCommands[keyCode] = true;
    }

    /**
     * Handles the browser keyDown event and removes the pressed
     * key from the activeCommands list.
     *
     * @method onKeyDown
     * @private
     */
    keyUp(event) {
      var keyCode = event.which || event.keyCode;
      delete this.activeCommands[keyCode];
    }

    /**
     * Handles the browser mouseDown event and adds the pressed
     * button to the activeCommands list.
     *
     * @method mouseDown
     * @private
     */
    mouseDown(event) {
      var button = event.which || event.button;
      this.activeCommands[button] = true;
    }

    /**
     * Handles the browser mouseDown event and removes the pressed
     * button from the activeCommands list.
     *
     * @method mouseUp
     * @private
     */
    mouseUp(event) {
      var button = event.which || event.button;
      delete this.activeCommands[button];
    }

    /**
     * Handles the browser mouseMove event and stores the current
     * mouse position in the mouse property, and the old position
     * to the pmouse property.
     *
     * @method mouseMove
     * @private
     */
    mouseMove(event) {
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
  };

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
  class Component {
    get type() {
      var name = this.constructor.name.replace("Component", "");
      if (name.length == 0) {
        throw new Error("You must define a component `type`");
      } else {
        return name[0].toLowerCase() + name.slice(1);
      }
    }
  };

  return Component;
})();
bb.InputComponent = (function() {
  "use strict";

  class InputComponent extends bb.Component {
    constructor(input) {
      super();
      this.input = input;
      this.mappings = {};
    }

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
    add(key, action) {
      this.mappings[key] = action;
      return this;
    }

    /**
     * Unbinds a given key
     * @method unbind
     * @param {bb.KEY} key the key that will be unbinded
     */
    remove(action) {
      for (var key in this.mappings) {
        if (this.mappings[key] == action) {
          delete this.mappings[key];
        }
      }
    }

    /**
     * Returns the key of an action.
     * @method action
     * @param {String} action the action name
     */
    action(actionName) {
      for (var key in this.mappings) {
        if (this.mappings[key] == actionName) {
          return key;
        }
      }
    }
  };

  return InputComponent;
})();
