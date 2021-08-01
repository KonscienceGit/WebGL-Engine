class StateManager {
    /**
     * @param {GameObjectsManager} gameObjectManager
     * @param {Renderer} renderer
     * @param {HTMLCanvasElement} canvas
     */
    constructor(gameObjectManager, renderer, canvas) {
        this._keyboardManager = new KeyboardInputManager();
        this._gamepadManager = new GamepadInputManager();
        this._mouseManager = new MouseInputManager(canvas, renderer);
        this._objectManager = gameObjectManager;
        /** @type {AbstractState} */
        this._activeState = this.createStartMenuGameState();
        /** @type {AbstractInputManager} */
        this._activeInput = this._keyboardManager;
    }

    /**
     * @param {number} delta, in seconds.
     */
    updateCurrentState(delta) {
        if (this._gamepadManager.parseInputs()) this._activeInput = this._gamepadManager;
        if (this._keyboardManager.parseInputs()) this._activeInput = this._keyboardManager;
        if (this._mouseManager.parseInputs()) this._activeInput = this._mouseManager;

        this._activeInput.updateStates(this);
        this._activeState.updateState(delta);

        if (this._activeState.goToNextState()) {
            const nextState = this._activeState.getNextState();
            this._activeState.finish();

            switch (nextState) {
                case "GameState":
                    this._activeState = this.createGameState();
                    break;

                case "StartMenuState":
                    this._activeState = this.createStartMenuGameState();
                    break;

                case "ReplayMenuState":
                    this._activeState = this.createReplayMenuGameState();
                    break;
                default:
            }
        }
    }

    /**
     * @param action, see GameInputActions
     * @param {*} [options]
     */
    fireInputAction(action, options) {
        this._activeState.fireInputAction(action, options);
    }

    createGameState() {
        return new GameState(this._objectManager);
    }

    createStartMenuGameState() {
        return new StartMenuState(this._objectManager);
    }

    createReplayMenuGameState() {
        return new ReplayMenuState(this._objectManager);
    }
}