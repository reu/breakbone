# Breakbone

Breakbone is a javascript Entity-System based game engine.

[![Build Status](https://travis-ci.org/reu/breakbone.png)](https://travis-ci.org/reu/breakbone)

Breakbone is a Entity Component System based game framework. The ideas were extracted from [this fantastic Martin Adam's blog post](http://t-machine.org/index.php/2007/09/03/entity-systems-are-the-future-of-mmog-development-part-1/).

## Todo

The framework is in a pre-alpha state, and as today, there is only the basic entity system framework implemented, as some base classes and data structures. Even not perfect yet, the project aims to be very well documentated as well fully unit tested.

Below, is the prioriy list of what should be implemented next:

* ~~Object id system~~
* ~~Input management~~
* ~~Entity system~~
* ~~Asset management (images and audio for now)~~
* Image manipulation (flip, tile generation)
* Sprite based animation component and system
* Background maps
* Pre-rendering of background maps
* Camera component and system
* Parallax effects
* Audio component and system
* Add a plataformer game example
* ~~Add a top-down game example~~
* Improve documentation with more examples

## Running the test suite

To run the tests with nodejs, first, make sure that all the dependencies are installed:

`npm install`

Then, just run

`make test`

There are some tests that requires a browser to run. For that, just open the `test/browser/index.html` file on your own browser.
