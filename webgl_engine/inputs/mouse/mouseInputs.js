import {AbstractInput} from "../abstractInput.js";

/**
 * @enum {number}
 */
export class MouseInputType {
    static {
        this.BUTTON = 0;
        this.WHEEL = 1;
        this.CURSOR_POSITION = 2;
    }
}

/**
 * @enum {number}
 */
export class MouseButton {
    static {
        this.LEFT = 0;
        this.MIDDLE = 1;
        this.RIGHT = 2;
        this.THUMB_1 = 3;
        this.THUMB_2 = 4;
    }
}

/**
 * @enum {number}
 */
export class  MouseWheel {
    static {
        this.WHEEL_1_UP = 1;
        this.WHEEL_1_DOWN = -1;
        // IDK about usefulness of multiple wheel (or multiple axes? need a mouse that supports this to test)
    }
}

export class MouseMovedInput extends AbstractInput{
    /**
     * @param {MouseInputManager} mouseInputManager
     */
    constructor(mouseInputManager) {
        super();
        this._mouseInputManager = mouseInputManager;
    }

    /**
     * @returns {CursorProperties}
     */
    getInputValue() {
        return this._mouseInputManager.getCursorProperties();
    }
}

export class MouseButtonInput extends AbstractInput{
    /**
     * @param {MouseInputManager} mouseInputManager
     * @param {MouseButton} buttonID
     */
    constructor(mouseInputManager, buttonID) {
        super();
        this._mouseInputManager = mouseInputManager;
        this._buttonID = buttonID;
    }

    getInputValue() {
        return this._mouseInputManager.getMouseButton(this._buttonID);
    }
}

export class MouseWheelInput extends AbstractInput{
    /**
     * @param {MouseInputManager} mouseInputManager
     * @param {MouseWheel} wheelID absolute value is the wheel number, sign is the wheel direction (wheel up and down are two separate inputs).
     */
    constructor(mouseInputManager, wheelID) {
        super();
        this._mouseInputManager = mouseInputManager;
        this._direction = Math.sign(wheelID);
    }

    getInputValue() {
        const val = this._mouseInputManager.getMouseWheelPos();
        return (Math.sign(val) === -this._direction) ? Math.abs(val) : 0;
    }
}
