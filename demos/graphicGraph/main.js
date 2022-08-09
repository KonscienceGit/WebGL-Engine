"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    const grey = 150/255;
    renderer.setClearColor(new Vec4(grey, grey, grey, 1));
    renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(2.5);

    // Inputs
    const cursorProperties = new CursorProperties();
    const keyboardManager = new KeyboardInputManager();
    const gamepadManager = new GamepadInputManager();
    const mouseManager = new MouseInputManager(canvas, renderer, cursorProperties);
    const gameBindings = new ActionsBindingsDefinitions(keyboardManager, gamepadManager, mouseManager);

    const gameObjectManager = new GraphManager(renderer, cursorProperties, gameBindings);
    const renderableArray = gameObjectManager.spriteArray;
    LoadingManager.callbackWhenLoaded(renderableArray, init);

//     // init
//     const bench = {};
//     bench.start = performance.now();
//     bench.frame = 0;
//     bench.sum = 0.0;
//     bench.nbFrame = 3000.;

    function init() {
        renderGameFrame(0);
        gameObjectManager.init();
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);
        gameBindings.parseBindings(deltaTime);
        updateSprites(renderableArray, deltaTime);
        renderer.clear();
        renderer.draw(renderableArray);
        //Request another animation frame, at a pace that should match monitor refresh rate (or at least the web browser refresh rate)
        requestAnimationFrame(renderGameFrame);

        // // each render
        // bench.now = performance.now();
        // bench.sum += bench.now - bench.start;
        // bench.start = bench.now;
        // bench.frame++;
        // if (bench.frame >= bench.nbFrame) {
        //     const oneDecimalResult = Math.round(bench.sum / (bench.nbFrame / 10)) / 10;
        //     const fps = Math.round(1000 / oneDecimalResult);
        //     console.log('frametime: ' + oneDecimalResult + ' ms   fps: ' + fps);
        //     bench.frame = 0;
        //     bench.sum = 0;
        // }
    }

    /**
     * @param {number} timeStamp in ms
     * @returns {number} delta since last frame in seconds
     */
    function computeDelta(timeStamp) {
        const time = timeStamp * 0.001;
        const deltaTime = time - previousTime;
        previousTime = time;
        return deltaTime;
    }

    /**
     * @param {Sprite[]} spriteArray
     * @param {number} delta in seconds
     */
    function updateSprites(spriteArray, delta) {
        spriteArray.forEach(entity => entity.updateEntity(delta));
    }

    return null;
}

export {main};
