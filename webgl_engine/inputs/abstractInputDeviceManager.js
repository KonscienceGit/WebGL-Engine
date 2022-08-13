class AbstractInputDeviceManager {
    constructor() {
    }

    /**
     * @deprecated
     * @returns {boolean} true if a new input has been detected while parsing.
     */
    parseInputs() {
        console.log('Warning! deprecated parseInput in AbstractInputManager');
        return false;
    }

    /**
     * Perform necessary operations after finishing parsing. (like setting the mousewheel state back to 0)
     * @abstract
     */
    postParsingUpdate(){
        ConsoleUtils.nonImplementedError();
    }
}
