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
