describe("bb.Component", function() {
  describe("#type", function() {
    it("is overridable", function() {
      var InputComponent = bb.Component.extend({
        type: "input"
      });

      var PositionComponent = bb.Component.extend({
        type: "position",

        init: function(x, y) {
          this.x = x;
          this.y = y;
        }
      });

      var input = new InputComponent;
      var position = new PositionComponent;

      expect(input.type).to.equal("input");
      expect(position.type).to.equal("position");
    });
  });
});
