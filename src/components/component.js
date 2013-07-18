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
