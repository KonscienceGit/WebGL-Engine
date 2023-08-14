"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    const fixedResolution = new Vec2(1100, 800);
    renderer.setDisplayFixedResolution(fixedResolution);
    // renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(renderer.getRenderResolution().y);
    const gameObjectManager = new SpaceShooterObjectsManager(renderer);
    const sceneRoot = gameObjectManager.getRoot();
    const scene = new Scene2D(sceneRoot, camera);
    renderer.setScene(scene);

    // Inputs
    const gameBindings = new SpaceShooterInputManager(renderer);
    const gameStateManager = new StateManager(gameObjectManager, gameBindings);
    LoadingManager.callbackWhenLoaded(sceneRoot, init);

    function init() {
        renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);
        gameBindings.parseBindings(deltaTime);
        gameStateManager.updateCurrentState(deltaTime);
        renderer.render(deltaTime);

        //Request another animation frame, at a pace that should match monitor refresh rate (or at least the web browser refresh rate)
        requestAnimationFrame(renderGameFrame);
    }

    /**
     * @param {number} timeStamp
     */
    function computeDelta(timeStamp) {
        const time = timeStamp * 0.001;
        const deltaTime = time - previousTime;
        previousTime = time;
        return deltaTime;
    }

    return null;
}

export {main};
