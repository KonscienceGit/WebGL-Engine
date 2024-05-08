"use strict";

import {Camera2D} from "../../webgl_engine/graphics/camera2D.js";
import {Renderer} from "../../webgl_engine/graphics/renderer.js";
import {Vec4} from "../../webgl_engine/utils/math/vectors.js";
import {MinesweeperInputManager} from "./minesweeperInputManager.js";
import {MineSweeperObjectsManager} from "./mineSweeperObjectsManager.js";
import {Scene2D} from "../../webgl_engine/utils/scene2d.js";
import {MineSweeperStateManager} from "./gameStates/mineSweeperStateManager.js";
import {LoadingManager} from "../../webgl_engine/utils/loadingManager.js";

function main() {
    const canvas = document.getElementById("game_canvas");
    let previousTime = 0.0;

    const camera = new Camera2D();
    const renderer = new Renderer(canvas, camera);
    const grey = 150 / 255;
    renderer.setClearColor(new Vec4(grey, grey, grey, 1));
    renderer.setClearColor(new Vec4(0, 0, 0, 1));
    renderer.setDisplayFullscreen();
    camera.setVerticalScreenWorldSize(1);

    // Inputs
    const minesweeperInputManager = new MinesweeperInputManager(renderer);
    const gameObjectManager = new MineSweeperObjectsManager(renderer);
    const root = gameObjectManager.getRoot();
    // root.scale.setValues(0.01, 0.01);
    const scene = new Scene2D(root, camera);
    renderer.setScene(scene);
    const gameStateManager = new MineSweeperStateManager(gameObjectManager, minesweeperInputManager);

    // const onProgress = (l, t) => console.log('Loading: ', l, 'out of', t);
    // LoadingManager.callbackWhenLoaded(root, init, onProgress);
    LoadingManager.callbackWhenLoaded(root, init);

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

    return null;
}

export {main};
