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
