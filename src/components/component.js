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
