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
      return this.world.taggedWith(name).contains(this);
    }
  });

  return Entity;
})();
