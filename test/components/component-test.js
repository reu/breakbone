describe("bb.Component", function() {
  "use strict";

  describe("#type", function() {
    it("is overridable", function() {
      class InputComponent extends bb.Component {
        get type() { return "input" }
      };

      var input = new InputComponent;

      expect(input.type).to.equal("input");
    });

    it("can't be changed", function() {
      class InputComponent extends bb.Component {};
      var input = new InputComponent;
      expect(() => input.type = "other").to.throwException();
    });

    it("defaults to the class name", function() {
      class Spatial extends bb.Component {};

      var spatial = new Spatial;

      expect(spatial.type).to.equal("spatial");
    });

    context("when the component class name has a `Component` in the name", function() {
      it("defaults to the class name without the `Component` part", function() {
        class SpatialComponent extends bb.Component {};

        var spatial = new SpatialComponent;

        expect(spatial.type).to.equal("spatial");
      });
    });
  });
});
