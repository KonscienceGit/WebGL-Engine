"use strict";

function main() {
    // DEBUG constants
    const bench = {};
    bench.enable = false;
    bench.start = performance.now();
    bench.frame = 0;
    bench.sum = 0.0;
    bench.nbFrame = 3000.;
    // END DEBUG constants

    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;
    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    const grey = 150 / 255;
    renderer.setClearColor(new Vec4(grey, grey, grey, 1));
    renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(2.5);

    // Inputs
    const cursorProperties = new CursorProperties();
    const graphInputManager = new GraphInputsManager(renderer);

    const graphManager = new GraphManager(renderer, cursorProperties, graphInputManager);
    const renderableArray = graphManager.spriteArray;
    LoadingManager.callbackWhenLoaded(renderableArray, init);

    function init() {
        graphManager.init();
        renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);
        graphInputManager.parseBindings(deltaTime);
        if (renderer.needRepaint() || graphManager.needsUpdate() || bench.enable) {
            graphManager.update();
            updateSprites(renderableArray, deltaTime);
            renderer.clear();
            renderer.draw(renderableArray);
        }

        // DEBUG benchmark code
        if (bench.enable) {
            bench.now = performance.now();
            bench.sum += bench.now - bench.start;
            bench.start = bench.now;
            bench.frame++;
            if (bench.frame >= bench.nbFrame) {
                const oneDecimalResult = Math.round(bench.sum / (bench.nbFrame / 10)) / 10;
                const fps = Math.round(1000 / oneDecimalResult);
                console.log('frametime: ' + oneDecimalResult + ' ms   fps: ' + fps);
                bench.frame = 0;
                bench.sum = 0;
            }
        }
        // END DEBUG benchmark code
        requestAnimationFrame(renderGameFrame);
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
