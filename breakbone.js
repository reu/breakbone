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
/**
 * Class based on (Jonh Resig)[http://ejohn.org/blog/simple-javascript-inheritance/]
 * and Impactjs implementation.
 *
 * @class bb.Class
 * @constructor
 */
bb.Class = function Class() {}

/**
 * Extends a class.
 * You can call the function `this.parent` when overriding methods
 * to refer to the same method of the superclass.
 *
 * @method extend
 * @property {Object} properties the properties of the new class
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
bb.Class.extend = function(properties) {
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

  return Class;
}
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
/**
 * A entity represent every "thing" of your game.
 *
 * @class bb.Entity
 * @property {bb.World} world world that this entity belongs to
 * @property {Number} id the unique id of this entity
 */
bb.Entity = bb.Class.extend({
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
});
/**
 * The Input class is responsible to organize and capture input
 * from the various sorces (keyboard, mouse, touch devices, gamepads).
 *
 * @class bb.Input
 *
 * @property {Object} mouse the current mouse position.
 * @property {Object} pmouse the past mouse position.
 */
bb.Input = bb.Class.extend({
  /**
   * @constructor
   */
  init: function() {
    this.bindings = {};
    this.activeCommands = {};

    this.mouse  = { x: 0, y: 0 };
    this.pmouse = { x: 0, y: 0 };
  },

  /**
   * Starts to capture keyboard inputs.
   *
   * @method startKeyboardCapture
   * @param {EventTarget} container the container that this input is handling.
   */
  startKeyboardCapture: function(container) {
    container = container || window;

    container.addEventListener("keydown", this.onKeyDown.bind(this), false);
    container.addEventListener("keyup", this.onKeyUp.bind(this), false);
  },

  /**
   * Starts to capture mouse position.
   *
   * @method startMouseCapture
   * @param {EventTarget} container the container that this input is handling.
   *   This is important as the mouse coordinates will be translated to a relative location
   *   of the container area.
   */
  startMouseCapture: function(container) {
    container = container || window;

    container.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    container.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    container.addEventListener("mousedown", this.onMouseDown.bind(this), false);
  },

  /**
   * Binds a key to a action.
   *
   * Note that you can bind different keys for the same action,
   * but you CAN'T bind two or more actions for the same key.
   *
   * @method bind
   * @param {bb.KEY} key the key which will activate this action.
   * @param {String} action the action to be activate when the informed
   *   key is pressed.
   *
   * @example
   *     input.bind(bb.KEY.SPACE, "jump");
   *
   *     // Binding the same action to different keys
   *     input.bind(bb.KEY.D, "walk forward");
   *     input.bind(bb.KEY.RIGHT, "walk forward");
   */
  bind: function bind(key, action) {
    this.bindings[key] = action;
  },

  /**
   * Checks if a given action is active.
   *
   * @method isPressed
   * @param {String} action
   * @returns {Boolean} the actions is active or not.
   *
   * @example
   *     input.isPressed("jump");
   */
  isPressed: function(action) {
    for (var key in this.activeCommands) {
      if (this.activeCommands[key] && this.bindings[key] == action)
        return true;
    }

    return false;
  },

  /**
   * Handles the browser keyDown event and adds the pressed
   * key to the activeCommands list.
   *
   * @method onKeyDown
   * @private
   */
  onKeyDown: function(event) {
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
  onKeyUp: function(event) {
    var keyCode = event.which || event.keyCode;
    delete this.activeCommands[keyCode];
  },

  /**
   * Handles the browser mouseDown event and adds the pressed
   * button to the activeCommands list.
   *
   * @method onMouseDown
   * @private
   */
  onMouseDown: function(event) {
    var button = event.which || event.button;
    this.activeCommands[button] = true;
  },

  /**
   * Handles the browser mouseDown event and removes the pressed
   * button from the activeCommands list.
   *
   * @method onMouseUp
   * @private
   */
  onMouseUp: function(event) {
    var button = event.which || event.button;
    delete this.activeCommands[button];
  },

  /**
   * Handles the browser mouseMove event and stores the current
   * mouse position in the mouse property, and the old position
   * to the pmouse property.
   *
   * @method onMouseMove
   * @private
   */
  onMouseMove: function(event) {
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

/**
 * The list of all the supported keys.
 *
 * @property {Object} KEY
 * @static
 */
bb.KEY = {
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
  bb.KEY[letters[i]] = i + 65;
}

for (var number = 0; number <= 9; number++) {
  bb.KEY["NUMBER" + number] = number + 48;
}
/**
 * The world is where all your entites live, and where all your systems
 * are processed.
 * @class bb.World
 * @property {Array} entities the enabled entities
 * @property {Array} disabledEntities the disabled entities
 * @property {Array} systems the systems your world processes
 */
bb.World = bb.Class.extend({
  /**
   * @constructor
   */
  init: function() {
    this.systems = [];

    this.entities = [];
    this.disabledEntities = [];

    this.addedEntities = [];
    this.changedEntities = [];
    this.disabledEntities = [];
    this.enabledEntities = [];
    this.removedEntities = [];

    this.components = {};
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
    if (entities.length) {
      for (var i = 0, length = entities.length; i < length; i++) {
        for (var j = 0; j < this.systems.length; j++) {
          action(entities[i], this.systems[i]);
        }
      }

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
      this.systems[i].process();
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
    this.entities.push(entity);
    this.addedEntities.push(entity);
  },

  /**
   * Adds a system to the world
   * @method addSystem
   * @param {bb.System} system
   */
  addSystem: function(system) {
    this.systems.push(system);
  },

  /**
   * Removes an entity from the world.
   * @method removeEntity
   * @param {bb.Entity} entity
   */
  removeEntity: function(entity) {
    this.entities.remove(entity);
    this.removedEntities.push(entity);
  },

  /**
   * Changes an entity
   * @method changeEntity
   * @param {bb.Entity} entity
   */
  changeEntity: function(entity) {
    this.changedEntities.push(entity);
  },

  /**
   * Enable an entity of the world.
   * @method enableEntity
   * @param {bb.Entity} entity
   */
  enableEntity: function(entity) {
    this.enabledEntities.push(entity);
  },

  /**
   * Disable an entity of the world.
   * @method disableEntity
   * @param {bb.Entity} entity
   */
  disableEntity: function(entity) {
    this.disabledEntities.push(entity);
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
  }
});
/**
 * The base System class, that already handles all the world events.
 *
 * A System processes the components of entities and manipuletes them.
 * We can say that a System is where we define the "how" the things works,
 * differente of the components, where we define the "what" the things are.
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
bb.System = bb.Class.extend({
  /**
   * @constructor
   */
  init: function() {
    this.entities = new bb.Set;
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
    if (this.entities.add(entity)) {
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
    if (this.entities.remove(entity)) {
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
      if (this.entities.contains(entity)) {
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
    if (this.entities.remove(entity)) {
      this.onEntityDisable(entity);
    }
  }
});
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
bb.Component = bb.Class.extend({
  type: "component",

  /**
   * @constructor
   * @param {String} type
   */
  init: function(type) {
    this.type = type;
  }
});
