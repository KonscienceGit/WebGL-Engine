class MainGameState extends AbstractState {
    /**
     * @param {Orrery2DObjectsManager} objectManager
     * @param {Orrery2DInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._gameOverState = null;
        this._escapeState = null;
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
        gameBindings.addCallbackToAction(Orrery2DActions.CURSOR_AT, this.cursorMoveCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.LEFT_CLICK, this.leftClickCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.RIGHT_CLICK, this.rightClickCallback.bind(this));
    }

    start() {
        // Create GUI
        this._gameOver = false;
        if (document.fullscreenEnabled) {
            const fsbSize = 0.15;
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
    }

    /**
     * @param {CursorProperties} cursorProperties
     */
    cursorMoveCallback(cursorProperties) {
        this._cursorProperties = cursorProperties;
    }
}
