/**
 * @abstract
 */
class AbstractGamepadInput extends AbstractInput{
    constructor(gamepadManager, gamepadType) {
        super();
        this._gamepadType = gamepadType;
        this._gamepadManager = gamepadManager;
        this._gamepad = this._gamepadManager.getControllerByType(this._gamepadType);
    }

    getController(){
        if(this._gamepad){
            this._gamepad = this._gamepadManager.getControllerByIndex(this._gamepad.index);
        }
        if(!this._gamepad) {
            this._gamepad = this._gamepadManager.getControllerByType(this._gamepadType);
        }
        if(!this._gamepad) {
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
        this._customDeadZone = undefined;
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

    /**
     * Compute the calibrated axis value from the given raw value, using the configured deadzone.
     * @param rawValue the raw axis value, usually from 0 to 1, but can often go outside bounds.
     * @return {number} the post processed axis value, range from 0.0 to 1.0.
     */
    computeCalibratedValue(rawValue){
        const range = this.getDeadZone();
        return Math.min(1, Math.max(0, rawValue - range[0]) / (range[1] - range[0]));
    }

    /** @return {number[]} the deadzones values for this input.
     * No deadZones is [0.0, 1.0], default is around [0.2, 1.0] */
    getDeadZone() {
        return this._customDeadZone? this._customDeadZone: this._gamepadManager.getDefaultDeadZone();
    }

    /**@param {number} start the value above which input is recognized as different from 0.
     * @param {number} end the value below which the input is recognized as different from 1. */
    setCustomDeadZone(start, end){
        this._customDeadZone[0] = start;
        this._customDeadZone[1] = end;
    }

    isInputPressed() {
        return this.getInputValue() > 0;
    }
}