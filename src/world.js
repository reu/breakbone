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

      this.components = {};

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
      components[entity.id] = component;
      this.changeEntity(entity);
      return component;
    }

    /**
     * Add a component to an entity.
     * @method getEntityComponent
     * @param {bb.Entity} entity
     * @param {String} componentType the type of the component
     * @return {bb.Component} the component or undefined if it is not found
     */
    getEntityComponent(entity, componentType) {
      var components = this.getComponentsByType(componentType);

      for (var entityId in components) {
        if (entityId == entity.id) {
          return components[entityId];
        }
      }
    }

    /**
     * Retrives all the components of an entity.
     * @method getEntityComponents
     * @param {bb.Entity} entity
     * @return {Array} all the components the entity has
     */
    getEntityComponents(entity) {
      var components = [];

      for (var type in this.components) {
        for (var entityId in this.components[type]) {
          if (entityId == entity.id) {
            components.push(this.components[type][entityId]);
          }
        }
      }

      return components;
    }

    /**
     * Removes a component from an entity.
     * @method removeEntityComponent
     * @param {bb.Entity} entity
     * @param {bb.Component} component
     */
    removeEntityComponent(entity, component) {
      this.changeEntity(entity);
      delete this.components[component.type][entity.id];
    }

    /**
     * Gets all the components of the specified type.
     * @method getComponentsByType
     * @private
     * @param {String} componentType
     * @return {Object} components of the specified type
     */
    getComponentsByType(componentType) {
      if (!this.components[componentType]) {
        this.components[componentType] = {}
      }
      return this.components[componentType];
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
