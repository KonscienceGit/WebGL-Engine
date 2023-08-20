"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    renderer.setClearColor(new Vec4(0, 0, 0, 1));
    renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(1);

    // Inputs
    const inputManager = new Orrery2DInputManager(renderer);
    const gameObjectManager = new Orrery2DObjectsManager(renderer);
    const root = gameObjectManager.getRoot();
    const scene = new Scene2D(root, camera);
    renderer.setScene(scene);
    const gameStateManager = new Orrery2DStateManager(gameObjectManager, inputManager);

    function init() {
        renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);
        inputManager.parseBindings(deltaTime);
        gameStateManager.updateCurrentState(deltaTime);
        renderer.clear();
        renderer.render(deltaTime);
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

    // No loading
    init();
    return null;
}

export {main};
