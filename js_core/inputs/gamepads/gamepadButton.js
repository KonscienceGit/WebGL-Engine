class GamepadButton extends AbstractInput{
    // TODO add check to recognize controller type (Xbox controller, fligth stick etc...)
    /**
     * @param {GamepadInputManager} gamepadManager
     * @param {String} gamepadType
     * @param {number} buttonNumber
     */
    constructor(gamepadManager, gamepadType, buttonNumber) {
        super();
        this._gamepadType = gamepadType;
        this._gamepadManager = gamepadManager;
        this._buttonNumber = buttonNumber;
        this._gamepad = this._gamepadManager.getControllerByType(this._gamepadType);
        this._haveCorrectGamepad = (this._gamepad != null);
    }

    getInputValue() {
        let val = 0;
        if(!this._haveCorrectGamepad || !this._gamepad || !this._gamepad.connected){
            this._gamepad = this.getController();
        }
        if (!this._gamepad || !this._gamepad.connected) return val;
        const button = this._gamepad.buttons[this._buttonNumber];
        if (!button) return val;
        if (typeof (button) == "object") {
            if ('touched' in button && button.touched) {
                val = button.value;
            } else if ('pressed' in button) {
                val = button.pressed ? 1 : 0;
            }
        } else {
            val = button;
        }
        return val;
    }

    getController(){
        let controller = this._gamepadManager.getControllerByType(this._gamepadType);
        if (!controller) controller = this._gamepadManager.getController();
        return controller;
    }

    isInputPressed() {
        return this.getInputValue() > 0;
    }

    isConflictingInput(anotherInput) {
        return false;
    }
}