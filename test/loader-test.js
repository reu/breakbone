describe("bb.Loader", function() {
  var NullResource = bb.Class.extend({
    load: function(loaded) {
      loaded();
    }
  });

  describe("#add", function() {
    it("adds resources to the loading queue", function() {
      var loader = new bb.Loader,
          resource1 = new NullResource,
          resource2 = new NullResource,
          resource3 = new NullResource;

      loader.add(resource1)
            .add(resource2, resource3);

      expect(loader.resources).to.contain(resource1);
      expect(loader.resources).to.contain(resource2);
      expect(loader.resources).to.contain(resource3);
    });

    it("throws an error if an invalid loadable resource is given", function() {
      var loader = new bb.Loader,
          invalidResource = {}; // No method #load implemented

      expect(function() {
        loader.add(invalidResource);
      }).to.throwError("Invalid resource.");
    });
  });

  describe("#load", function() {
    it("loads all the queued resources", function(done) {
      var loader = new bb.Loader,
          resource1 = new NullResource,
          resource2 = new NullResource,
          resource3 = new NullResource;

      loader.add(resource1, resource2, resource3);

      loader.load(done);
    });
  });

  describe("#onProgress", function() {
    it("is called for each loaded resource", function(done) {
      var loader = new bb.Loader,
          resource1 = new NullResource,
          resource2 = new NullResource,
          resource3 = new NullResource,
          resource4 = new NullResource;

      loader.add(resource1, resource2, resource3, resource4);

      sinon.spy(loader, "onProgress");

      loader.load(function() {
        expect(loader.onProgress.withArgs(0, 0).calledOnce).to.be(true);
        expect(loader.onProgress.withArgs(25, 1).calledOnce).to.be(true);
        expect(loader.onProgress.withArgs(50, 2).calledOnce).to.be(true);
        expect(loader.onProgress.withArgs(75, 3).calledOnce).to.be(true);
        expect(loader.onProgress.withArgs(100, 4).calledOnce).to.be(true);

        done();
      });
    });
  });

  describe("#onFinish", function() {
    it("is called when all the resources are loaded", function(done) {
      var loader = new bb.Loader,
          resource1 = new NullResource,
          resource2 = new NullResource,
          resource3 = new NullResource,
          resource4 = new NullResource;

      loader.add(resource1, resource2, resource3, resource4);

      sinon.spy(loader, "onFinish");

      loader.load(function() {
        expect(loader.onFinish.calledOnce).to.be(true);
        done();
      });
    });
  });
});
