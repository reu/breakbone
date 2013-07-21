bb.Class = (function() {
  "use strict";

  /**
   * Class based on (Jonh Resig)[http://ejohn.org/blog/simple-javascript-inheritance/]
   * and Impactjs implementation.
   *
   * @class bb.Class
   * @constructor
   */
  var Class = function Class() {}

  /**
   * Reopens the class and inject new methods on it.
   *
   * @method reopen
   * @param {Object} properties the properties to inject on the class
   */
  Class.reopen = function(properties) {
    for (var name in properties) {
      var property = properties[name];
      var currentProperty = this.prototype[name]

      if (typeof property == "function" && typeof currentProperty == "function") {
        this.prototype[name] = (function(parentFn, fn) {
          return function() {
            var tmp = this.parent;
            this.parent = parentFn;
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            if (typeof this.parent ==  "undefined") delete this.parent;
            return ret;
          }
        })(currentProperty, property);
      } else {
        this.prototype[name] = property;
      }
    }
  }

  /**
   * Extends a class.
   * You can call the function `this.parent` when overriding methods
   * to refer to the same method of the superclass.
   *
   * @method extend
   * @param {Object} properties the properties of the new class
   * @example
   *     var Person = bb.Class.extend({
   *       init: function(name) {
   *         if (!name || name == "") throw "We don't allow anonymous people here";
   *         this.name = name;
   *       },
   *       sayHello: function() {
   *         return "Hello, my name is " + this.name;
   *       }
   *     });
   *
   *     var Ninja = Person.extend({
   *       init: function(name, stars) {
   *         this.parent(name) // Call the Person constructor method
   *         this.stars = stars || 0;
   *       },
   *
   *       sayHello: function() {
   *         return this.parent() + " **disapears in the shadows**";
   *       },
   *
   *       throwStars: function() {
   *         this.stars--;
   *         return "Star throwed!";
   *       }
   *     });
   */
  Class.extend = function(properties) {
    var parent = this.prototype;
    var child = Object.create(parent);

    for (var name in properties) {
      var property = properties[name];
      var parentProperty = parent[name];

      if (typeof property == "function" && typeof parentProperty == "function") {
        child[name] = (function(parentFn, fn) {
          return function() {
            var tmp = this.parent;
            this.parent = parentFn;
            var ret = fn.apply(this, arguments);
            this.parent = tmp;
            if (typeof this.parent ==  "undefined") delete this.parent;
            return ret;
          }
        })(parentProperty, property);
      } else {
        child[name] = properties[name];
      }
    }

    function Class() {
      if (child.init) child.init.apply(this, arguments);
    }
    Class.prototype = child;
    Class.prototype.constructor = Class;
    Class.extend = bb.Class.extend;
    Class.reopen = bb.Class.reopen;

    return Class;
  }

  return Class;
})();
