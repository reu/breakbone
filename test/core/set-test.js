describe("bb.Set", function() {
  var set, item;

  beforeEach(function() {
    set = new bb.Set;
    item = { name: "Breakbone" };
  });

  describe("#add", function() {
    it("adds an item to the set", function() {
      set.add(item);
      expect(set.contains(item)).to.be(true);
    });

    it("doesn't allow a duplicate item", function() {
      set.add(item);
      set.add(item);
      expect(set.length).to.equal(1);
    });

    it("returns true when a item is successfully added", function() {
      expect(set.add(item)).to.be(true);
    });

    it("returns false when a item is already on the set", function() {
      set.add(item);
      expect(set.add(item)).to.be(false);
    });
  });

  describe("#remove", function() {
    it("removes an item from the set", function() {
      set.add(item);
      set.remove(item);
      expect(set.contains(item)).to.be(false);
    });

    it("returns true if the item was in the set", function() {
      set.add(item);
      expect(set.remove(item)).to.be(true);
    });

    it("returns false if the item was in the set", function() {
      var otherItem = { name: "Other" };
      expect(set.remove(otherItem)).to.be(false);
    });
  });

  describe("#clear", function() {
    it("removes all the items from the set", function() {
      var item1 = {};
      var item2 = [];
      set.add(item1);
      set.add(item2);
      set.clear();

      expect(set.contains(item1)).to.be(false);
      expect(set.contains(item2)).to.be(false);
      expect(set.length).to.equal(0);
    });
  });

  describe("#forEach", function() {
    it("iterates for all items", function() {
      set.add(item);
      set.forEach(function(setItem) {
        expect(setItem).to.equal(item)
      });
    });

    it("allows to pass a scope", function() {
      var scope = {};
      set.add(item);
      set.forEach(function(setItem) {
        expect(this).to.equal(scope);
      }, scope);
    });
  });

  describe("#toArray", function() {
    it("returns an array with the set items", function() {
      set.add(item);

      var array = set.toArray();

      expect(array).to.be.an("array");
      expect(array[0]).to.equal(item);
    });
  });
});
