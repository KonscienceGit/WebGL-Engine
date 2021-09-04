class StateManager {
    /**
     * The state manager of the space shooter demo.
     * This is an exemple implementation of the game state logic.
     * @param {GameObjectsManager} gameObjectManager
     * @param {Renderer} renderer
     * @param {HTMLCanvasElement} canvas
     * @param {SsdBindings} gameBindings
     */
    constructor(gameObjectManager, renderer, canvas, gameBindings) {
        // New input system
        this._gameBindings = gameBindings;

        // TODO Old input system
        /** @type {AbstractInputManager} */
        this._activeInput = this._gameBindings.getKeyboardManager();


        this._objectManager = gameObjectManager;

        // States
        this._startMenuState = new StartMenuState(this._objectManager, this._gameBindings);
        this._gameState = new GameState(this._objectManager, this._gameBindings);
        this._replayMenuState = new ReplayMenuState(this._objectManager, this._gameBindings);

        this._startMenuState.setNextState(this._gameState);
        this._gameState.setEscapeState(this._startMenuState);
        this._gameState.setGameOverState(this._replayMenuState);
        this._replayMenuState.setNextState(this._startMenuState);

        /** @type {AbstractState} */
        this._activeState = this._startMenuState;
    }

    /**
     * @param {number} delta, in seconds.
     */
    updateCurrentState(delta) {
        // TODO Old input system
        if (this._gameBindings.getGamepadManager().parseInputs()) this._activeInput = this._gameBindings.getGamepadManager();
        if (this._gameBindings.getKeyboardManager().parseInputs()) this._activeInput = this._gameBindings.getKeyboardManager();
        if (this._gameBindings.getMouseManager().parseInputs()) this._activeInput = this._gameBindings.getMouseManager();
        this._activeInput.updateStates(this);

        this._activeState.updateState(delta);

        if (this._activeState.goToNextState()) {
            this._activeState = this._activeState.getNextState();
        }
    }

    // TODO remove
    /**
     * @deprecated
     * @param action, see GameInputActions
     * @param {*} [options]
     */
    fireInputAction(action, options) {
        this._activeState.fireInputAction(action, options);
    }
}