class MainGameState extends AbstractState {
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._tiles = objectManager.tiles;
        this._cursorProperties = null;

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);// No animation

        // Bind closure context
        this.leftClickCallback = this.leftClickCallback.bind(this);
        this.cursorMoveCallback = this.cursorMoveCallback.bind(this);

        this.registerBindings(gameBindings);
    }

    start(){
        this._gameOver = false;
        this.createTiles();
        this._tiles.setVisible(true);
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
        const pickedObj = this._cursorProperties.pick(this._tiles.getInstances());
        if (pickedObj == null) return;
        pickedObj.textureLayer++;
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties){
        this._cursorProperties = cursorProperties;
        // TODO create false cursor
    }

    registerBindings(gameBindings){
        const self = this;
        const cursorMove = gameBindings.getActionByName(GameInputActions.CURSOR_AT);
        cursorMove.addActionCallback(self.cursorMoveCallback);

        const leftClick = gameBindings.getActionByName(GameInputActions.LEFT_CLICK);
        leftClick.addActionCallback(self.leftClickCallback);
    }

    createTiles() {
        const size =  1 / 9;
        const nbRow = 9;
        const nbCol = 9;
        for (let row = 0; row < nbRow; row++) {
            let y = row / nbRow - 0.5 + size / 2;
            for (let col = 0; col < nbCol; col++) {
                let x = col / nbCol - 0.5 + size / 2;
                const tile = this._tiles.createNewInstance();
                tile.name = col +'_' + row;
                tile.position.setValues(x, y);
                tile.isRound = false;
                tile.renderSizeXY.setValues(size, size);
                this._tiles.addInstance(tile);
            }
        }
    }
}
