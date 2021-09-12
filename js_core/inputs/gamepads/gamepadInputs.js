/**
 * @abstract
 */
class AbstractGamepadInput extends AbstractInput{
    constructor(gamepadManager, gamepadType) {
        super();
        this._gamepadType = gamepadType;
        this._gamepadManager = gamepadManager;
        this._gamepad = this._gamepadManager.getControllerByType(this._gamepadType);
        this._haveCorrectGamepad = (this._gamepad != null);
    }

    getController(){
        if(this._gamepad && this._gamepad.connected){
            return this._gamepad;
        }
        this._gamepad = this._gamepadManager.getControllerByType(this._gamepadType);

        if (this._gamepad) {
            this._haveCorrectGamepad = true;
        } else {
            this._haveCorrectGamepad = false;
            this._gamepad = this._gamepadManager.getController();
        }
        return this._gamepad;
    }

    isConflictingInput(anotherInput) {
        ConsoleUtils.nonImplementedError();
        return false;
    }
}

class GamepadButtonInput extends AbstractGamepadInput{
    /**
     * @param {GamepadInputManager} gamepadManager
     * @param {String} gamepadType
     * @param {number} buttonNumber
     */
    constructor(gamepadManager, gamepadType, buttonNumber) {
        super(gamepadManager, gamepadType);
        this._buttonNumber = buttonNumber;
    }

    getInputValue() {
        let val = 0;
        const controller = this.getController();
        if (!controller) return val;
        const button = controller.buttons[this._buttonNumber];
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

    isInputPressed() {
        return this.getInputValue() > 0;
    }
}

class GamepadAxisInput extends AbstractGamepadInput{
    /**
     * @param {GamepadInputManager} gamepadManager
     * @param {String} gamepadType
     * @param {number} axisNumber
     */
    constructor(gamepadManager, gamepadType, axisNumber) {
        super(gamepadManager, gamepadType);
        this._axisNumber = axisNumber;
        this._deadZoneRanges = [-1.0, -0.2, 0.2, 1.0];
    }

    getInputValue() {
        let val = 0.0;
        const controller = this.getController();
        if (!controller) return val;
        const axis = this._gamepad.axes[this._axisNumber];
        if (axis != null) {
            val = axis;
        }
        return val;
    }

    isInputPressed() {
        return this.getInputValue() > 0;
    }
}