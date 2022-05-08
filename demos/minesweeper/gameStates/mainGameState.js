class MainGameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._worldPixelSize = objectManager.pixelPerfectTool.getResolution();
        this._tiles = objectManager.tiles;

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);// No animation

        // Bind closure context
        // this.fireShipCallback = this.fireShipCallback.bind(this);
        this.registerBindings(gameBindings);
    }

    start(){
        this._gameOver = false;
        this.createTiles();
        this._tiles.setVisible(true);
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

    mainLoop(delta) {
    }

    animateIn(delta, animationState) { }

    animateOut(delta, animationState) {/* Nothing to animate */}

    // fireShipCallback(value){
    // }

    registerBindings(gameBindings){
        const self = this;
        // const fireShip = gameBindings.getActionByName(GameInputActions.SHIP_FIRE);
        // fireShip.addActionCallback(self.fireShipCallback);
    }

    createTiles() {
        const size =  1 / 9;
        const nbRow = 9;
        const nbCol = 9;
        for (let row = 0; row < nbRow; row++) {
            let y = row / nbRow - 0.5 - size / 2;
            for (let col = 0; col < nbCol; col++) {
                let x = col / nbCol - 0.5 - size / 2;
                const tile = this._tiles.createNewInstance();
                tile.position.setValues(x, y);
                tile.renderSizeXY.setValues(size, size);
                this._tiles.addInstance(tile);
            }
        }
    }
}
