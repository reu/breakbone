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
  },

  getVector: function() {
    return new bb.Vector(this.x, this.y);
  }
});

var Velocity = bb.Vector.extend({
  type: "velocity",
  damping: 0.995,
});

var BoundaryWrap = bb.Component.extend({
  type: "boundaryWrap"
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

var Expire = bb.Component.extend({
  type: "expire",

  init: function(lifetime) {
    this.lifetime = lifetime;
  },

  isExpired: function() {
    return this.lifetime <= 0;
  }
});

var Asteroid = bb.Component.extend({
  type: "asteroid",

  init: function(radius) {
    this.points = [];

    for (var angle = 0; angle < Math.PI * 2; angle += Math.random()) {
      var length = (0.75 + Math.random() * 0.7) * radius;
      this.points.push({
        x: Math.cos(angle) * length,
        y: Math.sin(angle) * length
      });
    }
  }
});

var Collidable = bb.Component.extend({
  type: "collidable"
});

var Renderable = bb.Component.extend({
  type: "renderable",

  init: function(name) {
    this.name = name;
  }
});

var AsteroidSystem = bb.System.extend({
  init: function(area) {
    this.parent();
    this.area = area;
  },

  allowEntity: function(entity) {
    return entity.hasComponent("asteroid");
  },

  process: function() {
    this.spawnAsteroid();
    this.entities.forEach(this.destroyAsteroid.bind(this));
  },

  spawnAsteroid: function() {
    if (Math.random() > 0.99) {
      var asteroid = this.world.createEntity();
      asteroid.tag("asteroid");

      var radius = 30;

      var spatial = new Spatial;
      spatial.x = -150 + Math.random() * this.area.width + 300;
      spatial.x = -150 + Math.random() * this.area.height + 300;
      spatial.radius = radius;

      var direction = bb.Vector.subtract({
        x: Math.random() * this.area.width,
        y: Math.random() * this.area.height
      }, {
        x: spatial.x,
        y: spatial.y
      }).normalize();

      var velocity = new Velocity(direction.x, direction.y);
      velocity.damping = 1;

      asteroid.addComponent(spatial)
              .addComponent(new Asteroid(radius))
              .addComponent(new Collidable)
              .addComponent(velocity)
              .addComponent(new Renderable("asteroid"));
    }
  },

  destroyAsteroid: function(asteroid) {
    var position = asteroid.spatial.getVector();
    var center = new bb.Vector(this.area.width / 2, this.height / 2);

    if (bb.Vector.subtract(position, center).length() > this.area.width) {
      asteroid.remove();
    }
  }
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
    return entity.hasComponent("spatial") && entity.hasComponent("boundaryWrap");
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

var CollisionSystem = bb.System.extend({
  init: function() {
    this.parent();
    this.ships = new bb.Set;
    this.bullets = new bb.Set;
    this.asteroids = new bb.Set;
  },

  allowEntity: function(entity) {
    return entity.hasComponent("collidable") && entity.hasComponent("spatial");
  },

  onEntityAdd: function(entity) {
    if (entity.hasTag("player")) this.ships.add(entity);
    if (entity.hasTag("bullet")) this.bullets.add(entity);
    if (entity.hasTag("asteroid")) this.asteroids.add(entity);
  },

  onEntityRemoval: function(entity) {
    this.ships.remove(entity);
    this.bullets.remove(entity);
    this.asteroids.remove(entity);
  },

  process: function() {
    var world = this.world;
    var ships = this.ships;
    var bullets = this.bullets;
    var asteroids = this.asteroids;

    asteroids.forEach(function(asteroid) {
      bullets.forEach(function(bullet) {
        var distance = bb.Vector.subtract(asteroid.spatial, bullet.spatial).length();

        if (distance < asteroid.spatial.radius + bullet.spatial.radius) {
          bullets.remove(bullet);
          asteroids.remove(asteroid);

          bullet.remove();
          asteroid.remove();

          if (asteroid.spatial.radius > 10) {
            function createAsteroid() {
              var asteroidFragment = world.createEntity();
              asteroidFragment.tag("asteroid");

              var spatial = new Spatial(asteroid.spatial.x, asteroid.spatial.y, asteroid.spatial.radius / 2);

              var velocity = new Velocity(Math.cos(Math.random() * Math.PI * 2), Math.sin(Math.random() * Math.PI * 2));
              velocity.damping = 1;

              asteroidFragment.addComponent(spatial)
                              .addComponent(new Asteroid(spatial.radius))
                              .addComponent(new Collidable)
                              .addComponent(velocity)
                              .addComponent(new Renderable("asteroid"));
            }

            if (asteroid.spatial.radius >= 30) {
              createAsteroid();
              createAsteroid();
            }
            createAsteroid();
          }
        }
      });
    });

    asteroids.forEach(function(asteroid) {
      ships.forEach(function(ship) {
        var distance = bb.Vector.subtract(asteroid.spatial, bullet.spatial).length();
      });
    });
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

  onEntityAdd: function(entity) {
    this.weaponsTimers[entity.weapon] = 0;
  },

  onEntityRemoval: function(entity) {
    delete this.weaponsTimers[entity.weapon];
  },

  process: function() {
    this.entities.forEach(this.shoot.bind(this));
  },

  shoot: function(entity) {
    if (entity.weapon.triggering && this.weaponsTimers[entity.weapon] <= 0) {
      this.weaponsTimers[entity.weapon] = entity.weapon.rate;

      var bullet = this.world.createEntity();
      bullet.tag("bullet");

      var spatial = new Spatial(entity.spatial.x, entity.spatial.y, 2);

      var velocity = new Velocity(Math.cos(entity.spatial.rotation), Math.sin(entity.spatial.rotation), 2).multiply(10);
      velocity.damping = 1;

      var expire = new Expire(60 * 3);

      bullet.addComponent(spatial)
            .addComponent(velocity)
            .addComponent(new Collidable)
            .addComponent(new Renderable("bullet"))
            .addComponent(expire);
    }

    this.weaponsTimers[entity.weapon] -= 1;
  }
});

var ExpirationSystem = bb.System.extend({
  allowEntity: function(entity) {
    return entity.hasComponent("expire");
  },

  process: function() {
    this.entities.forEach(function(entity) {
      entity.expire.lifetime -= 1;

      if (entity.expire.isExpired()) {
        entity.remove();
      }
    });
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
    switch (entity.renderable.name) {
      case "ship":
        this.renderShip(entity);
        break;
      case "bullet":
        this.renderBullet(entity);
        break;
      case "asteroid":
        this.renderAsteroid(entity);
        break;
    }
  },

  renderShip: function(ship) {
    this.ctx.save();
    this.ctx.strokeStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.translate(ship.spatial.x, ship.spatial.y);
    this.ctx.rotate(ship.spatial.rotation);
    this.ctx.moveTo(-8, -8);
    this.ctx.lineTo(12, 0);
    this.ctx.lineTo(-8, 8);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  },

  renderBullet: function(bullet) {
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.translate(bullet.spatial.x, bullet.spatial.y);
    this.ctx.arc(0, 0, bullet.spatial.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  },

  renderAsteroid: function(asteroid) {
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.translate(asteroid.spatial.x, asteroid.spatial.y);
    this.ctx.rotate(asteroid.spatial.rotation);
    this.ctx.moveTo(asteroid.spatial.radius, 0);
    for (var i = 0, points = asteroid.asteroid.points, length = points.length; i < length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }
    this.ctx.closePath();
    this.ctx.fill();
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
    player.tag("ship");
    player.addComponent(new Spatial(this.ctx.canvas.width / 2, this.ctx.canvas.height / 2))
          .addComponent(new Velocity)
          .addComponent(new Weapon)
          .addComponent(commands)
          .addComponent(new ThrustEngine)
          .addComponent(new BoundaryWrap)
          .addComponent(new Collidable)
          .addComponent(new Renderable("ship"));

    world.addSystem(new InputSystem)
         .addSystem(new AsteroidSystem(this.ctx.canvas))
         .addSystem(new ThrustEngineSystem)
         .addSystem(new MovementSystem)
         .addSystem(new BoundingSystem(this.ctx.canvas))
         .addSystem(new WeaponSystem)
         .addSystem(new ExpirationSystem)
         .addSystem(new CollisionSystem)
         .addSystem(new RenderingSystem(this.ctx));

    this.pause();
    this.runner.onTick = world.process.bind(world);
    this.start();
  }
});
