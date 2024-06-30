import {AbstractInputDeviceManager} from "../abstractInputDeviceManager.js";
import {CursorProperties} from "../../utils/cursorProperties.js";
import {Vec2} from "../../utils/math/vectors.js";
import {MouseButtonInput, MouseInputType, MouseMovedInput, MouseWheelInput} from "./mouseInputs.js";
import {ActionType} from "../inputActions.js";

export class MouseInputManager extends AbstractInputDeviceManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        super();
        const self = this;
        this.mouseMoved = this.mouseMoved.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseWheelMove = this.mouseWheelMove.bind(this);

        this.touchMoved = this.touchMoved.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this._canvas = renderer.getCanvas();
        this._renderer = renderer;
        this._wheelPos = 0;
        this._cursorProperties = new CursorProperties();
        this._mouseBtn = new Array(5).fill(false);
        this._tmpVec2 = new Vec2(0, 0);

        this._canvas.addEventListener("mousemove", self.mouseMoved);
        this._canvas.addEventListener("mousedown", self.mouseDown);
        this._canvas.addEventListener("mouseup", self.mouseUp);
        this._canvas.addEventListener("mouseenter", self.mouseEnter);
        this._canvas.addEventListener("mouseleave", self.mouseLeave);
        this._canvas.addEventListener("wheel", self.mouseWheelMove, {'passive': false});

        this._canvas.addEventListener("touchmove", self.touchMoved, {'passive': false});
        this._canvas.addEventListener("touchstart", self.touchStart, {'passive': false});
        this._canvas.addEventListener("touchend", self.touchEnd);
    }

    /**
     * @returns {CursorProperties}
     */
    getCursorProperties() {
        return this._cursorProperties;
    }

    /**
     * @param {MouseButton} buttonID
     * @returns {boolean}
     */
    getMouseButton(buttonID) {
        return this._mouseBtn[buttonID];
    }

    getMouseWheelPos() {
        return this._wheelPos;
    }

    /**
     * @param {MouseEvent} event
     */
    mouseMoved(event) {
        this.updateCursor(event);
    }

    mouseDown(event) {
        this.updateCursor(event);
        this._mouseBtn[event.button] = true;
    }

    mouseUp(event) {
        this.updateCursor(event);
        this._mouseBtn[event.button] = false;
    }

    mouseEnter() {
        this._cursorProperties.isOutside = false;
    }

    mouseLeave() {
        this._cursorProperties.isOutside = true;
    }

    /**
     * @param {WheelEvent} event
     */
    mouseWheelMove(event) {
        this._wheelPos = Math.sign(event.deltaY);
    }

    /**
     * @param {TouchEvent} event
     */
    touchMoved(event) {
        this.updateCursor(event.touches[0]);
    }

    /**
     * @param {TouchEvent} event
     */
    touchStart(event) {
        this._mouseBtn[0] = true;
        this.updateCursor(event.touches[0]);
    }

    /**
     * @param {TouchEvent} event
     */
    touchEnd(event) {
        this._mouseBtn[0] = false;
        this.updateCursor(event.changedTouches[0]);
    }


    updateCursor(event) {
        // Note: Canvas and Screen coordinates are in pixels, X increase toward the right, and Y increase DOWNWARD (0 is at the top)
        const rect = this._canvas.getBoundingClientRect();
        // Get difference between previous position and current position
        this._cursorProperties.lastPixelMovement.setValues(event.screenX - this._cursorProperties.screenPos.x, event.screenY - this._cursorProperties.screenPos.y);
        this._cursorProperties.screenPos.setValues(event.screenX, event.screenY);
        // Adjust based on the real position of the current DOM element thingy
        this._cursorProperties.canvasPos.setValues(event.clientX - rect.left, event.clientY - rect.top);

        // Convert to device coordinate space [-1, 1], x increasing to the right, y increasing upward
        this._cursorProperties.devicePos.x = 2 * this._cursorProperties.canvasPos.x / rect.width - 1;
        this._cursorProperties.devicePos.y =  -2 * this._cursorProperties.canvasPos.y / rect.height + 1;

        // TODO for ref only, to remove
        // this._cursorProperties.screenWorldPos.setValues(this._cursorProperties.canvasPos.x - rect.width / 2, rect.height / 2 - this._cursorProperties.canvasPos.y);
        // this._renderer.getCamera().getScreenWorldSize(this._tmpVec2);
        // this._cursorProperties.screenWorldPos.x *= this._tmpVec2.x / rect.width;
        // this._cursorProperties.screenWorldPos.y *= this._tmpVec2.y / rect.height;
        // this._renderer.getCamera().getPosition(this._cursorProperties.worldPosOffset);
    }

    /**
     * @param {MouseInputIdentifiers} inputId
     * @param {ActionType} actionType
     */
    createInput(inputId, actionType) {
        let input = null;
        switch (inputId.getInputType()) {
            case MouseInputType.BUTTON:
                if (actionType === ActionType.POSITION || actionType === ActionType.THROTTLE) {
                    throw new Error('Error: cannot bind a Button to a ' + actionType + ' action!');
                }
                input = new MouseButtonInput(this, inputId.getNumber());
                break;
            case MouseInputType.CURSOR_POSITION:
                if (actionType === ActionType.BUTTON) {
                    throw new Error('Error: cannot bind a mouse position to a ' + actionType + ' action!');
                }
                if (actionType === ActionType.AXIS || actionType === ActionType.THROTTLE) {
                    throw new Error('Error: ' + actionType + ' action is not yet implemented for mouse movement input!');
                }
                input = new MouseMovedInput(this);
                break;
            case MouseInputType.WHEEL:
                if (actionType === ActionType.POSITION) {
                    throw new Error('Error: cannot bind a mouse wheel to a ' + actionType + ' action!');
                }
                input = new MouseWheelInput(this, inputId.getNumber());
                break;
            default:
                console.error('Error: ' + inputId.getInputType() + ' is not a valid mouse input type.');
        }
        return input;
    }

    postParsingUpdate() {
        this._wheelPos = 0;
    }
}
