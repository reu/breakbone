describe("bb.Class", function() {
  describe(".extend", function() {
    it("inherits all the methods from the parent class", function() {
      var ParentClass = bb.Class.extend({
        randomMethod: function() { return true }
      });

      var SubClass = ParentClass.extend({});

      expect(SubClass.prototype).to.have.property("randomMethod");
    });

    it("has the right types", function() {
      var ParentClass = bb.Class.extend({});
      var SubClass = ParentClass.extend({});

      var parent = new ParentClass;
      var child = new SubClass;

      expect(parent).to.be.a(ParentClass);
      expect(parent).to.not.be.a(SubClass);

      expect(child).to.be.a(ParentClass);
      expect(child).to.be.a(SubClass);
    });
  });

  describe("#parent", function() {
    it("calls the method of the parent", function() {
      var ParentClass = bb.Class.extend({
        name: function() { return "Break" }
      });

      var SubClass = ParentClass.extend({
        name: function() { return this.parent() + "Bone" }
      });

      var instance = new SubClass;

      expect(instance.name()).to.equal("BreakBone");
    });

    it("handles the temporary accessment of the parent property", function() {
      var ParentClass = bb.Class.extend({
        name: function() { return "Break" }
      });

      var SubClass = ParentClass.extend({
        name: function() { return this.parent() + "Bone" }
      });

      var instance = new SubClass;
      instance.name();

      expect(instance).to.not.have.property("parent");
    });
  });

  describe("#init", function() {
    it("is called when the class is initialized", function(done) {
      var Class = bb.Class.extend({
        init: function(arg) {
          expect(arg).to.equal("Hi");
          done();
        }
      });

      new Class("Hi");
    });
  });

  describe(".reopen", function() {
    it("lets you redefine a method", function() {
      var Person = bb.Class.extend({
        name: function() { return "Break" }
      });

      Person.reopen({
        name: function() { return "Bone" }
      });

      var instance = new Person;

      expect(instance.name()).to.equal("Bone");
    });

    it("lets you redefine a property", function() {
      var Person = bb.Class.extend({
        name: "Break"
      });

      Person.reopen({
        name: "Bone"
      });

      var instance = new Person;

      expect(instance.name).to.equal("Bone");
    });

    it("lets you call the parent method", function() {
      var Person = bb.Class.extend({
        name: function() { return "Break" }
      });

      Person.reopen({
        name: function() { return this.parent() + "Bone" }
      });

      var instance = new Person;

      expect(instance.name()).to.equal("BreakBone");
    });
  });
});
