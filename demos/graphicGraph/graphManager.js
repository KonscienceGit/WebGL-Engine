class GraphManager {
    /**
     * @param {Renderer} renderer
     * @param {CursorProperties} cursorProperties used for cursor operations
     * @param {GeneralInputManager} graphInputManager for bindings
     */
    constructor(renderer, cursorProperties, graphInputManager) {
        const whiteColor = new Vec4(1,1,1,1);
        const blackColor = new Vec4(0,0,0,1);
        const darkRedColor = new Vec4(0.8,0,0,1);
        this._camera = renderer.getCamera();
        this._cursorProperties = null;
        this._needsUpdate = true;
        this._isMouseDown = false;
        this._camMovement = new Vec2(0, 0);
        this._lastCursorPos = new Vec2(0, 0);
        this._tmpVec2 = new Vec2(0, 0);

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        this.leftClickCallback = this.leftClickCallback.bind(this);
        this.cursorMoveCallback = this.cursorMoveCallback.bind(this);
        this.mouseWheelUpCallback = this.mouseWheelUpCallback.bind(this);
        this.mouseWheelDownCallback = this.mouseWheelDownCallback.bind(this);
        this.registerBindings(graphInputManager);

        this.graphPoints = new MultiSprite(renderer, {color: darkRedColor});
        this.axis = new AnnotatedAxisOverlay(renderer, blackColor);
        this.fullscreenButton = new Sprite(renderer, {imagespaths:'../../resources/minesweeper/Fullscreen.png'});
        this.fullscreenButton.visible = false;

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.fullscreenButton);
        this.spriteArray.push(this.axis);
        this.spriteArray.push(this.graphPoints);
    }

    init() {
        // Init after objects have loaded their textures
        this.graphPoints.size.setValues(0.01, 0.01);
        if (document.fullscreenEnabled) {
            const fsbSize = 0.15;
            this.fullscreenButton.position.setValues(-0.5 - fsbSize, -0.5 - fsbSize);
            this.fullscreenButton.setHeight(fsbSize);
            this.fullscreenButton.isRound = false;
            this.fullscreenButton.radius = 0;
            this.fullscreenButton.visible = true;
        }
        this.updateGraph();
    }

    updateGraph () {
        const nbPoints = 30;
        this.graphPoints.setInstances([]);
        for (let i = 0; i < nbPoints; i++) {
            const val = i / (nbPoints - 1);
            const interpolated = Interpolator.circleCurve(val, true, false, false);
            this.graphPoints.createNewInstance(true).position.setValues(val, interpolated);
        }
        this._needsUpdate = true;
    }

    needsUpdate () {
        return this._needsUpdate;
    }

    update(){
        this._needsUpdate = false;
    }

    leftClickCallback(value){
        if (!this._isMouseDown && value === 1) {
            this._lastCursorPos.copy(this._cursorProperties.screenWorldPos);
        }
        this._isMouseDown = value === 1;
        if (!this._isMouseDown) this._camMovement.setValues(0, 0);
        if (!this._cursorProperties || !this._isMouseDown) return;
        if (document.fullscreenEnabled) {
            const pickres = this._cursorProperties.pick(this.fullscreenButton);
            if (pickres === this.fullscreenButton) {
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
    cursorMoveCallback(cursorProperties){
        this._cursorProperties = cursorProperties;
        if (this._isMouseDown) {
            const x = this._cursorProperties.screenWorldPos.x - this._lastCursorPos.x;
            const y = this._cursorProperties.screenWorldPos.y - this._lastCursorPos.y;
            const camPos = this._camera.getPosition(this._tmpVec2);
            camPos.x += x;
            camPos.y += y;
            this._camera.setPosition(camPos);
            this._needsUpdate = true;
            this._lastCursorPos.copy(this._cursorProperties.screenWorldPos);
        }
    }

    /**
     * @param {number} wheelPos
     */
    mouseWheelUpCallback(wheelPos){
        if (wheelPos > 0) {
            this._tmpVec2 = this._camera.getScreenWorldSize(this._tmpVec2);
            this._camera.setVerticalScreenWorldSize(this._tmpVec2.y * 0.9);
            this._needsUpdate = true;
        }

    }

    mouseWheelDownCallback(wheelPos){
        if (wheelPos > 0) {
            this._tmpVec2 = this._camera.getScreenWorldSize(this._tmpVec2);
            this._camera.setVerticalScreenWorldSize(this._tmpVec2.y * 1.1);
            this._needsUpdate = true;
        }
    }

    registerBindings(gameBindings){
        gameBindings.addCallbackToAction(GraphActions.CURSOR_MOVE, this.cursorMoveCallback);

        gameBindings.addCallbackToAction(GraphActions.LEFT_CLICK, this.leftClickCallback);

        gameBindings.addCallbackToAction(GraphActions.MOUSEWHEEL_MOVE_UP, this.mouseWheelUpCallback);
        gameBindings.addCallbackToAction(GraphActions.MOUSEWHEEL_MOVE_DOWN, this.mouseWheelDownCallback);
    }
}