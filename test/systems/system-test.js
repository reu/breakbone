describe("bb.System", function() {
  "use strict";

  var system, item, entity;

  beforeEach(function() {
    var NullSystem = class NullSystem extends bb.System {
      allowEntity(entity) {
        return true;
      }
    };

    system = new NullSystem;
    entity = new bb.Entity;
  });

  describe("#entityAdded", function() {
    it("triggers the onEntityAdd event", function(done) {
      system.onEntityAdd = function(addedEntity) {
        expect(addedEntity).to.equal(entity);
        done();
      }
      system.entityAdded(entity);
    });

    it("doesn't trigger the onEntityAdd event if the entity is already on the system", function() {
      system.entityAdded(entity);
      system.onEntityAdd = function() {
        throw "onEntityAdded should not be called";
      }
      system.entityAdded(entity);
    });
  });

  describe("#removeEntity", function() {
    it("triggers the onEntityRemoval event", function(done) {
      system.onEntityRemoval = function(removedEntity) {
        expect(removedEntity).to.equal(entity);
        done();
      }
      system.entityAdded(entity);
      system.entityRemoved(entity);
    });

    it("doesn't trigger the onEntityRemoval event if the entity was not already on the system", function() {
      system.onEntityRemoval = function() {
        throw "onEntityAdded should not be called";
      }
      system.entityRemoved(entity);
    });
  });

  describe("#removeEntity", function() {
    it("triggers the onEntityRemoval event", function(done) {
      system.onEntityRemoval = function(removedEntity) {
        expect(removedEntity).to.equal(entity);
        done();
      }
      system.entityAdded(entity);
      system.entityRemoved(entity);
    });

    it("doesn't trigger the onEntityRemoval event if the entity was not already on the system", function() {
      system.onEntityRemoval = function() {
        throw "onEntityAdded should not be called";
      }
      system.entityRemoved(entity);
    });
  });

  describe("#entityChanged", function() {
    it("triggers the onEntityChange event", function(done) {
      system.onEntityChange = function(changedEntity) {
        expect(changedEntity).to.equal(entity);
        done();
      }
      system.entityAdded(entity);
      system.entityChanged(entity);
    });

    it("triggers the onEntityAdd if the entity was not yet on this system", function(done) {
      system.onEntityChange = function() {
        throw "onEntityChange should not be called";
      }
      system.onEntityAdd = function(changedEntity) {
        expect(changedEntity).to.equal(entity);
        done();
      }
      system.entityChanged(entity);
    });

    it("triggers the onEntityRemoval if the entity is not allowed in this system anymore", function(done) {
      system.entityAdded(entity);
      system.allowEntity = function() {
        return false;
      }
      system.onEntityChange = function() {
        throw "onEntityChange should not be called";
      }
      system.onEntityRemoval = function(changedEntity) {
        expect(changedEntity).to.equal(entity);
        done();
      }
      system.entityChanged(entity);
    });
  });

  describe("#entityEnabled", function() {
    it("triggers the onEntityEnable event", function() {
      system.onEntityEnable = function(enabledEntity) {
        expect(enabledEntity).to.equal(entity);
      }
      system.entityEnabled(entity);
    });
  });

  describe("#entityDisabled", function() {
    it("triggers the onEntityDisable event", function() {
      system.onEntityDisable = function(disabledEntity) {
        expect(disabledEntity).to.equal(entity);
      }
      system.entityDisabled(entity);
    });
  });
});
