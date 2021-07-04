class AbstractState {
    /**
     * @param {StateManager} stateManager
     */
    constructor(stateManager) {
        this._gameStateManager = stateManager;
        this._goToNextState = false;
    }

    /**
     * @param action, see InputActions
     * @param {*} options
     */
    fireInputAction(action, options) {
    }

    /**
     * @param {number} delta
     */
    updateState(delta) {
    }

    /**
     * @returns {boolean}
     */
    goToNextState() {
        return this._goToNextState;
    }

    /**
     * @returns {string}
     */
    getNextState() {
        return "NoState";
    }

    finish() {
    }
}