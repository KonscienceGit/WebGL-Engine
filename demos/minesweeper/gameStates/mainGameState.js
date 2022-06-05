class MainGameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._tiles = objectManager.tiles;
        this._tilesNumbers = objectManager.tilesNumbers;
        this._cursorProperties = null;

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        this.leftClickCallback = this.leftClickCallback.bind(this);
        this.cursorMoveCallback = this.cursorMoveCallback.bind(this);

        this.registerBindings(gameBindings);
    }

    start(){
        this._gameOver = false;
        this._tiles.createTiles();
        this._tiles.setVisible(true);
        this._tilesNumbers.setVisible(true);
    }

    finish() {}

    getNextState() {
        if(this._gameOver){
            return this._gameOverState;
        } else {
            return this._escapeState;
        }
    }

    mainLoop(delta) {}

    animateIn(delta, animationState) {}

    animateOut(delta, animationState) {}

    leftClickCallback(value){
        if (!this._cursorProperties || value < 1) return;
        this._tiles.clicTile(this._cursorProperties);
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties){
        this._cursorProperties = cursorProperties;
    }

    registerBindings(gameBindings){
        const self = this;
        const cursorMove = gameBindings.getActionByName(GameInputActions.CURSOR_AT);
        cursorMove.addActionCallback(self.cursorMoveCallback);

        const leftClick = gameBindings.getActionByName(GameInputActions.LEFT_CLICK);
        leftClick.addActionCallback(self.leftClickCallback);
    }


}
