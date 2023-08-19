class MainGameState extends AbstractState {
    /**
     * @param {MineSweeperObjectsManager} objectManager
     * @param {MinesweeperInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
        this._tiles = objectManager.tiles;
        this._tilesNumbers = objectManager.tilesNumbers;
        this._fullScreenButton = objectManager.fullscreenButton;
        this._renderer = objectManager.renderer;
        this._cursorProperties = null;
        this._screenSize = new Vec2(0, 0);
        this._tmpV2 = new Vec2();
        this._origin = new Vec2(0, 0);

        this._redBlock = objectManager.redBlock;
        this._greenBlock = objectManager.greenBlock;

        /**
         * @type {UIBlock}
         */
        this._mainUiBlock = null;

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        gameBindings.addCallbackToAction(MinesweeperActions.CURSOR_AT, this.cursorMoveCallback.bind(this));
        gameBindings.addCallbackToAction(MinesweeperActions.LEFT_CLICK, this.leftClickCallback.bind(this));
        gameBindings.addCallbackToAction(MinesweeperActions.RIGHT_CLICK, this.rightClickCallback.bind(this));
    }

    start() {
        // Create GUI
        this.updateGUI();
        this._gameOver = false;
        this._tiles.createTiles(9, 9, 0.3);
        this._tiles.setVisible(true);
        this._tilesNumbers.setVisible(true);
        const fsbSize = 0.15;
        if (document.fullscreenEnabled) {
            this._fullScreenButton.position.setValues(-0.5 + fsbSize, 0);
            this._fullScreenButton.scale.setValues(fsbSize, fsbSize);
            this._fullScreenButton.setVisible(true);
            this._fullScreenButton.isRound = false;
        }
    }

    finish() {
    }

    getNextState() {
        if (this._gameOver) {
            return this._gameOverState;
        } else {
            return this._escapeState;
        }
    }

    mainLoop(delta) {
        this.updateGUI();
    }

    updateGUI() {
        // TODO update all these to the new scenegraph way
        if (this._mainUiBlock == null) {
            // Create UI blocks
            this._mainUiBlock = new UIBlock(new Vec2(1, 1));
            const leftBlock = new UIBlock(new Vec2(0.2, 1));
            const rightBlock = new UIBlock(new Vec2(0.8, 1));

            // Set relative block positions, add block to main view block
            leftBlock.setMarginLeft(0);
            rightBlock.setMarginRight(0);
            this._mainUiBlock.addBlock(leftBlock);
            this._mainUiBlock.addBlock(rightBlock);

            // Setup callback when GUI need to update
            const redBlock = this._redBlock;
            leftBlock.setOnUpdateCallback(function (size, position, args) {
                redBlock.size.copy(size);
                redBlock.position.copy(position);
            });
            const greenBlock = this._greenBlock;
            rightBlock.setOnUpdateCallback(function (size, position, args) {
                greenBlock.size.copy(size);
                greenBlock.position.copy(position);
            });
        }

        this._renderer.getCamera().getScreenWorldSize(this._tmpV2);
        if (this._tmpV2.equals(this._screenSize)) return;

        // Update as view size changed
        this._screenSize.copy(this._tmpV2);
        this._mainUiBlock.update(this._tmpV2, this._origin);
    }

    animateIn(delta, animationState) {
    }

    animateOut(delta, animationState) {
    }

    leftClickCallback(value) {
        this.click(value, true);
    }

    rightClickCallback(value) {
        this.click(value, false);
    }

    click(value, leftClick) {
        if (this._cursorProperties == null || value < 1) return;
        if (document.fullscreenEnabled && leftClick) {
            if (this._cursorProperties.pick(this._fullScreenButton) === this._fullScreenButton) {
                if (document.fullscreenElement == null) {
                    document.documentElement.requestFullscreen().catch();
                } else {
                    document.exitFullscreen().catch();
                }
            }
        }
        this._tiles.clicTile(this._cursorProperties, leftClick);
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties) {
        this._cursorProperties = cursorProperties;
    }
}
