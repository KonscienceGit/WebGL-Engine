class Orrery2DStateManager extends AbstractStateManager {
    /**
     * The state manager of the demo.
     * This is an exemple implementation of the game state logic.
     * @param {Orrery2DInputManager} gameBindings
     * @param {Scene2D} scene
     */
    constructor(gameBindings, scene) {
        super();
        this._gameState = new MainGameState(gameBindings, scene);
        this.setActiveState(this._gameState);
    }
}
