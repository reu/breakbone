bb.InputSystem = (function() {
  "use strict";

  var InputSystem = bb.System.extend({
    init: function(container) {
      this.parent();
      this.activeCommands = {};
      this.container = container;
      this.mouse = { x: 0, y: 0 };
      this.pmouse = { x: 0, y: 0 };
    },

    /**
     * Allows only entities that have an input component.
     */
    allowEntity: function(entity) {
      return entity.hasComponent("input");
    },

    /**
     * Starts to capture keyboard inputs.
     *
     * @method startKeyboardCapture
     * @param {EventTarget} container the container that this input is handling.
     */
    startKeyboardCapture: function() {
      this.container.addEventListener("keydown", this.keyDown.bind(this), false);
      this.container.addEventListener("keyup", this.keyUp.bind(this), false);
    },

    /**
     * Starts to capture mouse position.
     *
     * @method startMouseCapture
     * @param {EventTarget} container the container that this input is handling.
     *   This is important as the mouse coordinates will be translated to a relative location
     *   of the container area.
     */
    startMouseCapture: function() {
      this.container.addEventListener("mouseup", this.mouseUp.bind(this), false);
      this.container.addEventListener("mousemove", this.mouseMove.bind(this), false);
      this.container.addEventListener("mousedown", this.mouseDown.bind(this), false);
    },

    /**
     * Checks if a given action is active.
     *
     * @method isPressing
     * @param {Integer} keyCode the keycode
     * @returns {Boolean} the action is active or not.
     */
    isPressing: function(keyCode) {
      return this.activeCommands[keyCode] || false;
    },

    /**
     * Handles the browser keyDown event and adds the pressed
     * key to the activeCommands list.
     *
     * @method keyDown
     * @private
     */
    keyDown: function(event) {
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
    keyUp: function(event) {
      var keyCode = event.which || event.keyCode;
      delete this.activeCommands[keyCode];
    },

    /**
     * Handles the browser mouseDown event and adds the pressed
     * button to the activeCommands list.
     *
     * @method mouseDown
     * @private
     */
    mouseDown: function(event) {
      var button = event.which || event.button;
      this.activeCommands[button] = true;
    },

    /**
     * Handles the browser mouseDown event and removes the pressed
     * button from the activeCommands list.
     *
     * @method mouseUp
     * @private
     */
    mouseUp: function(event) {
      var button = event.which || event.button;
      delete this.activeCommands[button];
    },

    /**
     * Handles the browser mouseMove event and stores the current
     * mouse position in the mouse property, and the old position
     * to the pmouse property.
     *
     * @method mouseMove
     * @private
     */
    mouseMove: function(event) {
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

  return InputSystem;
})();
