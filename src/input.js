bb.Input = (function() {
  "use strict";

  /**
   * The Input class is organizes and capture input from many
   * input sorces, such as the keyboard, mouse, touch screens
   * and gamepads.
   *
   * @class bb.Input
   * @property {Object} mouse the current mouse position.
   * @property {Object} pmouse the past mouse position.
   */
  var Input = bb.Class.extend({
    /**
     * @constructor
     */
    init: function() {
      this.bindings = {};
      this.activeCommands = {};

      this.mouse  = { x: 0, y: 0 };
      this.pmouse = { x: 0, y: 0 };
    },

    /**
     * Starts to capture keyboard inputs.
     *
     * @method startKeyboardCapture
     * @param {EventTarget} container the container that this input is handling.
     */
    startKeyboardCapture: function(container) {
      container = container || window;

      container.addEventListener("keydown", this.onKeyDown.bind(this), false);
      container.addEventListener("keyup", this.onKeyUp.bind(this), false);
    },

    /**
     * Starts to capture mouse position.
     *
     * @method startMouseCapture
     * @param {EventTarget} container the container that this input is handling.
     *   This is important as the mouse coordinates will be translated to a relative location
     *   of the container area.
     */
    startMouseCapture: function(container) {
      container = container || window;

      container.addEventListener("mouseup", this.onMouseUp.bind(this), false);
      container.addEventListener("mousemove", this.onMouseMove.bind(this), false);
      container.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    },

    /**
     * Binds a key to a action.
     *
     * Note that you can bind different keys for the same action,
     * but you CAN'T bind two or more actions for the same key.
     *
     * @method bind
     * @param {bb.KEY} key the key which will activate this action.
     * @param {String} action the action to be activate when the informed
     *   key is pressed.
     *
     * @example
     *     input.bind(bb.KEY.SPACE, "jump");
     *
     *     // Binding the same action to different keys
     *     input.bind(bb.KEY.D, "walk forward");
     *     input.bind(bb.KEY.RIGHT, "walk forward");
     */
    bind: function bind(key, action) {
      this.bindings[key] = action;
    },

    /**
     * Unbinds a given key
     * @method unbind
     * @param {bb.KEY} key the key that will be unbinded
     */
    unbind: function unbind(key) {
      delete this.bindings[key];
    },

    /**
     * Checks if a given action is active.
     *
     * @method isPressing
     * @param {String} action
     * @returns {Boolean} the action is active or not.
     *
     * @example
     *     input.isPressing("jump");
     */
    isPressing: function(action) {
      for (var key in this.activeCommands) {
        if (this.activeCommands[key] && this.bindings[key] == action)
          return true;
      }

      return false;
    },

    /**
     * Handles the browser keyDown event and adds the pressed
     * key to the activeCommands list.
     *
     * @method onKeyDown
     * @private
     */
    onKeyDown: function(event) {
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
    onKeyUp: function(event) {
      var keyCode = event.which || event.keyCode;
      delete this.activeCommands[keyCode];
    },

    /**
     * Handles the browser mouseDown event and adds the pressed
     * button to the activeCommands list.
     *
     * @method onMouseDown
     * @private
     */
    onMouseDown: function(event) {
      var button = event.which || event.button;
      this.activeCommands[button] = true;
    },

    /**
     * Handles the browser mouseDown event and removes the pressed
     * button from the activeCommands list.
     *
     * @method onMouseUp
     * @private
     */
    onMouseUp: function(event) {
      var button = event.which || event.button;
      delete this.activeCommands[button];
    },

    /**
     * Handles the browser mouseMove event and stores the current
     * mouse position in the mouse property, and the old position
     * to the pmouse property.
     *
     * @method onMouseMove
     * @private
     */
    onMouseMove: function(event) {
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

  return Input;
})();

bb.KEY = (function() {
  /**
   * The list of all the supported keys.
   *
   * @property {Object} KEY
   * @static
   */
  var KEY = {
    MOUSE1: 1,
    MOUSE2: 2,
    RETURN: 13,
    ENTER: 13,
    BACKSPACE: 8,
    TAB: 9,
    CLEAR: 12,
    ESC: 27,
    ESCAPE: 27,
    SPACE: 32,
    DEL: 46,
    DELETE: 46,
    HOME: 36,
    END: 35,
    PAGEUP: 33,
    PAGEDOWN: 34,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACKTICK: 192,
    DASH: 189,
    EQUAL: 187,
    SEMICOLON: 186,
    BACKSLASH: 222,
    LEFTBRACKET: 219,
    RIGHTBRACKET: 221,
    REVERSE_SLASH: 220,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    OPTION: 18,
    COMMAND: 91,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  }

  var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  for (var i = 0, length = letters.length; i < length; i++) {
    KEY[letters[i]] = i + 65;
  }

  for (var number = 0; number <= 9; number++) {
    KEY["NUMBER" + number] = number + 48;
  }

  return KEY;
})();
