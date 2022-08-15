class MainGameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._tiles = objectManager.tiles;
        this._tilesNumbers = objectManager.tilesNumbers;
        this._fullScreenButton = objectManager.fullscreenButton;
        this._cursorProperties = null;

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        gameBindings.addCallbackToAction(MinesweeperActions.CURSOR_AT, this.cursorMoveCallback.bind(this));
        gameBindings.addCallbackToAction(MinesweeperActions.LEFT_CLICK, this.leftClickCallback.bind(this));
    }

    start(){
        this._gameOver = false;
        this._tiles.createTiles(9, 9);
        this._tiles.setVisible(true);
        this._tilesNumbers.setVisible(true);
        const fsbSize = 0.15;
        if (document.fullscreenEnabled) {
            this._fullScreenButton.position.setValues(-0.5 - fsbSize, 0.);
            this._fullScreenButton.size.setValues(fsbSize, fsbSize);
            this._fullScreenButton.setVisible(true);
            this._fullScreenButton.isRound = false;
        }
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
        if (document.fullscreenEnabled) {
            if (this._cursorProperties.pick(this._fullScreenButton) === this._fullScreenButton) {
                if (document.fullscreenElement == null) {
                    document.documentElement.requestFullscreen().catch();
                } else {
                    document.exitFullscreen().catch();
                }
            }
        }
        this._tiles.clicTile(this._cursorProperties);
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties){
        this._cursorProperties = cursorProperties;
    }
}
