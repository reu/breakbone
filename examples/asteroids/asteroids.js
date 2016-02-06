"use strict";

class Spatial extends bb.Component {
  constructor(x, y, radius) {
    super();
    this.x = x || 0;
    this.y = y || 0;

    this.radius = radius || 10;

    this.rotation = 0;
  }

  rotateLeft(angle) {
    this.rotation -= angle || 0.03;
  }

  rotateRight(angle) {
    this.rotation += angle || 0.03;
  }

  getVector() {
    return new bb.Vector(this.x, this.y);
  }
};

class Velocity extends bb.Vector {
  get type() { return "velocity" }

  constructor(x, y, damping) {
    super(x, y);
    this.damping = damping || 0.995;
  }
};

class BoundaryWrap extends bb.Component {};

class ThrustEngine extends bb.Component {
  constructor() {
    super();
    this.on = false;
  }

  turnOn() {
    this.on = true;
  }

  turnOff() {
    this.on = false;
  }
};

class Weapon extends bb.Component {
  constructor(rate) {
    super();
    this.rate = rate || 10;
    this.triggering = true;
  }

  holdTrigger() {
    this.triggering = true;
  }

  releaseTrigger() {
    this.triggering = false;
  }
};

class Expire extends bb.Component {
  constructor(lifetime) {
    super();
    this.lifetime = lifetime;
  }

  isExpired() {
    return this.lifetime <= 0;
  }
};

class Asteroid extends bb.Component {
  constructor(radius) {
    super();
    this.points = [];

    for (var angle = 0; angle < Math.PI * 2; angle += Math.random()) {
      var length = (0.75 + Math.random() * 0.7) * radius;
      this.points.push({
        x: Math.cos(angle) * length,
        y: Math.sin(angle) * length
      });
    }
  }
};

class Collidable extends bb.Component {};

class Respawn extends bb.Component {
  constructor(timer) {
    super();
    this.timer = timer || 120;
  }
};

class Renderable extends bb.Component {
  constructor(name) {
    super();
    this.name = name;
  }
};

class AsteroidSystem extends bb.System {
  constructor(area) {
    super();
    this.area = area;
  }

  allowEntity(entity) {
    return entity.hasComponent("asteroid");
  }

  process() {
    this.spawnAsteroid();
    this.entities.forEach(this.destroyAsteroid.bind(this));
  }

  spawnAsteroid() {
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
  }

  destroyAsteroid(asteroid) {
    var position = asteroid.spatial.getVector();
    var center = new bb.Vector(this.area.width / 2, this.height / 2);

    if (bb.Vector.subtract(position, center).length() > this.area.width) {
      asteroid.remove();
    }
  }
};

class ThrustEngineSystem extends bb.System {
  allowEntity(entity) {
    return entity.hasComponent("thrustEngine") &&
           entity.hasComponent("velocity") &&
           entity.hasComponent("spatial");
  }

  process() {
    this.entities.forEach(function(ship) {
      if (ship.thrustEngine.on) {
        ship.velocity.x += Math.cos(ship.spatial.rotation) * 0.1;
        ship.velocity.y += Math.sin(ship.spatial.rotation) * 0.1;
      }
    });
  }
};

class MovementSystem extends bb.System {
  allowEntity(entity) {
    return entity.hasComponent("velocity") && entity.hasComponent("spatial");
  }

  process() {
    this.entities.forEach(this.integrate.bind(this));
  }

  integrate(entity) {
    entity.velocity.multiply(entity.velocity.damping);
    entity.velocity.limit(4);

    entity.spatial.x += entity.velocity.x;
    entity.spatial.y += entity.velocity.y;
  }
};

class BoundingSystem extends bb.System {
  constructor(boundary) {
    super();
    this.boundary = boundary;
  }

  allowEntity(entity) {
    return entity.hasComponent("spatial") && entity.hasComponent("boundaryWrap");
  }

  process() {
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
};

class CollisionSystem extends bb.System {
  constructor() {
    super();
    this.ships = new Set;
    this.bullets = new Set;
    this.asteroids = new Set;
  }

  allowEntity(entity) {
    return entity.hasComponent("collidable") && entity.hasComponent("spatial");
  }

  onEntityAdd(entity) {
    if (entity.hasTag("ship")) this.ships.add(entity);
    if (entity.hasTag("bullet")) this.bullets.add(entity);
    if (entity.hasTag("asteroid")) this.asteroids.add(entity);
  }

  onEntityRemoval(entity) {
    this.ships.delete(entity);
    this.bullets.delete(entity);
    this.asteroids.delete(entity);
  }

  process() {
    var world = this.world;
    var ships = this.ships;
    var bullets = this.bullets;
    var asteroids = this.asteroids;

    asteroids.forEach(function(asteroid) {
      bullets.forEach(function(bullet) {
        var distance = bb.Vector.subtract(asteroid.spatial, bullet.spatial).length();

        if (distance < asteroid.spatial.radius + bullet.spatial.radius) {
          bullets.delete(bullet);
          asteroids.delete(asteroid);

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

      ships.forEach(function(ship) {
        var distance = bb.Vector.subtract(asteroid.spatial, ship.spatial).length();

        if (distance < asteroid.spatial.radius + ship.spatial.radius) {
          ship.addComponent(new Respawn(60 * 3));
          ship.respawn.input = ship.input;

          ship.removeComponent("input")
              .removeComponent("velocity")
              .removeComponent("collidable")
              .removeComponent("weapon");
        }
      });
    });
  }
};

class InputSystem extends bb.InputSystem {
  constructor() {
    super(window);
    this.startKeyboardCapture();
  }

  process() {
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
};

class WeaponSystem extends bb.System {
  constructor() {
    super();
    this.weaponsTimers = {};
  }

  allowEntity(entity) {
    return entity.hasComponent("weapon") && entity.hasComponent("spatial");
  }

  onEntityAdd(entity) {
    this.weaponsTimers[entity.weapon] = 0;
  }

  onEntityRemoval(entity) {
    delete this.weaponsTimers[entity.weapon];
  }

  process() {
    this.entities.forEach(this.shoot.bind(this));
  }

  shoot(entity) {
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
};

class ExpirationSystem extends bb.System {
  allowEntity(entity) {
    return entity.hasComponent("expire");
  }

  process() {
    this.entities.forEach(function(entity) {
      entity.expire.lifetime -= 1;

      if (entity.expire.isExpired()) {
        entity.remove();
      }
    });
  }
};

class ShipRespawnSystem extends bb.System {
  constructor(respawnArea) {
    super();
    this.respawnArea = respawnArea;
  }

  allowEntity(entity) {
    return entity.hasComponent("respawn");
  }

  process() {
    var respawnArea = this.respawnArea;

    this.entities.forEach(function(entity) {
      entity.respawn.timer -= 1;

      if (entity.respawn.timer == 0) {
          entity.addComponent(new Spatial(respawnArea.width / 2, respawnArea.height / 2))
                .addComponent(new Velocity)
                .addComponent(entity.respawn.input)
                .addComponent(new Collidable)
                .addComponent(new Weapon)
                .removeComponent("respawn");
      }
    });
  }
};

class RenderingSystem extends bb.System {
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }

  allowEntity(entity) {
    return entity.hasComponent("spatial") && entity.hasComponent("renderable");
  }

  process() {
    this.clear();
    this.entities.forEach(this.render.bind(this));
  }

  clear() {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.restore();
  }

  render(entity) {
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
  }

  renderShip(ship) {
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
  }

  renderBullet(bullet) {
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.translate(bullet.spatial.x, bullet.spatial.y);
    this.ctx.arc(0, 0, bullet.spatial.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  renderAsteroid(asteroid) {
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
};

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.runner = new bb.Runner;
    this.reset();
  }

  start() {
    this.runner.start();
  }

  pause() {
    this.runner.stop();
  }

  reset() {
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
         .addSystem(new ShipRespawnSystem(this.ctx.canvas))
         .addSystem(new RenderingSystem(this.ctx));

    this.pause();
    this.runner.onTick = world.process.bind(world);
    this.start();
  }
};
