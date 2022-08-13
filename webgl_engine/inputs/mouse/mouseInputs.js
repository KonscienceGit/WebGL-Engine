const MouseInputIdentifier = Object.freeze({
    BUTTON_LEFT: 0,
    BUTTON_MIDDLE: 1,
    BUTTON_RIGHT: 2,
    BUTTON_THUMB_1: 3,
    BUTTON_THUMB_2: 4
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
     * @param {number} buttonID
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
     * @param {number} wheelDirection +1 for forward, -1 for backward
     */
    constructor(mouseInputManager, wheelDirection) {
        super();
        this._mouseInputManager = mouseInputManager;
        this._direction = wheelDirection;
    }

    getInputValue() {
        const val = this._mouseInputManager.getMouseWheelPos();
        return (Math.sign(val) === -this._direction) ? Math.abs(val) : 0;
    }
}
