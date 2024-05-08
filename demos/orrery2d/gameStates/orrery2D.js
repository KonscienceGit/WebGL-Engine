import {AbstractStateManager} from "../../../webgl_engine/statesManagement/abstractStateManager.js";
import {Camera2D} from "../../../webgl_engine/graphics/camera2D.js";
import {Renderer} from "../../../webgl_engine/graphics/renderer.js";
import {Vec4} from "../../../webgl_engine/utils/math/vectors.js";
import {Scene2D} from "../../../webgl_engine/utils/scene2d.js";
import {Entity} from "../../../webgl_engine/utils/entity.js";
import {Orrery2DInputManager} from "../orrery2DInputManager.js";
import {MainGameState} from "./mainGameState.js";

export class Orrery2D extends AbstractStateManager {
    /**
     * The Orrery simulator.
     */
    constructor() {
        super();
        const canvas = document.getElementById("game_canvas");
        this._previousTime = 0.0;
        this._renderGameFrame = this.renderGameFrame.bind(this);
        this._camera = new Camera2D();
        this._renderer = new Renderer(canvas, this._camera);
        this._renderer.setClearColor(new Vec4(0, 0, 0, 1));
        this._renderer.setDisplayFullscreen();
        this._camera.setVerticalScreenWorldSize(5);

        const scene = new Scene2D(new Entity(), this._camera);
        this._renderer.setScene(scene);
        this._inputManager = new Orrery2DInputManager(this._renderer);
        this._gameState = new MainGameState(this._inputManager, scene);
        this.setActiveState(this._gameState);
    }

    start() {
        this.renderGameFrame(0);
    }

    /**
     * @param {number} timeStamp
     */
    renderGameFrame(timeStamp) {
        const deltaTime = this.computeDelta(timeStamp);
        this._inputManager.parseBindings(deltaTime);
        this.updateCurrentState(deltaTime);
        this._renderer.clear();
        this._renderer.render(deltaTime);
        //Request another animation frame, at a pace that should match monitor refresh rate (or at least the web browser refresh rate)
        requestAnimationFrame(this._renderGameFrame);
    }

    /**
     * @param {number} timeStamp in ms
     * @returns {number} delta since last frame in seconds
     */
    computeDelta(timeStamp) {
        const time = timeStamp * 0.001;
        const deltaTime = time - this._previousTime;
        this._previousTime = time;
        return deltaTime;
    }
}
