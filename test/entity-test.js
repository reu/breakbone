describe("bb.Entity", function() {
  var world;

  var VelocityComponent = bb.Component.extend({
    type: "velocity"
  });

  var PositionComponent = bb.Component.extend({
    type: "position"
  });

  beforeEach(function() {
    world = new bb.World;
  });

  describe("#id", function() {
    it("is generated automatically for each new entity", function() {
      var entity1 = new bb.Entity(world);
      var entity2 = new bb.Entity(world);

      expect(entity1.id).to.be.an("number");
      expect(entity2.id).to.be.an("number");
      expect(entity1.id).to.not.be.equal(entity2);
    });
  });

  describe("#addComponent", function() {
    var velocityComponent, positionComponent;

    beforeEach(function() {
      velocityComponent = new VelocityComponent;
      positionComponent = new PositionComponent;
    });

    it("adds a new component to the entity", function() {
      var entity = new bb.Entity(world);
      entity.addComponent(velocityComponent);

      entity.hasComponent(velocityComponent);
    });

    it("doesn't allow duplicated component", function() {
      var entity = new bb.Entity(world);
      entity.addComponent(velocityComponent);
      entity.addComponent(velocityComponent);

      expect(entity.getComponents().length).to.equal(1);
    });

    it("replaces the component if one of the same type is already added", function() {
      var otherVelocityComponent = new VelocityComponent;
      var entity = new bb.Entity(world);

      entity.addComponent(velocityComponent);
      expect(entity.getComponent("velocity")).to.be(velocityComponent);

      entity.addComponent(otherVelocityComponent);
      expect(entity.getComponent("velocity")).to.be(otherVelocityComponent);
    });

    it("adds a property accessor to the component", function() {
      var entity = new bb.Entity(world);
      entity.addComponent(velocityComponent);
      expect(entity.velocity).to.be(velocityComponent);
    });
  });

  describe("#hasComponent", function() {
    it("is true when the entity has the given component type", function() {
      var velocity = new VelocityComponent;
      var position = new PositionComponent;

      var entity = new bb.Entity(world);
      entity.addComponent(velocity);

      expect(entity.hasComponent("velocity")).to.be(true);
      expect(entity.hasComponent("position")).to.be(false);
    });
  });

  describe("#getComponent", function() {
    it("returns the component of the given type", function() {
      var velocity = new VelocityComponent;
      var position = new PositionComponent;

      var entity = new bb.Entity(world);
      entity.addComponent(velocity);
      entity.addComponent(position);

      expect(entity.getComponent("velocity")).to.be(velocity);
      expect(entity.getComponent("position")).to.be(position);
    });
  });

  describe("#removeComponent", function() {
    it("removes the given component", function() {
      var velocity = new VelocityComponent;
      var position = new PositionComponent;

      var entity = new bb.Entity(world);
      entity.addComponent(velocity);
      entity.addComponent(position);

      entity.removeComponent(velocity);

      expect(entity.hasComponent("velocity")).to.be(false);
      expect(entity.hasComponent("position")).to.be(true);
    });
  });

  describe("#removeComponentByType", function() {
    it("removes the given component", function() {
      var velocity = new VelocityComponent;
      var position = new PositionComponent;

      var entity = new bb.Entity(world);
      entity.addComponent(velocity);
      entity.addComponent(position);

      entity.removeComponent("velocity");

      expect(entity.hasComponent("velocity")).to.be(false);
      expect(entity.hasComponent("position")).to.be(true);
    });

    it("removes the given component type", function() {
      var velocity = new VelocityComponent;
      var position = new PositionComponent;

      var entity = new bb.Entity(world);
      entity.addComponent(velocity);
      entity.addComponent(position);

      entity.removeComponent("position");

      expect(entity.hasComponent("velocity")).to.be(true);
      expect(entity.hasComponent("position")).to.be(false);
    });

    it("removes the component property", function() {
      var velocity = new VelocityComponent;
      var entity = new bb.Entity(world);

      entity.addComponent(velocity);
      entity.removeComponent("velocity");

      expect(entity).to.not.have.property("velocity");
    });
  });

  describe("tag", function() {
    it("adds a tag to the entity", function() {
      var entity = new bb.Entity(world);
      sinon.spy(world, "tagEntity");

      entity.tag("player");

      expect(world.tagEntity.calledWithExactly(entity, "player")).to.be(true);
    });
  });

  describe("untag", function() {
    it("removes a tag from the entity", function() {
      var entity = new bb.Entity(world);
      sinon.spy(world, "untagEntity");

      entity.untag("player")

      expect(world.untagEntity.calledWithExactly(entity, "player")).to.be(true);
    });
  });
});
