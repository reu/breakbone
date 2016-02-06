bb.VoidSystem = (function() {
  "use strict";

  /**
   * This system processes no entities, but still gets invoked.
   * You can use this system if you need to execute some game logic
   * that doesn't concern about entities.
   *
   * @class bb.VoidSystem
   */
  class VoidSystem extends bb.System {
    allowEntity() {}
    entityAdded() {}
    entityRemoved() {}
    entityChanged() {}
    entityEnabled() {}
    entityDisabled() {}
  };

  return VoidSystem;
})();
