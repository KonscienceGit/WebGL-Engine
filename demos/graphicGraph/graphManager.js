import {Vec2, Vec4} from "../../webgl_engine/utils/math/vectors.js";
import {MultiSprite} from "../../webgl_engine/graphics/renderables/sprites/multiSprite.js";
import {AnnotatedAxisOverlay} from "./graphics/annotatedAxisOverlay.js";
import {Sprite} from "../../webgl_engine/graphics/renderables/sprites/sprite.js";
import {Interpolator} from "../../webgl_engine/utils/math/interpolator.js";

export class GraphManager {
    /**
     * @param {Renderer} renderer
     * @param {CursorProperties} cursorProperties used for cursor operations
     * @param {GeneralInputManager} graphInputManager for bindings
     */
    constructor(renderer, cursorProperties, graphInputManager) {
        const blackColor = new Vec4(0, 0, 0, 1);
        const darkRedColor = new Vec4(0.8, 0, 0, 1);
        this._camera = renderer.getCamera();
        this._cursorProperties = null;
        this._needsUpdate = true;
        this._isMouseDown = false;
        this._camMovement = new Vec2(0, 0);
        this._lastCursorPos = new Vec2(0, 0);
        this._tmpVec2 = new Vec2(0, 0);

        // Bind the 'this' context for these functions (otherwise it's lost when used as callback)
        graphInputManager.addCallbackToAction(GraphActions.LEFT_CLICK, this.leftClickCallback.bind(this));
        graphInputManager.addCallbackToAction(GraphActions.CURSOR_MOVE, this.cursorMoveCallback.bind(this));
        graphInputManager.addCallbackToAction(GraphActions.MOUSEWHEEL_MOVE_UP, this.mouseWheelUpCallback.bind(this));
        graphInputManager.addCallbackToAction(GraphActions.MOUSEWHEEL_MOVE_DOWN, this.mouseWheelDownCallback.bind(this));

        this.graphPoints = new MultiSprite({color: darkRedColor, sizeindevice: true});
        this.axis = new AnnotatedAxisOverlay(renderer, blackColor);
        this.fullscreenButton = new Sprite({
            imagespaths: '../../resources/minesweeper/Fullscreen.png',
            sizeindevice: true
        });
        this.fullscreenButton.visible = false;

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.axis);
        this.spriteArray.push(this.graphPoints);
        this.spriteArray.push(this.fullscreenButton);
    }

    init() {
        // Init after objects have loaded their textures
        this.graphPoints.size.setValues(0.007, 0.007);
        if (document.fullscreenEnabled) {
            const fsbSize = 0.1;
            this.fullscreenButton.position.setValues(-0.4, -0.4);
            this.fullscreenButton.scale.setValues(fsbSize, fsbSize);
            this.fullscreenButton.isRound = false;
            this.fullscreenButton.radius = 0;
            this.fullscreenButton.visible = true;
        }
        this.updateGraph();
    }

    updateGraph() {
        const nbPoints = 30;
        this.graphPoints.childrenNodes = [];
        for (let i = 0; i < nbPoints; i++) {
            const val = i / (nbPoints - 1);
            const interpolated = Interpolator.circleCurve(val, true, false, false);
            this.graphPoints.createSubSprite(true).position.setValues(val, interpolated);
        }
        this._needsUpdate = true;
    }

    needsUpdate() {
        return this._needsUpdate;
    }

    update() {
        this._needsUpdate = false;
    }

    leftClickCallback(value) {
        if (!this._isMouseDown && value === 1) {
            this._lastCursorPos.copy(this._cursorProperties.screenWorldPos);
        }
        this._isMouseDown = value === 1;
        if (!this._isMouseDown) this._camMovement.setValues(0, 0);
        if (!this._cursorProperties || !this._isMouseDown) return;
        if (document.fullscreenEnabled) {
            const pickres = this._cursorProperties.pick(this.fullscreenButton);
            if (pickres === this.fullscreenButton) {
                if (document.fullscreenElement == null) {
                    document.documentElement.requestFullscreen().catch();
                } else {
                    document.exitFullscreen().catch();
                }
            }
        }
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties) {
        this._cursorProperties = cursorProperties;
        if (this._isMouseDown) {
            const x = this._cursorProperties.screenWorldPos.x - this._lastCursorPos.x;
            const y = this._cursorProperties.screenWorldPos.y - this._lastCursorPos.y;
            const camPos = this._camera.getPosition(this._tmpVec2);
            camPos.x += x;
            camPos.y += y;
            this._camera.setPosition(camPos);
            this._needsUpdate = true;
            this._lastCursorPos.copy(this._cursorProperties.screenWorldPos);
        }
    }

    /**
     * @param {number} wheelPos
     */
    mouseWheelUpCallback(wheelPos) {
        if (wheelPos > 0) {
            this._tmpVec2 = this._camera.getScreenWorldSize(this._tmpVec2);
            this._camera.setVerticalScreenWorldSize(this._tmpVec2.y * 0.9);
            this._needsUpdate = true;
        }

    }

    mouseWheelDownCallback(wheelPos) {
        if (wheelPos > 0) {
            this._tmpVec2 = this._camera.getScreenWorldSize(this._tmpVec2);
            this._camera.setVerticalScreenWorldSize(this._tmpVec2.y * 1.1);
            this._needsUpdate = true;
        }
    }
}
