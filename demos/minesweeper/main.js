"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    const grey = 150 / 255;
    renderer.setClearColor(new Vec4(grey, grey, grey, 1));
    renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(1.0);

    // Inputs
    const minesweeperInputManager = new MinesweeperInputManager(renderer);
    const gameObjectManager = new MineSweeperObjectsManager(renderer);
    const gameStateManager = new MineSweeperStateManager(gameObjectManager, minesweeperInputManager);
    const renderableArray = gameObjectManager.spriteArray;
    LoadingManager.callbackWhenLoaded(renderableArray, init);

    function init() {
        renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);
        minesweeperInputManager.parseBindings(deltaTime);
        gameStateManager.updateCurrentState(deltaTime);
        updateSprites(renderableArray, deltaTime);
        renderer.clear();
        renderer.draw(renderableArray);
        //Request another animation frame, at a pace that should match monitor refresh rate (or at least the web browser refresh rate)
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
