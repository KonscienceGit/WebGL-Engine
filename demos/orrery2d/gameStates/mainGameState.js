const FULLSCREEN_BUTTON = true;

class MainGameState extends AbstractState {
    /**
     * @param {Orrery2DInputManager} gameBindings
     * @param {Scene2D} scene
     */
    constructor(gameBindings, scene) {
        super();
        this._fullScreenButton = null;
        this._scene = scene;
        if (FULLSCREEN_BUTTON) {
            this._fullScreenButton = new FullScreenButton();
            this._scene.getRoot().add(this._fullScreenButton);
        }
        this._mapNode = new Entity();
        this._scene.getRoot().add(this._mapNode);
        this._cursorProperties = null;
        this._mouseLeftDown = false;
        this._mouseRightDown = false;

        this._lastCursorPos = null;

        // Load the solar system
        Orrery2DObjectsManager.loadSolarSystem(this._mapNode);

        // Set animations duration
        this.setAnimateInLength(0.0);
        this.setAnimateOutLength(0.0);

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        gameBindings.addCallbackToAction(Orrery2DActions.CURSOR_MOVE, this.cursorMoveCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.LEFT_CLICK, this.leftClickCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.RIGHT_CLICK, this.rightClickCallback.bind(this));

        gameBindings.addCallbackToAction(Orrery2DActions.MOUSEWHEEL_MOVE_UP, this.mouseWheelUpCallback.bind(this));
        gameBindings.addCallbackToAction(Orrery2DActions.MOUSEWHEEL_MOVE_DOWN, this.mouseWheelDownCallback.bind(this));
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
        // TODO
        // this._om.sun.rotation += delta / 4;
        // this._om.earth.rotation += delta;
    }

    animateIn(delta, animationState) {
    }

    animateOut(delta, animationState) {
    }

    leftClickCallback(value) {
        this._mouseLeftDown = !!value;
        this.click(value, true);
    }

    rightClickCallback(value) {
        this._mouseRightDown = !!value;
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
        if (this._lastCursorPos == null) {
            this._lastCursorPos = this._cursorProperties.screenWorldPos.clone();
        }
        if (this._mouseLeftDown || this._mouseRightDown) {
            const x = this._cursorProperties.screenWorldPos.x - this._lastCursorPos.x;
            const y = this._cursorProperties.screenWorldPos.y - this._lastCursorPos.y;
            this._mapNode.position.x += x;
            this._mapNode.position.y += y;
        }
        this._lastCursorPos.copy(this._cursorProperties.screenWorldPos);
    }

    mouseWheelUpCallback(wheelPos) {
        if (wheelPos > 0) {
            this._mapNode.scale.mulScalar(0.9);
            this._mapNode.position.mulScalar(0.9);
        }
    }

    mouseWheelDownCallback(wheelPos) {
        if (wheelPos > 0) {
            this._mapNode.scale.mulScalar(1.1);
            this._mapNode.position.mulScalar(1.1);
        }
    }
}
