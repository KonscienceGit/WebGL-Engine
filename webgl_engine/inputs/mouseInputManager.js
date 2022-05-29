class MouseInputManager extends AbstractInputManager {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Renderer} renderer
     * @param {CursorProperties} [cursorProperties] set a custom cursorProperties, when it needs to be shared among inputManagers or cursors.
     */
    constructor(canvas, renderer, cursorProperties) {
        super();
        const self = this;
        this.mouseMoved = this.mouseMoved.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.touchMoved = this.touchMoved.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchEnd = this.touchEnd.bind(this);

        this._canvas = canvas;
        this._renderer = renderer;
        this._cursorProperties = cursorProperties != null ? cursorProperties : new CursorProperties();
        this._mouseBtn = new Array(5).fill(false);

        canvas.addEventListener("mousemove", self.mouseMoved);
        canvas.addEventListener("mousedown", self.mouseDown);
        canvas.addEventListener("mouseup", self.mouseUp);
        canvas.addEventListener("mouseenter", self.mouseEnter);
        canvas.addEventListener("mouseleave", self.mouseLeave);

        canvas.addEventListener("touchmove", self.touchMoved, {'passive': false});
        canvas.addEventListener("touchstart", self.touchStart, {'passive': false});
        canvas.addEventListener("touchend", self.touchEnd);
    }

    /**
     * @returns {CursorProperties}
     */
    getCursorProperties(){
        return this._cursorProperties;
    }

    /**
     * @param {MouseInputIdentifier} buttonID
     * @returns {boolean}
     */
    getMouseButton(buttonID){
        return this._mouseBtn[buttonID];
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
        this._cursorProperties.lastMovement.setValues(event.screenX - this._cursorProperties.screenPos.x, event.screenY - this._cursorProperties.screenPos.y);
        this._cursorProperties.screenPos.setValues(event.screenX, event.screenY)
        // Adjust based on the real position of the current DOM element thingy
        this._cursorProperties.canvasPos.setValues(event.clientX - rect.left, event.clientY - rect.top);

        // Convert to engine space (same dimensions in pixel, but coordinate 0,0 is at the center instead of top left, y axis is inverted)
        const screenWorldSize = this._renderer.getCamera().getScreenWorldSize();
        this._cursorProperties.screenWorldPos.setValues(this._cursorProperties.canvasPos.x - rect.width / 2,  rect.height / 2 - this._cursorProperties.canvasPos.y);
        this._cursorProperties.screenWorldPos.x *= screenWorldSize.x / rect.width;
        this._cursorProperties.screenWorldPos.y *= screenWorldSize.y / rect.height;
    }

    createMouseMoveInput(){
        return new MouseMovedInput(this);
    }

    /**
     * @param buttonID
     * @returns {MouseButtonInput}
     */
    createMouseButtonInput(buttonID){
        return new MouseButtonInput(this, buttonID);
    }

    createMouseWheelInput(){
        // TODO
    }
}
