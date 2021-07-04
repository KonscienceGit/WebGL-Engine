class AbstractInputManager {
    constructor() {
    }

    /**
     * Update the given state manager with this inputManager input states.
     * @param {StateManager} stateManager
     */
    updateStates(stateManager) {
    }

    /**
     * @returns {boolean} true if a new input has been detected while parsing.
     */
    parseInputs() {
        return false;
    }
}

