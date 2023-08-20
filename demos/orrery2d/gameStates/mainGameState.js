class MainGameState extends AbstractState {
    /**
     * @param {Orrery2DObjectsManager} objectManager
     * @param {Orrery2DInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._om = objectManager; // TODO remove?
        this._gameOverState = null;
        this._escapeState = null;
        this._fullScreenButton = objectManager.fullscreenButton;
        this._renderer = objectManager.renderer;
        this._cursorProperties = null;

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
        if (document.fullscreenEnabled && this._fullScreenButton) {
            this.updateFullScreenPos();
            this._fullScreenButton.setVisible(true);
            this._fullScreenButton.isRound = false;
        }
        this._renderer.setOnResizeCallback(this.updateFullScreenPos.bind(this));
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
        this._om.sun.rotation += delta / 4;
        this._om.earth.rotation += delta;
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

    updateFullScreenPos() {
        const worldSize = this._renderer.getScene().getCamera().getScreenWorldSize();
        const fsbSize = 0.1 * worldSize.y;
        const offset = fsbSize * 0.75;
        const posX = -0.5 * worldSize.x + offset;
        const posY = -0.5 * worldSize.y + offset;
        this._fullScreenButton.position.setValues(posX, posY);
        this._fullScreenButton.scale.setValues(fsbSize, fsbSize);
    }
}
