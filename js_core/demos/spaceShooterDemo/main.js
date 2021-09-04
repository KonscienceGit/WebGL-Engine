"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const renderer = new Renderer(canvas, new Vec2(1100, 800));
    const gameObjectManager = new GameObjectsManager(renderer);
    const spriteArray = gameObjectManager.getSpriteArray();

    // Inputs
    const keyboardManager = new KeyboardInputManager();
    const gamepadManager = new GamepadInputManager();
    const mouseManager = new MouseInputManager(canvas, renderer);
    const gameBindings = new SsdBindings(keyboardManager, gamepadManager, mouseManager);

    const gameStateManager = new StateManager(gameObjectManager, renderer, canvas, gameBindings);

    LoadingManager.callbackWhenLoaded(spriteArray, init);

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
        updateSprites(spriteArray, deltaTime);
        renderer.draw(spriteArray);

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

    /**
     * @param {Sprite[]} spriteArray
     * @param {number} delta
     */
    function updateSprites(spriteArray, delta) {
        spriteArray.forEach(entity => entity.updateSprite(delta));
    }

    return null;
}

export {main};