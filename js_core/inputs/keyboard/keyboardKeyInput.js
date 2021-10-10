class KeyboardKeyInput extends AbstractInput{
    /**
     * @param {KeyboardInputManager} keyboardInputManager
     * @param {String} code
     * @param {String} localizedValue
     */
    constructor(keyboardInputManager, code, localizedValue) {
        super();
        this._keyboardInputManager = keyboardInputManager;
        this._code = code;
        this._localizedValue = localizedValue;
    }

    getInputValue() {
        return this._keyboardInputManager.getKeyValue(this._code) ? 1 : 0;
    }

    isInputPressed() {
        return this.getInputValue() > 0;
    }
}