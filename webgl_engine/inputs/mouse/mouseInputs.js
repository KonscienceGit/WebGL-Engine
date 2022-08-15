/**
 * @enum {number}
 */
const MouseInputType = Object.freeze({
    BUTTON: 0,
    WHEEL: 1,
    CURSOR_POSITION: 2
});

/**
 * @enum {number}
 */
const MouseButton = Object.freeze({
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
    THUMB_1: 3,
    THUMB_2: 4
});

/**
 * @enum {number}
 */
const MouseWheel = Object.freeze({
    WHEEL_1_UP: 1,
    WHEEL_1_DOWN: -1
    // IDK about usefulness of multiple wheel (or multiple axes? need a mouse that supports this to test)
});

class MouseMovedInput extends AbstractInput{
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

class MouseButtonInput extends AbstractInput{
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

class MouseWheelInput extends AbstractInput{
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
