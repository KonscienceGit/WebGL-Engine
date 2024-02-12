const FULLSCREEN_BUTTON = true;

class MainGameState extends AbstractState {
    /**
     * @param {Orrery2DObjectsManager} objectManager
     * @param {Orrery2DInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._om = objectManager;
        this._fullScreenButton = null;
        this._renderer = objectManager.renderer;
        this._scene = this._renderer.getScene();
        if (FULLSCREEN_BUTTON) {
            this._fullScreenButton = new FullScreenButton();
            this._scene.getRoot().add(this._fullScreenButton);
        }

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
    }

    finish() {
    }

    getNextState() {
        return null;
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
            const pickResult = this._cursorProperties.pick(this._fullScreenButton);
            if (pickResult != null && pickResult === this._fullScreenButton) {
                this._fullScreenButton.toggleFullScreen();
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
