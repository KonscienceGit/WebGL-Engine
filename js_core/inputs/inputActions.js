const ActionType = Object.freeze({
    // Button is either pressed or not, can eventually be "clicked".
    BUTTON: "Button",

    // Axis action goes from 0 to 1
    // Can have an inactive/default position (stick) or not (throttle)
    Axis: "Axis",

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
    }

    getName(){
        return this._name;
    }

    /** @param {AbstractInput} input */
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
     * @param {number} delta the delta since last input actuation, in seconds. */
    /** @return {callback[]} */
    getActionCallbacks(){ return this._actionCallbacks; }

    /** @abstract
     * Fire the callback based on input bindings values.
     * @param {number} delta the time in seconds since the last update
     */
    parseInputs(delta){
        ConsoleUtils.nonImplementedError();
    }
}

class ButtonInputAction extends AbstractInputAction{
    /**
     * @param {string} name the input action name.
     * @param {boolean} [actionOnClick=false] Optional, if this input action is only activable on click (letting the input pressed don't trigger it on repetition, only fresh press take effect.
     */
    constructor(name, actionOnClick) {
        super(name);
        this._wasPressed = false;
        this._onClick = actionOnClick ? actionOnClick : false;
    }

    parseInputs(delta) {
        let isPressed = false;
        const inputs = this.getBindedInputs();
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].isInputPressed()) {
                isPressed = true;
                break;
            }
        }
        if(isPressed && (!this._onClick || !this._wasPressed)){
            this.getActionCallbacks().forEach(buttonCallback => buttonCallback(delta));
        }
        this._wasPressed = isPressed;
    }
}