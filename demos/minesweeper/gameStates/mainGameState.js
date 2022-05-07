class MainGameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._worldPixelSize = objectManager.getPixelPerfectTool().getResolution();
        // this._aliensSprites = objectManager.getAliens();

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(0.0);// No animation

        // Bind closure context
        // this.fireShipCallback = this.fireShipCallback.bind(this);
        this.registerBindings(gameBindings);
    }

    start(){
        this._gameOver = false;
        // this._scoreCounter.setScore(0);
        // this._scoreCounter.resetPosition();
        // this._scoreCounter.getReferencePosition().moveLeft(this._guiShift);
        // this._scoreCounter.setVisible(true);
        // this._aliensSprites.setVisible(true);
    }

    finish() {
        // this._aliensSprites.setVisible(false);
    }

    setEscapeState(escapeState){
        this._escapeState = escapeState;
    }

    setGameOverState(gameOverState){
        this._gameOverState = gameOverState;
    }

    getNextState() {
        if(this._gameOver){
            return this._gameOverState;
        } else {
            return this._escapeState;
        }
    }

    mainLoop(delta) { }

    animateIn(delta, animationState) { }

    animateOut(delta, animationState) {/* Nothing to animate */}

    // fireShipCallback(value){
    // }

    registerBindings(gameBindings){
        const self = this;
        // const fireShip = gameBindings.getActionByName(GameInputActions.SHIP_FIRE);
        // fireShip.addActionCallback(self.fireShipCallback);
    }
}
