import {AbstractState} from "../../../webgl_engine/statesManagement/abstractState.js";
import {FullScreenButton} from "../../common/fullScreenButton.js";
import {Entity} from "../../../webgl_engine/utils/entity.js";
import {Orrery2DObjectsManager} from "../orrery2DObjectsManager.js";
import {StellarBody} from "../stellarBody.js";
import {Orrery2DActions} from "../orrery2DActions.js";
import {Vec2} from "../../../webgl_engine/utils/math/vectors.js";

const FULLSCREEN_BUTTON = true;
const SECONDS_IN_DAY = 24 * 60 * 60;
const __tmpVec2 = new Vec2();
const BODY_LIST = ['SOL', 'MERCURY', 'VENUS', 'TERRA', 'LUNA', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE'];

export class MainGameState extends AbstractState {
    /**
     * @param {Orrery2DInputManager} gameBindings
     * @param {Scene2D} gameScene
     * @param {Scene2D} uiScene
     */
    constructor(gameBindings, gameScene, uiScene) {
        super();
        this._fullScreenButton = null;
        this._gameScene = gameScene;
        this._uiScene = uiScene;
        this._bodyFollowIndex = 0;
        if (FULLSCREEN_BUTTON) {
            this._fullScreenButton = new FullScreenButton();
            this._uiScene.getRoot().add(this._fullScreenButton);
        }
        this._gameScene.getCamera().setVerticalScreenWorldSize(149.6 * 1e6);
        // this.setZoomScale(1 / (149.6 * 1e6), this._gameScene); // earth orbit radius
        /** @type {CursorProperties} */
        this._cursorProperties = null;
        this._mouseLeftDown = false;
        this._mouseRightDown = false;
        this._time = 3600;
        /** @type {Entity} */
        this._focusedEntity = null;

        this._lastCursorPos = null;

        // Load the solar system
        Orrery2DObjectsManager.loadSolarSystem(this._gameScene.getRoot());

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);

        // Bind the 'this' context for these functions (otherwise it's lost when used as callback)
        gameBindings.addCallbackToAction(Orrery2DActions.CURSOR_MOVE, this.cursorMoveCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.LEFT_CLICK, this.leftClickCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.RIGHT_CLICK, this.rightClickCallback.bind(this));

        gameBindings.addCallbackToAction(Orrery2DActions.FOLLOW_NEXT_BODY, this.followNextBody.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.FOLLOW_PREVIOUS_BODY, this.followPreviousBody.bind(this));

        gameBindings.addCallbackToAction(Orrery2DActions.MOUSEWHEEL_MOVE_UP, this.mouseWheelUpCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.MOUSEWHEEL_MOVE_DOWN, this.mouseWheelDownCallback.bind(this));
    }

    start() {
        // Create GUI
    }

    finish() {
    }

    getNextState() {
        return null;
    }

    mainLoop(delta) {
        // this._time += delta / SECONDS_IN_DAY;
        this._time += 1 * delta;
        const allNodes = this._gameScene.getRoot().getAllNodes();
        allNodes.forEach((node) => {
            if (node instanceof StellarBody) {
                node.updateOrbit(this._time);
            }
        });
    }

    animateIn(delta, animationState) {
    }

    animateOut(delta, animationState) {
    }

    leftClickCallback(value) {
        this._mouseLeftDown = !!value;
        this.click(value, true);
    }

    rightClickCallback(value) {
        this._mouseRightDown = !!value;
        this.click(value, false);
    }

    click(value, leftClick) {
        if (this._cursorProperties == null || value < 1) return;
        console.log(this._cursorProperties.canvasPos.x, this._cursorProperties.canvasPos.y);
        if (document.fullscreenEnabled && leftClick) {
            // TODO fix picking, need to take into account the scenegraph matrices.
            const pickResult = this._cursorProperties.pick(this._fullScreenButton);
            if (pickResult != null && pickResult === this._fullScreenButton) {
                this._fullScreenButton.toggleFullScreen();
            }
        }
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties) {
        this._cursorProperties = cursorProperties;
        if (this._lastCursorPos == null) {
            this._lastCursorPos = cursorProperties.devicePos.clone();
        }
        if (this._mouseLeftDown || this._mouseRightDown) {
            const x = cursorProperties.devicePos.x - this._lastCursorPos.x;
            const y = cursorProperties.devicePos.y - this._lastCursorPos.y;
            this.translateCamera(this._gameScene, x, y);
        }
        this._lastCursorPos.copy(cursorProperties.devicePos);
    }

    followNextBody(value) {
        if (value === 0) return;
        this._bodyFollowIndex++;
        if (this._bodyFollowIndex >= BODY_LIST.length) {
            this._bodyFollowIndex = 0;
        }
        this.followBody(this._bodyFollowIndex);
    }

    followPreviousBody(value) {
        if (value === 0) return;
        this._bodyFollowIndex--;
        if (this._bodyFollowIndex < 0) {
            this._bodyFollowIndex = BODY_LIST.length - 1;
        }
        this.followBody(this._bodyFollowIndex);
    }

    followBody(index) {
        const name = BODY_LIST[index];
        const camera = this._gameScene.getCamera();
        /**
         * @type {StellarBody}
         */
        let foundNode = null;
        const nodes = this._gameScene.getRoot().getAllNodes();
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            if (n instanceof StellarBody && n.getIndexName() === name) {
                foundNode = n;
                break;
            }
        }
        if (foundNode == null) {
            camera.follow(null);
            console.log('Body name ' + name + ' not found');
            return;
        }
        const verticalSize = foundNode.getBodyRadius() * 2.8;
        camera.follow(foundNode.getBody());
        camera.setVerticalScreenWorldSize(verticalSize);
    }

    /**
     * Translate the camera by the given value in device coordinates [-1, 1].
     * @param {Scene2D} scene
     * @param {number} x
     * @param {number} y
     */
    translateCamera(scene, x, y) {
        scene.getCamera().move(x, y);
    }

    setZoomScale(scale, scene) {
        const camera = scene.getCamera();
        const zoom = camera.getZoomLevel();
        camera.setZoomLevel(zoom * scale);
    }

    mouseWheelUpCallback(wheelPos) {
        if (wheelPos > 0) {
            this.setZoomScale(1.1, this._gameScene);
        }
    }

    mouseWheelDownCallback(wheelPos) {
        if (wheelPos > 0) {
            this.setZoomScale(0.9, this._gameScene);
        }
    }
}
