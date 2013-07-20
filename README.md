# Breakbone

Breakbone is a javascript Entity-System based game engine.

[![Build Status](https://travis-ci.org/reu/breakbone.png)](https://travis-ci.org/reu/breakbone)

## Todo

The framework is in a pre-alpha state, and as today, there is only the basic entity system framework implemented, as some base classes and data structures. Even not perfect yet, the project aims to be very well documentated as well fully unit tested.

Below, is the prioriy list of what should be implemented next:

* ~~Class system~~
* ~~Object id system~~
* ~~Basic data structures~~
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
* Add a top-down game example
* Improve documentation with more examples

## Running the test suite

To run the tests with nodejs, first, make sure that all the dependencies are installed:

`npm install`

Then, just run

`make test`

You can also run the tests using a browser, just type:

`make test-browser`

And then access: http://localhost:3000/test/browser
