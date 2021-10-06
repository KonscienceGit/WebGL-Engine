const InputType = Object.freeze({
    // Button digital is either pressed or not.
    // Can have a notion of being "clicked" (the transition from not pressed to pressed, to distinguish from holding the button down).
    BUTTON_DIGITAL: "Button Digital",

    // Button Analog is an Xinput specificity, goes from 0 to 1 similar to axis
    // Can have in-between values between 0 and 1
    // Can have deadzones.
    // Can have a touched and pressed state.
    BUTTON_ANALOG: "Button Analog",

    // Axis go from 0 to 1 (output is always positive)
    // Internally its range is from -1 to 1, but the positive and negative course of an axis are treated as 2 separate axes.
    // So there is a notion of positive and negative axis.
    // Can have in-between values
    // Can have deadzones
    // Have a default position (around 0)
    AXIS: "Axis",

    // Throttle go from 0 to 1
    // (internally it is -1 to 1, but converted to 0,1 for compatibility with axes and linear buttons.
    // Can have in-between values
    // Can have deadzones
    // Have no real default position
    THROTTLE: "Throttle",

    // Is an axis that's used as a button
    // In practice, 1 POV HAT input should be created for each position.
    // Internally, goes from -1 to 1+(can go above 1 for default position)
    // For ref, T16000M thrustmaster uses theses values as inputs:
    // pDefault (> 1), p1 (-1.0), p2 (-0.71), p3 (-0.43), p4 (-0.14), p5 (0.14), p6 (0.43), p7 (0.71), p8 (1.0)
    POV_HAT: "PoV Hat",

    // Screen relative [x,y] controller
    // Can have several status (dragged, click, release etc...)
    POINTING_DEVICE: "Pointing Device"
});

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
     * @returns {number}
     */
    getInputValue(){
        ConsoleUtils.nonImplementedError();
        return 0;
    }

    /**
     * @abstract
     * Return whether this input conflicts with the specified input.
     * @param anotherInput the other input to check conflict with.
     * @returns {boolean}
     */
    isConflictingInput(anotherInput){
        ConsoleUtils.nonImplementedError();
        return true;
    }
}