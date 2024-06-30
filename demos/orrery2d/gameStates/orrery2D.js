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
        this._frames = 0;
        this._time = 0;
        const canvas = document.getElementById("game_canvas");
        this._previousTime = 0.0;
        this._renderGameFrame = this.renderGameFrame.bind(this);

        const uiCamera = new Camera2D();
        const gameCamera = new Camera2D();
        this._renderer = new Renderer(canvas, gameCamera);
        this._renderer.setClearColor(new Vec4(0, 0, 0, 1));
        this._renderer.setDisplayFullscreen();
        gameCamera.setVerticalScreenWorldSize(5);

        this._uiScene = new Scene2D(new Entity(), uiCamera);
        this._gameScene = new Scene2D(new Entity(), gameCamera);
        this._inputManager = new Orrery2DInputManager(this._renderer);
        this._gameState = new MainGameState(this._inputManager, this._gameScene, this._uiScene);
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

        // TODO debug framerate
        // this._frames++;
        // this._time += deltaTime;
        // if (this._frames === 60) {
        //     const fps = 60 / this._time;
        //     console.log(fps);
        //     this._time = 0;
        //     this._frames = 0;
        // }

        this._inputManager.parseBindings(deltaTime);
        this.updateCurrentState(deltaTime);
        this._renderer.clear();
        this._renderer.setScene(this._gameScene);
        this._renderer.render(deltaTime);
        this._renderer.setScene(this._uiScene);
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
