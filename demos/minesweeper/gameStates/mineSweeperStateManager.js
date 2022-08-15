class MineSweeperStateManager extends AbstractStateManager{
    /**
     * The state manager of the demo.
     * This is an exemple implementation of the game state logic.
     * @param {GameObjectsManager} gameObjectManager
     * @param {MinesweeperInputManager} gameBindings
     */
    constructor(gameObjectManager, gameBindings) {
        super();
        this._gameState = new MainGameState(gameObjectManager, gameBindings);
        this.setActiveState(this._gameState);
    }
}
