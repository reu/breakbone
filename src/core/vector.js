bb.Vector = (function() {
  "use strict";

  var Vector = bb.Class.extend({
    init: function(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    },

    add: function(vector) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    },

    subtract: function(vector) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    },

    multiply: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },

    divide: function(scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },

    lengthSquared: function() {
      return this.x * this.x + this.y * this.y;
    },

    length: function() {
      return Math.sqrt(this.lengthSquared());
    },

    normalize: function() {
      var length = this.length();
      if (length > 0 && length != 1) this.divide(length);
      return this;
    },

    limit: function(max) {
      if (this.length() > max) return this.normalize() && this.multiply(max);
    },

    dot: function(vector) {
      return this.x * vector.x + this.y * vector.y;
    },

    distance: function(vector) {
      var dx = this.x - vector.x,
          dy = this.y - vector.y;

      return Math.sqrt(dx * dx + dy * dy);
    },

    reverse: function() {
      this.x *= -1;
      this.y *= -1;
      return this;
    },

    clone: function() {
      return new Vector(this.x, this.y);
    },

    toString: function() {
      return "(" + ([this.x, this.y].join(", ")) + ")";
    }
  });

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
