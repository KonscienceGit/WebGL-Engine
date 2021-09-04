class AbstractInput {
    constructor() {
    }

    /**
     * @abstract
     * Return whether the input is pressed or not.
     * @returns {boolean}
     */
    isInputPressed(){
        console.log('Method is not implemented!');
        return false;
    }

    /**
     * @abstract
     * Return the value of this input.
     * Digital inputs will return 0 if not pressed, 1 if pressed.
     * Analog inputs will return any value from -1 to 1.
     * 0 usually being the "on rest" state, but this is not always true, because of axis drifts and because throttles don't reset themselves.
     * @returns {number}
     */
    getInputValue(){
        console.log('Method is not implemented!');
        return 0;
    }

    /**
     * @abstract
     * Return whether this input conflicts with the specified input.
     * @param anotherInput the other input to check conflict with.
     * @returns {boolean}
     */
    isConflictingInput(anotherInput){
        console.log('Method is not implemented!');
        return true;
    }
}