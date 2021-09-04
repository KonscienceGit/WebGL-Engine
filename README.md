# WebGL-Engine

A simple ES6/WebGL2 based game engine, using no external libraries.

[Test it here on GitHub pages!](https://konsciencegit.github.io/WebGL-Engine/index.html)

Or take a look at a more polished implementation here on the [Dinoboi Appel Garden game!](https://www.dinoboi.space/game)

## Current features

* Basic 2D rendering framework with sprites
  * Pixel perfect sprite scaling
  * Sprite animations (using Texture arrays, no texture atlas needed)
  * Sprite transparency  
* Input and bindings management
  * Xinput controller support (with a Xbox pad profile already implemented)
  * Keyboard
  * Mouse / Touch input
* Rudimentary physics framework
  * Collision between sprites/entities (circle collision, box collision to come)
  

## Future features

* Particle effects
* Scrolling textures
* Basic 3D scene (billboards then maybe polygons)
* Basic sound and music support
* Sprite/Entity physics properties for gravity, air drag, water drag simulation
