"use strict";

function main() {
    let canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    let renderer = new Renderer(canvas, new Vec2(1100,800));
    let gameObjectManager = new GameObjectsManager(renderer);
    let spriteArray = gameObjectManager.getSpriteArray();

    let gameStateManager = new StateManager(gameObjectManager, renderer, canvas);

    LoadingManager.callbackWhenLoaded(spriteArray, init);

    function init() {
        renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        let deltaTime = computeDelta(timeStamp);
        gameStateManager.updateCurrentState(deltaTime);
        update(spriteArray, deltaTime);
        renderer.draw(spriteArray);

        //Request another animation frame, at a pace that should match monitor refresh rate (or web browser refresh rate)
        requestAnimationFrame(renderGameFrame);
    }

    /**
     * @param {number} timeStamp
     */
    function computeDelta(timeStamp) {
        timeStamp *= 0.001;
        let deltaTime = timeStamp - previousTime;
        previousTime = timeStamp;
        return deltaTime;
    }

    /**
     * @param spriteArray
     * @param {number} delta
     */
    function update(spriteArray, delta) {
        spriteArray.forEach(entity => entity.updateSprite(delta));
    }

    return null;
}

export {main};