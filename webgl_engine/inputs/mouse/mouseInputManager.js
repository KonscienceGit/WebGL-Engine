class MouseInputManager extends AbstractInputDeviceManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        super();
        const self = this;
        this.mouseMoved = this.mouseMoved.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.mouseWheelMove = this.mouseWheelMove.bind(this);

        this.touchMoved = this.touchMoved.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this._canvas = renderer.getCanvas();
        this._renderer = renderer;
        this._wheelPos = 0;
        this._cursorProperties = new CursorProperties();
        this._mouseBtn = new Array(5).fill(false);
        this._tmpVec2 = new Vec2(0, 0);

        this._canvas.addEventListener("mousemove", self.mouseMoved);
        this._canvas.addEventListener("mousedown", self.mouseDown);
        this._canvas.addEventListener("mouseup", self.mouseUp);
        this._canvas.addEventListener("mouseenter", self.mouseEnter);
        this._canvas.addEventListener("mouseleave", self.mouseLeave);
        this._canvas.addEventListener("wheel", self.mouseWheelMove);

        this._canvas.addEventListener("touchmove", self.touchMoved, {'passive': false});
        this._canvas.addEventListener("touchstart", self.touchStart, {'passive': false});
        this._canvas.addEventListener("touchend", self.touchEnd);
    }

    /**
     * @returns {CursorProperties}
     */
    getCursorProperties(){
        return this._cursorProperties;
    }

    /**
     * @param {MouseButton} buttonID
     * @returns {boolean}
     */
    getMouseButton(buttonID){
        return this._mouseBtn[buttonID];
    }

    getMouseWheelPos(){
        return this._wheelPos;
    }

    /**
     * @param {MouseEvent} event
     */
    mouseMoved(event) {
        this.updateCursor(event);
    }

    mouseDown(event) {
        this.updateCursor(event);
        this._mouseBtn[event.button] = true;
    }

    mouseUp(event) {
        this.updateCursor(event);
        this._mouseBtn[event.button] = false;
    }

    mouseEnter() {
        this._cursorProperties.isOutside = false;
    }

    mouseLeave() {
        this._cursorProperties.isOutside = true;
    }

    /**
     * @param {WheelEvent} event
     */
    mouseWheelMove(event) {
        this._wheelPos = Math.sign(event.deltaY);
    }

    /**
     * @param {TouchEvent} event
     */
    touchMoved(event){
        this.updateCursor(event.touches[0]);
    }

    /**
     * @param {TouchEvent} event
     */
    touchStart(event){
        this._mouseBtn[0] = true;
        this.updateCursor(event.touches[0]);
    }

    /**
     * @param {TouchEvent} event
     */
    touchEnd(event){
        this._mouseBtn[0] = false;
        this.updateCursor(event.changedTouches[0]);
    }


    updateCursor(event) {
        const rect = this._canvas.getBoundingClientRect();
        // Get difference between previous position and current position
        this._cursorProperties.lastPixelMovement.setValues(event.screenX - this._cursorProperties.screenPos.x, event.screenY - this._cursorProperties.screenPos.y);
        this._cursorProperties.screenPos.setValues(event.screenX, event.screenY);
        // Adjust based on the real position of the current DOM element thingy
        this._cursorProperties.canvasPos.setValues(event.clientX - rect.left, event.clientY - rect.top);


        // Compute cursor position in pixels, with 0 being center of the viewport.
        this._cursorProperties.devicePos.setValues(this._cursorProperties.canvasPos.x - rect.width / 2,  rect.height / 2 - this._cursorProperties.canvasPos.y);
        this._cursorProperties.screenWorldPos.copy(this._cursorProperties.devicePos);

        // Convert pixel pos in device pos [-0.5, 0.5]
        // noinspection JSSuspiciousNameCombination
        this._cursorProperties.devicePos.x /= rect.height; // on purpose as we use screen height to define the device size unit. width differ based on screen ratio
        this._cursorProperties.devicePos.y /= rect.height;

        this._renderer.getCamera().getScreenWorldSize(this._tmpVec2);
        this._cursorProperties.screenWorldPos.x *= this._tmpVec2.x / rect.width;
        this._cursorProperties.screenWorldPos.y *= this._tmpVec2.y / rect.height;
        this._renderer.getCamera().getPosition(this._cursorProperties.worldPosOffset);
    }

    /**
     * @param {MouseInputIdentifiers} inputId
     * @param {ActionType} actionType
     */
    createInput(inputId, actionType){
        let input = null;
        switch (inputId.getInputType()) {
            case MouseInputType.BUTTON:
                if (actionType === ActionType.POSITION || actionType === ActionType.THROTTLE) {
                    throw new Error('Error: cannot bind a Button to a ' + actionType + ' action!');
                }
                input = new MouseButtonInput(this, inputId.getNumber());
                break;
            case MouseInputType.CURSOR_POSITION:
                if (actionType === ActionType.BUTTON) {
                    throw new Error('Error: cannot bind a mouse position to a ' + actionType + ' action!');
                }
                if (actionType === ActionType.AXIS || actionType === ActionType.THROTTLE) {
                    throw new Error('Error: ' + actionType + ' action is not yet implemented for mouse movement input!');
                }
                input = new MouseMovedInput(this);
                break;
            case MouseInputType.WHEEL:
                if (actionType === ActionType.POSITION) {
                    throw new Error('Error: cannot bind a mouse wheel to a ' + actionType + ' action!');
                }
                input = new MouseWheelInput(this, inputId.getNumber());
                break;
            default:
                console.error('Error: ' + inputId.getInputType() + ' is not a valid mouse input type.')
        }
        return input;
    }

    postParsingUpdate() {
        this._wheelPos = 0;
    }
}
