class AbstractInput {
    constructor() {}

    /**
     * @abstract
     * Return whether the input is pressed or not.
     * @returns {boolean}
     */
    isInputPressed(){
        ConsoleUtils.nonImplementedError();
        return false;
    }

    /**
     * @abstract
     * Return the value of this input.
     * Digital inputs will return 0 if not pressed, 1 if pressed.
     * Analog inputs will return any value from -1 to 1.
     * 0 usually being the "on rest" state, but this is not always true, because of axis drifts and because throttles don't reset themselves.
     * Position inputs return the view X and Y coordinates, in pixels
     * @returns {*} any type
     */
    getInputValue(){
        ConsoleUtils.nonImplementedError();
        return 0;
    }
}