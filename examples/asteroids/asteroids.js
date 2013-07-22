var Spatial = bb.Component.extend({
  type: "spatial",

  init: function(x, y, radius) {
    this.x = x || 0;
    this.y = y || 0;

    this.radius = radius || 10;

    this.rotation = 0;
  },

  rotateLeft: function(angle) {
    this.rotation -= angle || 0.03;
  },

  rotateRight: function(angle) {
    this.rotation += angle || 0.03;
  }
});

var Velocity = bb.Vector.extend({
  type: "velocity",
  damping: 0.995
});

var ThrustEngine = bb.Component.extend({
  type: "thrustEngine",
  on: false,

  turnOn: function() {
    this.on = true;
  },

  turnOff: function() {
    this.on = false;
  }
});

var Weapon = bb.Component.extend({
  type: "weapon",
  triggering: true,

  init: function(rate) {
    this.rate = rate || 10;
  },

  holdTrigger: function() {
    this.triggering = true;
  },

  releaseTrigger: function() {
    this.triggering = false;
  }
});

var Renderable = bb.Component.extend({
  type: "renderable"
});

var ThrustEngineSystem = bb.System.extend({
  allowEntity: function(entity) {
    return entity.hasComponent("thrustEngine") && entity.hasComponent("velocity") && entity.hasComponent("spatial");
  },

  process: function() {
    this.entities.forEach(function(ship) {
      if (ship.thrustEngine.on) {
        ship.velocity.x += Math.cos(ship.spatial.rotation) * 0.1;
        ship.velocity.y += Math.sin(ship.spatial.rotation) * 0.1;
      }
    });
  }
});

var MovementSystem = bb.System.extend({
  allowEntity: function(entity) {
    return entity.hasComponent("velocity") && entity.hasComponent("spatial");
  },

  process: function() {
    this.entities.forEach(this.integrate.bind(this));
  },

  integrate: function(entity) {
    entity.velocity.multiply(entity.velocity.damping);
    entity.velocity.limit(4);

    entity.spatial.x += entity.velocity.x;
    entity.spatial.y += entity.velocity.y;
  }
});

var BoundingSystem = bb.System.extend({
  init: function(boundary) {
    this.parent();
    this.boundary = boundary;
  },

  allowEntity: function (entity) {
    return entity.hasComponent("spatial");
  },

  process: function() {
    this.entities.forEach(function(entity) {
      if (entity.spatial.x < 0) {
        entity.spatial.x = this.boundary.width;
      }

      if (entity.spatial.x > this.boundary.width) {
        entity.spatial.x = 0;
      }

      if (entity.spatial.y < 0) {
        entity.spatial.y = this.boundary.height;
      }

      if (entity.spatial.y > this.boundary.height) {
        entity.spatial.y = 0;
      }
    }.bind(this));
  }
});

var InputSystem = bb.InputSystem.extend({
  init: function() {
    this.parent(window);
    this.startKeyboardCapture();
  },

  process: function() {
    this.entities.forEach(function(entity) {
      var input = entity.input;

      if (entity.hasComponent("thrustEngine")) {
        if (this.isPressing(input.action("thrust"))) {
          entity.thrustEngine.turnOn();
        } else {
          entity.thrustEngine.turnOff();
        }
      }

      if (this.isPressing(input.action("turn left"))) {
        entity.spatial.rotateLeft();
      }
      if (this.isPressing(input.action("turn right"))) {
        entity.spatial.rotateRight();
      }

      if (entity.hasComponent("weapon")) {
        if (this.isPressing(input.action("shoot"))) {
          entity.weapon.holdTrigger();
        } else {
          entity.weapon.releaseTrigger();
        }
      }
    }.bind(this));
  }
});

var WeaponSystem = bb.System.extend({
  init: function() {
    this.parent();
    this.weaponsTimers = {};
  },

  allowEntity: function(entity) {
    return entity.hasComponent("weapon") && entity.hasComponent("spatial");
  },

  process: function() {
    this.entities.forEach(this.shoot.bind(this));
  },

  shoot: function(entity) {
    if (typeof this.weaponsTimers[entity.weapon] == "undefined") {
      this.weaponsTimers[entity.weapon] = weapon.rate;
    }

    var timer = this.weaponsTimers[entity.weapon];

    if (entity.weapon.triggering && entity.weapon.rate == timer) {
      var bullet = this.world.createEntity();
      bullet.addComponent();
    }

    timer -= 1;
  }
});

var RenderingSystem = bb.System.extend({
  init: function(ctx) {
    this.parent();
    this.ctx = ctx;
  },

  allowEntity: function(entity) {
    return entity.hasComponent("spatial") && entity.hasComponent("renderable");
  },

  process: function() {
    this.clear();
    this.entities.forEach(this.render.bind(this));
  },

  clear: function() {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  },

  render: function(entity) {
    this.ctx.save();
    this.ctx.strokeStyle = this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.translate(entity.spatial.x, entity.spatial.y);
    this.ctx.rotate(entity.spatial.rotation);
    this.ctx.moveTo(-8, -8);
    this.ctx.lineTo(12, 0);
    this.ctx.lineTo(-8, 8);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }
});

var Game = bb.Class.extend({
  init: function(ctx) {
    this.ctx = ctx;
    this.runner = new bb.Runner;
    this.reset();
  },

  start: function() {
    this.runner.start();
  },

  pause: function() {
    this.runner.stop();
  },

  reset: function() {
    var world = new bb.World;

    var commands = new bb.InputComponent;
    commands.add(bb.KEY.LEFT, "turn left")
            .add(bb.KEY.RIGHT, "turn right")
            .add(bb.KEY.UP, "thrust")
            .add(bb.KEY.SPACE, "shoot");

    var player = world.createEntity();
    player.addComponent(new Spatial(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2))
          .addComponent(new Velocity)
          .addComponent(commands)
          .addComponent(new ThrustEngine)
          .addComponent(new Renderable);

    world.addSystem(new InputSystem)
         .addSystem(new ThrustEngineSystem)
         .addSystem(new MovementSystem)
         .addSystem(new BoundingSystem(this.ctx.canvas))
         .addSystem(new WeaponSystem)
         .addSystem(new RenderingSystem(this.ctx));

    this.pause();
    this.runner.onTick = world.process.bind(world);
    this.start();
  }
});
