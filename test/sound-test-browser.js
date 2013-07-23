describe("bb.Sound", function() {
  // Phantomjs doesn't support Audio tag =[
  if (typeof Audio == "undefined") return;

  describe("#init", function() {
    it("accepts an url", function() {
      var sound = new bb.Sound("/lol.ogg");
      expect(sound.url).to.equal("/lol.ogg");
    });

    it("is not loaded before the load method is called", function() {
      var sound = new bb.Sound("/lol.ogg");
      expect(sound.isLoaded).to.be(false);
    });
  });

  describe("#load", function() {
    var sound;

    beforeEach(function() {
      sound = new bb.Sound("fixtures/yeah.ogg");
    });

    it("calls the callback function", function(done) {
      sound.load(function() {
        done();
      });
    });

    it("saves the sound audio", function(done) {
      expect(sound.data).to.be(undefined);

      sound.load(function() {
        expect(sound.data).to.not.be(undefined);
        done();
      });
    });

    it("stores that the sound is loaded", function(done) {
      sound.load(function() {
        expect(sound.isLoaded).to.be(true);
        done();
      });
    });

    context("when the url is invalid", function() {
      it("throws an error", function() {
        sound = new bb.Sound("/lolwut.ogg");
        expect(sound.load).to.throwError();
      });
    });

    context("when the sound is already loaded", function() {
      it("calls the callback function", function(done) {
        sound.load(function() {
          done();
        });
      });
    });
  });
});
