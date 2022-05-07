const ActionType = Object.freeze({
    // Button is either pressed or not, can eventually be "clicked".
    BUTTON: "Button",

    // Axis action goes from 0 to 1
    // Have an inactive/default position (stick)
    AXIS: "Axis",

    // Throttle action goes from 0 to 1
    // Have no inactive/default position
    THROTTLE: "Throttle",

    // Position is a screen relative [x,y] coordinates
    // Can have several status (dragged, click, release etc...)
    POSITION: "Position"
});

/**
 * @abstract
 * Defines an in-game action
 * (like jumping, moving forward, selecting and validating a selected menu options etc)
 */
class AbstractInputAction{
    /** @param {string} name the input action name. */
    constructor(name) {
        this._name = name;
        this._bindedInputs = [];
        this._actionCallbacks = [];
        this._type = "";
    }

    getName(){
        return this._name;
    }

    /** @return {ActionType} */
    getType(){
        return this._type;
    }

    /** @param {AbstractInput} input */ // TODO remove, make each impl have it's addInput with typed input type.
    addInput(input){
        if(!this._bindedInputs.includes(input)) this._bindedInputs.push(input);
    }

    /** @returns {AbstractInput[]} */
    getBindedInputs(){
        return this._bindedInputs;
    }

    /** @param {Object} callback */
    addActionCallback(callback){
        if(!this._actionCallbacks.includes(callback)) this._actionCallbacks.push(callback);
    }

    /** @callback callback A callback function.
     * @param {number} value the value of the input.*/
    /** @return {callback[]} */
    getActionCallbacks(){ return this._actionCallbacks; }

    /** @abstract
     * Fire the callback based on input bindings values.
     */
    parseInputs(){
        ConsoleUtils.nonImplementedError();
    }
}

class ButtonInputAction extends AbstractInputAction{
    /**
     * Fire the given callbacks when the input is clicked, hold or released.
     * The callback will receive the argument: value, the value of the input, 1 is pressed/clicked, 0 is released.
     * If the button is released, a single callback is fired upon release.
     * If the button is pressed, it depend on the constructor argument given:
     *     If actionOnClick is true, only a fresh press will fire a callback.
     *     If actionOnClick is false, callbacks will be fired as long as the button is hold pressed.
     * @param {string} name the input action name.
     * @param {boolean} [actionOnClick=false] Optional, if this input action is only activable on click (letting the input pressed don't trigger it on repetition, only fresh press take effect.
     */
    constructor(name, actionOnClick) {
        super(name);
        this._wasPressed = false;
        this._onClick = actionOnClick ? actionOnClick : false;
        this._type = ActionType.BUTTON;
    }

    parseInputs() {
        let isPressed = false;
        const inputs = this.getBindedInputs();
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].isInputPressed()) {
                isPressed = true;
                break;
            }
        }
        const stateChanged = isPressed !== this._wasPressed;
        const value = isPressed ? 1 : 0;
        if(this._onClick && stateChanged){
            // callback only if changed (press or release button)
            this.getActionCallbacks().forEach(buttonCallback => buttonCallback(value));
        } else if(isPressed || stateChanged) {
            // callback if pressed/hold or freshly released
            this.getActionCallbacks().forEach(buttonCallback => buttonCallback(value));
        }
        this._wasPressed = isPressed;
    }
}

class AxisInputAction extends AbstractInputAction{
    /**
     * @param {string} name the input action name.
     */
    constructor(name) {
        super(name);
        this._type = ActionType.AXIS;
        this._wasPressed = false;
    }

    parseInputs() {
        let val = 0;
        const inputs = this.getBindedInputs();
        for (let i = 0; i < inputs.length; i++) {
            const tmp = inputs[i].getInputValue();
            if(tmp > val) val = tmp;
        }
        if(val > 0){
            // If axis is pressed, send callback all the time
            this._wasPressed = true;
            this.getActionCallbacks().forEach(axisCallback => axisCallback(val));
        } else if (this._wasPressed){
            // If axis is not pressed, only send a callback when it's released.
            this._wasPressed = false;
            this.getActionCallbacks().forEach(axisCallback => axisCallback(val));
        }
    }
}

class PositionInputAction extends AbstractInputAction{
    constructor(name) {
        super(name);
        this._type = ActionType.POSITION;
        this._previousPosition = new Vec2(0,0);
    }

    parseInputs() {
        // TODO can use multiple mouses/touch devices?
        const cursor = this.getBindedInputs()[0].getInputValue();

        // Only callback if the position changed
        if(!this._previousPosition.equals(cursor.screenPos)){
            this._previousPosition.copy(cursor.screenPos);
            this.getActionCallbacks().forEach(positionCallback => positionCallback(cursor));
        }
    }
}