describe("bb.World", function() {
  var world;

  var NullSystem = bb.System.extend({
    allowEntity: function(entity) {
      return true; // Accept all entities
    }
  });

  var VelocityComponent = bb.Component.extend({
    type: "velocity"
  });

  var PositionComponent = bb.Component.extend({
    type: "position"
  });

  var TransformComponent = bb.Component.extend({
    type: "transform"
  });

  var AiComponent = bb.Component.extend({
    type: "ai"
  });

  beforeEach(function() {
    world = new bb.World;
  });

  describe("#createEntity", function() {
    it("creates a entity and add it to the world", function() {
      var entity = world.createEntity();
      expect(world.entities.contains(entity)).to.be(true);
    });
  });

  describe("#addEntity", function() {
    it("adds a entity to the world", function() {
      var entity = new bb.Entity(world);
      world.addEntity(entity);
      expect(world.entities.contains(entity)).to.be(true);
    });
  });

  describe("#addSystem", function() {
    it("adds a system to be processed by the world", function() {
      var system = new NullSystem;
      world.addSystem(system);
      expect(world.systems).to.contain(system);
    });

    it("sets the system's world", function() {
      var system = new NullSystem;
      world.addSystem(system);
      expect(system.world).to.be(world);
    });
  });

  describe("#addEntityComponent", function() {
    var player, enemy, velocityComponent, transformComponent, positionComponent, aiComponent;

    beforeEach(function() {
      player = new bb.Entity(world);
      enemy = new bb.Entity(world);

      velocityComponent = new VelocityComponent;
      transformComponent = new TransformComponent;
      positionComponent = new PositionComponent;
      aiComponent = new AiComponent;
    });

    it("adds a component to the right entity", function() {
      world.addEntityComponent(player, velocityComponent);
      world.addEntityComponent(player, transformComponent);

      world.addEntityComponent(enemy, aiComponent);

      expect(world.getEntityComponents(player)).to.contain(velocityComponent);
      expect(world.getEntityComponents(player)).to.contain(transformComponent);
      expect(world.getEntityComponents(player)).to.not.contain(positionComponent);
      expect(world.getEntityComponents(player)).to.not.contain(aiComponent);

      expect(world.getEntityComponents(enemy)).to.not.contain(velocityComponent);
      expect(world.getEntityComponents(enemy)).to.not.contain(transformComponent);
      expect(world.getEntityComponents(enemy)).to.not.contain(positionComponent);
      expect(world.getEntityComponents(enemy)).to.contain(aiComponent);
    });

    it("replaces components of the same type", function() {
      var velocityComponent1 = new VelocityComponent;
      var velocityComponent2 = new VelocityComponent;

      world.addEntityComponent(player, velocityComponent1);
      world.addEntityComponent(player, velocityComponent2);

      expect(world.getEntityComponents(player)).to.contain(velocityComponent2);
      expect(world.getEntityComponents(player)).to.not.contain(velocityComponent1);
    });

    it("adds the entity to the changed list", function() {
      world.changedEntities.clear();

      world.addEntityComponent(player, velocityComponent);

      expect(world.changedEntities.contains(player)).to.be(true);
    });
  });

  describe("#removeEntityComponent", function() {
    var player, enemy, velocityComponent, transformComponent, positionComponent, aiComponent;

    beforeEach(function() {
      player = new bb.Entity(world);
      enemy = new bb.Entity(world);

      velocityComponent = new VelocityComponent;
      transformComponent = new TransformComponent;
      positionComponent = new PositionComponent;
      aiComponent = new AiComponent;
    });

    it("removes a component from an entity", function() {
      world.addEntityComponent(player, velocityComponent);
      world.addEntityComponent(player, transformComponent);

      world.addEntityComponent(enemy, aiComponent);

      expect(world.getEntityComponents(player)).to.contain(velocityComponent);

      world.removeEntityComponent(player, velocityComponent);

      expect(world.getEntityComponents(player)).to.not.contain(velocityComponent);

      expect(world.getEntityComponents(player)).to.contain(transformComponent);
      expect(world.getEntityComponents(enemy)).to.contain(aiComponent);
    });

    it("adds the entity to the changed list", function() {
      world.addEntityComponent(player, velocityComponent);
      world.changedEntities.clear();

      world.removeEntityComponent(player, velocityComponent);

      expect(world.changedEntities.contains(player)).to.be(true);
    });
  });

  describe("#getEntityComponent", function() {
    it("returns the entity component type", function() {
      var player = new bb.Entity(world);
      var velocityComponent = new VelocityComponent;
      var positionComponent = new PositionComponent;

      world.addEntityComponent(player, velocityComponent)
      world.addEntityComponent(player, positionComponent)

      expect(world.getEntityComponent(player, "velocity")).to.equal(velocityComponent);
      expect(world.getEntityComponent(player, "position")).to.equal(positionComponent);
    });
  });

  describe("#changeEntity", function() {
    it("add the entity to the changed entities", function() {
      var entity = world.createEntity();
      world.changeEntity(entity);
      expect(world.changedEntities.contains(entity)).to.be(true);
    });
  });

  describe("#removeEntity", function() {
    it("add the entity to the removed entities", function() {
      var entity = world.createEntity();
      world.removeEntity(entity);
      expect(world.removedEntities.contains(entity)).to.be(true);
    });

    it("removes the entity from the entity list", function() {
      var entity = world.createEntity();
      world.removeEntity(entity);
      expect(world.entities.contains(entity)).to.be(false);
    });

    it("removes the entity from the tags list", function() {
      var entity = world.createEntity();
      world.tagEntity(entity, "player");
      world.tagEntity(entity, "hero");

      world.removeEntity(entity);

      expect(world.taggedWith("player").contains(entity)).to.be(false);
      expect(world.taggedWith("hero").contains(entity)).to.be(false);
    });
  });

  describe("#enableEntity", function() {
    it("add the entity to the enabled entities", function() {
      var entity = world.createEntity();
      world.enableEntity(entity);
      expect(world.enabledEntities.contains(entity)).to.be(true);
    });
  });

  describe("#disabled", function() {
    it("add the entity to the disabled entities", function() {
      var entity = world.createEntity();
      world.disableEntity(entity);
      expect(world.disabledEntities.contains(entity)).to.be(true);
    });
  });

  describe("#process", function() {
    var system, entity;

    beforeEach(function() {
      system = new NullSystem;
      entity = new bb.Entity(world);
      world.addSystem(system);
    });

    it("notifies the systems when a new entity is added", function(done) {
      system.entityAdded = function(addedEntity) {
        expect(addedEntity).to.equal(entity);
        done();
      }
      world.addEntity(entity);
      world.process();
    });

    it("notifies the systems when a entity is changed", function(done) {
      system.entityChanged = function(changedEntity) {
        expect(changedEntity).to.equal(entity);
        done();
      }
      world.addEntity(entity);
      world.changeEntity(entity);
      world.process();
    });

    it("notifies the systems when a entity is disabled", function(done) {
      system.entityDisabled = function(disabledEntity) {
        expect(disabledEntity).to.equal(entity);
        done();
      }
      world.addEntity(entity);
      world.disableEntity(entity);
      world.process();
    });

    it("notifies the systems when a entity is enabled", function(done) {
      system.entityEnabled = function(enabledEntity) {
        expect(enabledEntity).to.equal(entity);
        done();
      }
      world.addEntity(entity);
      world.enableEntity(entity);
      world.process();
    });

    it("notifies the systems when a entity is removed", function(done) {
      system.entityRemoved = function(removedEntity) {
        expect(removedEntity).to.equal(entity);
        done();
      }
      world.addEntity(entity);
      world.removeEntity(entity);
      world.process();
    });

    it("processes all the systems", function(done) {
      system.process = done;
      world.process();
    });

    it("doesn't process systems which should not be processed", function() {
      system.process = function() {
        throw "Should not have been called";
      }

      system.shouldProcess = function() {
        return false;
      }

      world.process();
    });

    it("clears all the added entities", function() {
      world.addEntity(entity);
      world.process();
      expect(world.addedEntities).to.not.contain(entity);
    });

    it("clears all the changed entities", function() {
      world.changeEntity(entity);
      world.process();
      expect(world.changedEntities).to.not.contain(entity);
    });

    it("clears all the disabled entities", function() {
      world.disableEntity(entity);
      world.process();
      expect(world.disabledEntities).to.not.contain(entity);
    });

    it("clears all the enabled entities", function() {
      world.enableEntity(entity);
      world.process();
      expect(world.enabledEntities).to.not.contain(entity);
    });

    it("clears all the removed entities", function() {
      world.removeEntity(entity);
      world.process();
      expect(world.removedEntities).to.not.contain(entity);
    });
  });

  describe("#tagEntity", function() {
    it("adds a tag to an entity", function() {
      var player = world.createEntity();
      var enemy = world.createEntity();

      world.tagEntity(player, "player");
      world.tagEntity(player, "hero");
      world.tagEntity(enemy, "enemy");

      expect(world.taggedWith("player").contains(player)).to.be(true);
      expect(world.taggedWith("player").contains(enemy)).to.be(false);

      expect(world.taggedWith("hero").contains(player)).to.be(true);
      expect(world.taggedWith("hero").contains(enemy)).to.be(false);

      expect(world.taggedWith("enemy").contains(enemy)).to.be(true);
      expect(world.taggedWith("enemy").contains(player)).to.be(false);
    });
  });

  describe("#untagEntity", function() {
    it("removes a tag from an entity", function() {
      var player = world.createEntity();
      world.tagEntity(player, "player");
      world.tagEntity(player, "hero");

      world.untagEntity(player, "player");

      expect(world.taggedWith("player").contains(player)).to.be(false);
      expect(world.taggedWith("hero").contains(player)).to.be(true);
    });
  });
});
