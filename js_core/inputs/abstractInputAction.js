/**
 * @abstract
 * Defines an in-game action
 * (like jumping, moving forward, selecting and validating a selected menu options etc)
 */
class AbstractInputAction{
    /**
     * @param {string} name the input action name.
     * @param {boolean} isBindingMandatory if this binding is allowed to not being binded, or conflict with another binding.
     */
    constructor(name, isBindingMandatory) {
        this._name = name;
        this._isBindingMandatory = isBindingMandatory;
        this._bindedInputs = [];
        this._actionCallbacks = [];
    }

    getName(){
        return this._name;
    }

    isBindingMandatory(){
        return this._isBindingMandatory;
    }

    /**
     * @param {AbstractInput} input
     */
    addInput(input){
        if(!this._bindedInputs.includes(input)) this._bindedInputs.push(input);
    }

    /**
     * @returns {AbstractInput[]}
     */
    getBindedInputs(){
        return this._bindedInputs;
    }

    /**
     * @param {Object} callback
     */
    addActionCallback(callback){
        if(!this._actionCallbacks.includes(callback)) this._actionCallbacks.push(callback);
    }

    /**
     * @return {Object[]}
     */
    getActionCallbacks(){
        return this._actionCallbacks;
    }

    /**
     * @abstract
     * Fire the callback based on input bindings values.
     * @param {number} delta the time in seconds since the last update
     */
    parseInputs(delta){
    }
}

//TODO move to specific files
class BasicInputAction extends AbstractInputAction{
    /**
     * @param {string} name the input action name.
     * @param {boolean} isBindingMandatory if this binding is allowed to not being binded, or conflict with another binding.
     * @param {boolean} [actionOnClick=false] Optional, if this input action is only activable on click (letting the input pressed don't trigger it on repetition, only fresh press take effect.
     */
    constructor(name, isBindingMandatory, actionOnClick) {
        super(name, isBindingMandatory);
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
            this.getActionCallbacks().forEach(callbackAction => callbackAction(delta));
        }
        this._wasPressed = isPressed;
    }
}