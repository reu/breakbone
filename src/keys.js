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
