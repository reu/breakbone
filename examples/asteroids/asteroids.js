var Spatial = bb.Component.extend({
  type: "spatial",

  init: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.rotation = 0;
  },

  rotateLeft: function(angle) {
    this.rotation -= angle || 0.008;
  },

  rotateRight: function(angle) {
    this.rotation += angle || 0.008;
  }
});

var Velocity = bb.Component.extend({
  type: "velocity",

  init: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },

  limit: function(max) {
    var length = Math.sqrt(this.x * this.x, this.y * this.y);

    if (length > max) {
      this.x /= length;
      this.y /= length;

      this.x *= max;
      this.y *= max;
    }
  }
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

var Input = bb.Input.extend({
  type: "input",

  init: function() {
    this.parent();

    this.bind(bb.KEY.UP, "thrust");
    this.bind(bb.KEY.LEFT, "turn left");
    this.bind(bb.KEY.RIGHT, "turn right");
    this.bind(bb.KEY.SPACE, "shoot");

    this.startKeyboardCapture();
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

var MovementSystem = bb.System.extend({
  allowEntity: function(entity) {
    return entity.hasComponent("velocity") && entity.hasComponent("spatial");
  },

  process: function() {
    this.entities.forEach(this.integrate.bind(this));
  },

  integrate: function(entity) {
    if (entity.hasComponent("thrustEngine")) {
      this.accelerateShip(entity);
    }

    entity.velocity.x *= 0.995;
    entity.velocity.y *= 0.995;

    entity.velocity.limit(4);

    entity.spatial.x += entity.velocity.x;
    entity.spatial.y += entity.velocity.y;
  },

  accelerateShip: function(ship) {
    if (ship.thrustEngine.on) {
      ship.velocity.x += Math.cos(ship.spatial.rotation) * 0.1;
      ship.velocity.y += Math.sin(ship.spatial.rotation) * 0.1;
    }
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

var ControlSystem = bb.System.extend({
  allowEntity: function(entity) {
    return entity.hasComponent("input") && entity.hasComponent("thrustEngine");
  },

  process: function() {
    this.entities.forEach(function(entity) {
      if (entity.input.isPressing("thrust")) {
        entity.thrustEngine.turnOn();
      } else {
        entity.thrustEngine.turnOff();
      }

      if (entity.input.isPressing("turn left")) {
        entity.spatial.rotateLeft();
      }
      if (entity.input.isPressing("turn right")) {
        entity.spatial.rotateRight();
      }

      if (entity.hasComponent("weapon")) {
        var weapon = entity.weapon;

        if (entity.input.isPressing("shoot")) {
          weapon.holdTrigger();
        } else {
          weapon.releaseTrigger();
        }
      }
    });
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

    var player = world.createEntity();
    player.addComponent(new Spatial(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2))
          .addComponent(new Velocity)
          .addComponent(new Input)
          .addComponent(new ThrustEngine)
          .addComponent(new Renderable);

    world.addSystem(new ControlSystem)
         .addSystem(new MovementSystem)
         .addSystem(new BoundingSystem(this.ctx.canvas))
         .addSystem(new WeaponSystem)
         .addSystem(new RenderingSystem(this.ctx));

    this.pause();
    this.runner.onTick = world.process.bind(world);
    this.start();
  }
});
