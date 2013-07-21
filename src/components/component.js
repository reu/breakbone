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
