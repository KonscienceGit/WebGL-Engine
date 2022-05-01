class StateManager extends AbstractStateManager{
    /**
     * The state manager of the space shooter demo.
     * This is an exemple implementation of the game state logic.
     * @param {GameObjectsManager} gameObjectManager
     * @param {Renderer} renderer
     * @param {HTMLCanvasElement} canvas
     * @param {GameBindingsDefinitions} gameBindings
     */
    constructor(gameObjectManager, renderer, canvas, gameBindings) {
        super();
        this._startMenuState = new StartMenuState(gameObjectManager, gameBindings);
        this._gameState = new MainGameState(gameObjectManager, gameBindings);
        this._replayMenuState = new ReplayMenuState(gameObjectManager, gameBindings);

        this._startMenuState.setNextState(this._gameState);
        this._gameState.setEscapeState(this._startMenuState);
        this._gameState.setGameOverState(this._replayMenuState);
        this._replayMenuState.setNextState(this._startMenuState);

        this.setActiveState(this._startMenuState);
    }
}
