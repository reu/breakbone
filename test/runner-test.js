describe("bb.Runner", function() {
  describe("#start", function() {
    it("starts the run loop", function(done) {
       var runner = new bb.Runner;
       var called = false;

       runner.onTick = function() {
         if (!called) done();
         called = true;
       }

       runner.start();
    });
  });

  describe("#stop", function() {
    // TODO: figure out how to test this...
    it.skip("stops the run loop", function() {
       var runner = new bb.Runner;
       runner.start();
       runner.stop();
       sinon.spy(runner, "onTick");
       expect(runner.onTick.called).to.be(false);
    });
  });

  describe("#onTick", function() {
    it("is called every update with the elapsed time", function(done) {
       var runner = new bb.Runner;
       var called = false;

       runner.onTick = function(elapsedTime) {
         if (!called) {
           expect(elapsedTime).to.be.a("number");
           done();
         }
         called = true;
       }

       runner.start();
    });
  });
});
