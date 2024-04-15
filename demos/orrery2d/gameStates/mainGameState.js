const FULLSCREEN_BUTTON = true;
const SECONDS_IN_DAY = 24 * 60 * 60;

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
        this.setZoomScale(1 / (149.6 * 1e6)); // earth orbit radius
        this._cursorProperties = null;
        this._mouseLeftDown = false;
        this._mouseRightDown = false;
        this._time = 3600;
        /**
         * @type {Entity}
         * @private
         */
        this._focusedEntity = null;

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
        // this._time += delta / SECONDS_IN_DAY;
        this._time += 1 * delta;
        const allNodes = this._mapNode.getAllNodes();
        allNodes.forEach((node) => {
            if (node instanceof StellarBody) {
                node.updateOrbit(this._time);
            }
        });
        this.updateFocus();
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
            // TODO fix picking, need to take into account the scenegraph matrices.
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

    focusTo(entity) {
        // TODO
        this._focusedEntity = entity;
    }

    updateFocus() {
        if (this._focusedEntity == null) return;
        this._focusedEntity.modelWorldMat
    }

    setZoomScale(scale) {
        this._mapNode.scale.mulScalar(scale);
        this._mapNode.position.mulScalar(scale);
    }

    mouseWheelUpCallback(wheelPos) {
        if (wheelPos > 0) {
            this.setZoomScale(1.1);
        }
    }

    mouseWheelDownCallback(wheelPos) {
        if (wheelPos > 0) {
            this.setZoomScale(0.9);
        }
    }
}
