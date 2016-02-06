bb.Vector = (function() {
  "use strict";

  class Vector {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    add(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }

    subtract(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }

    multiply(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    }

    divide(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    }

    lengthSquared() {
      return this.x * this.x + this.y * this.y;
    }

    length() {
      return Math.sqrt(this.lengthSquared());
    }

    normalize() {
      var length = this.length();
      if (length > 0 && length != 1) this.divide(length);
      return this;
    }

    limit(max) {
      if (this.length() > max) return this.normalize() && this.multiply(max);
    }

    dot(vector) {
      return this.x * vector.x + this.y * vector.y;
    }

    distance(vector) {
      var dx = this.x - vector.x,
          dy = this.y - vector.y;

      return Math.sqrt(dx * dx + dy * dy);
    }

    reverse() {
      this.x *= -1;
      this.y *= -1;
      return this;
    }

    clone() {
      return new Vector(this.x, this.y);
    }

    toString() {
      return "(" + ([this.x, this.y].join(", ")) + ")";
    }
  };

  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  Vector.multiply = function(vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
  }

  Vector.divide = function(vector, scalar) {
    return new Vector(vector.x / scalar, vector.y / scalar);
  }

  Vector.distance = function(v1, v2) {
    var dx = v1.x - v2.x,
        dy = v1.y - v2.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  return Vector;
})();
