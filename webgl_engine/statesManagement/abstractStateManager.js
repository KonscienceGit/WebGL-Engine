class AbstractStateManager {
    /**
     * Basic abstract State manager handling AbstractStates.
     */
    constructor() {
        this._activeState = null;
    }

    /**
     * @protected
     * @param {AbstractState} state
     */
    setActiveState(state) {
        this._activeState = state;
    }

    /**
     * @public
     * @param {number} delta time since the previous frame, in seconds.
     */
    updateCurrentState(delta) {
        this._activeState.updateState(delta);
        if (this._activeState.isStateFinished()) {
            this.setActiveState(this._activeState.getNextState());
        }
    }
}
