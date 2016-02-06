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
