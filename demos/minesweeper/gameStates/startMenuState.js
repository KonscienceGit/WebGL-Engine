class StartMenuState extends AbstractState {
    /**
     * @param {GameObjectsManager} objectManager
     * @param {MinesweeperInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._nextState = null;
        // Bind the closure context
        // this.selectMenuActionCallback = this.selectMenuActionCallback.bind(this);
        this.registerBindings(gameBindings);
        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(1.0);
    }

    start(){
    }

    finish() {
    }

    setNextState(nextState){
        this._nextState = nextState;
    }

    getNextState() {
        return this._nextState;
    }

    mainLoop(delta) {
    }

    animateIn(delta, animationState) {
    }

    animateOut(delta, animationState) {
    }

    registerBindings(gameBindings){
        const self = this;
        // const validateMenuAction = gameBindings.getActionByName(GameInputActions.MENU_VALID_SELECTION);
        // validateMenuAction.addActionCallback(self.selectMenuActionCallback);
    }
}
