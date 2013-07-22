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

      this.entities = new bb.Set;
      this.disabledEntities = new bb.Set;

      this.addedEntities = new bb.Set;
      this.changedEntities = new bb.Set;
      this.disabledEntities = new bb.Set;
      this.enabledEntities = new bb.Set;
      this.removedEntities = new bb.Set;

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
      this.systems.push(system);
      return this;
    },

    /**
     * Removes an entity from the world.
     * @method removeEntity
     * @param {bb.Entity} entity
     */
    removeEntity: function(entity) {
      this.entities.remove(entity);
      this.removedEntities.add(entity);
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
    }
  });

  return World;
})();
