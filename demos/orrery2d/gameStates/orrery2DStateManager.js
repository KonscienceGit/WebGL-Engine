class Orrery2DStateManager extends AbstractStateManager {
    /**
     * The state manager of the demo.
     * This is an exemple implementation of the game state logic.
     * @param {Orrery2DObjectsManager} gameObjectManager
     * @param {Orrery2DInputManager} gameBindings
     */
    constructor(gameObjectManager, gameBindings) {
        super();
        this._gameState = new MainGameState(gameObjectManager, gameBindings);
        this.setActiveState(this._gameState);
    }
}
