# WebGL-Engine
v0.1 "Space Invaders"

A simple ES6/WebGL2 based game engine, using no external libraries.

[Test it here on GitHub pages!](https://konsciencegit.github.io/WebGL-Engine/index.html)

Or take a look at a more polished implementation here on the [Dinoboi Appel Garden game!](https://www.dinoboi.space/game)

## V 0.1 Current features

* Basic 2D rendering framework with sprites
  * Pixel perfect sprite scaling
  * Sprite animations (using Texture arrays, no texture atlas needed)
  * Sprite transparency
  * 2D Camera system with basic screen/view/aspect ratio handling
* Input and bindings management
  * Xinput controller support (with a Xbox pad profile already implemented)
  * Keyboard
  * Simple Mouse / Touch input
* Rudimentary physics framework
  * Collision between sprites/entities (circle collision)
* Simple state management
  * States have animation capabilities
  * Provide API for setting state change/ending conditions, active state etc
* Functional demos
  * [Classic clone "Space Invaders"](https://konsciencegit.github.io/WebGL-Engine/index.html)
  * [Featuring demo: Dinoboi Appel Garden](https://www.dinoboi.space/game) (Epic collaboration with [Ankhaneko](https://www.ankhaneko.art/))
  

## Near future features

* 2D cursor picking system
* Scrolling textures
* Basic 3D scene (billboards then maybe polygons)
* Basic sound and music support


## Far future features

* Sprite/Entity physics properties for gravity, air drag, water drag simulation
