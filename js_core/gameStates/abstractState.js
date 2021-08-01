/**
 * @abstract
 */
class AbstractState {
    constructor() {
    }

    /**
     * @abstract
     * @param action, see GameInputActions
     * @param {*} options
     */
    fireInputAction(action, options) {
    }

    /**
     * @abstract
     * @param {number} delta
     */
    updateState(delta) {
    }

    /**
     * @abstract
     * Return whether this state is ready to go to the next state.
     * @returns {boolean}
     */
    goToNextState() {
        return this._goToNextState;
    }

    /**
     * @abstract
     * Return the identifier of the next state.
     * @returns {string}
     */
    getNextState() {
        return "NoState";
    }

    /**
     * Called before transition from this state to another.
     * @abstract
     */
    finish() {
    }
}