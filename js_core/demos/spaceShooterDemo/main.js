"use strict";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const fixedResolution = new Vec2(1100, 800);
    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    renderer.setDisplayFixedResolution(fixedResolution);
    camera.setVerticalWorldSize(fixedResolution.y);
    const gameObjectManager = new GameObjectsManager(renderer);
    const renderableArray = gameObjectManager.getRenderableArray();

    // Inputs
    const keyboardManager = new KeyboardInputManager();
    const gamepadManager = new GamepadInputManager();
    const mouseManager = new MouseInputManager(canvas, renderer);
    const gameBindings = new SsdBindings(keyboardManager, gamepadManager, mouseManager);

    const gameStateManager = new StateManager(gameObjectManager, renderer, canvas, gameBindings);

    LoadingManager.callbackWhenLoaded(renderableArray, init);

    function init() {
        renderGameFrame(0);
    }

    // Profiling stuff
    const benchmarkCodeSection = false;
    let timestart = 0;
    let timeTotal = 0;
    let frame = 0;
    let sumOver120Frames = 0;

    /**
     * @param {number} timeStamp
     */
    function renderGameFrame(timeStamp) {
        const deltaTime = computeDelta(timeStamp);

        if (benchmarkCodeSection){
            timestart = performance.now();
        }

        gameBindings.parseBindings(deltaTime);

        if (benchmarkCodeSection){
            const timeSpend = performance.now() - timestart;
            frame++;
            sumOver120Frames += timeSpend;
            timeTotal += timeSpend;

            if (frame >= 120){
                frame = 0;
                const average = sumOver120Frames / 120;
                sumOver120Frames = 0;
                console.log('average time per frame on inputs: ' + average + ' ms');
                console.log('total time on inputs: ' + timeTotal + ' ms');
            }
        }


        gameStateManager.updateCurrentState(deltaTime);
        updateSprites(renderableArray, deltaTime);
        renderer.draw(renderableArray);

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