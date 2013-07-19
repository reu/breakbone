describe("bb.Image", function() {
  describe("#init", function() {
    it("accepts an url", function() {
      var image = new bb.Image("/lol.png");
      expect(image.url).to.equal("/lol.png");
    });

    it("is not loaded before the load method is called", function() {
      var image = new bb.Image("/lol.png");
      expect(image.isLoaded).to.be(false);
    });
  });

  describe("#load", function() {
    var image;

    beforeEach(function() {
      image = new bb.Image("/test/browser/fixtures/hyptosis-sprite.png");
    });

    it("calls the callback function", function(done) {
      image.load(function() {
        done();
      });
    });

    it("saves the image element", function() {
      expect(image.element).to.be(undefined);

      image.load(function() {
        expect(image.element).to.not.be(undefined);
      });
    });

    it("stores that the image is loaded", function() {
      image.load(function() {
        expect(image.isLoaded).to.be(true);
      });
    });

    it("saves the size of the image", function() {
      image.load(function() {
        expect(image.width).to.be.greaterThan(0);
        expect(image.height).to.be.greaterThan(0);
      });
    });

    context("when the url is invalid", function() {
      it("throws an error", function() {
        image = new bb.Image("/lolwut.png");
        expect(image.load).to.throwError();
      });
    });

    context("when the image is already loaded", function() {
      it("calls the callback function", function() {
        image.load(function() {
          done();
        });
      });
    });
  });
});
