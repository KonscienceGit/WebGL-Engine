const MouseInputIdentifier = Object.freeze({
    BUTTON_LEFT: 0,
    BUTTON_MIDDLE: 1,
    BUTTON_RIGHT: 2,
    BUTTON_THUMB_1: 3,
    BUTTON_THUMB_2: 4
});

class MouseMovedInput extends AbstractInput{
    /**
     *
     * @param mouseInputManager
     */
    constructor(mouseInputManager) {
        super();
        this._mouseInputManager = mouseInputManager;
    }

    getInputValue() {
        return this._mouseInputManager.getCursor();
    }
}

class MouseButtonInput extends AbstractInput{
    /**
     *
     * @param {MouseInputManager} mouseInputManager
     * @param {MouseInputIdentifier} buttonID
     */
    constructor(mouseInputManager, buttonID) {
        super();
        this._mouseInputManager = mouseInputManager;
        this._buttonID = buttonID;
    }

    isInputPressed() {
        return this._mouseInputManager.getMouseButton(this._buttonID);
    }
}