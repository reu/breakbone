bb.VoidSystem = (function() {
  /**
   * This system processes no entities, but still gets invoked.
   * You can use this system if you need to execute some game logic
   * that doesn't concern about entities.
   *
   * @class bb.VoidSystem
   */
  var VoidSystem = bb.System.extend({
    allowEntity: function() {},
    entityAdded: function() {},
    entityRemoved: function() {},
    entityChanged: function() {},
    entityEnabled: function() {},
    entityDisabled: function() {}
  });

  return VoidSystem;
})();
