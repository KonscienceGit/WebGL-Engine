class MouseInputManager extends AbstractInputManager {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Renderer} renderer
     */
    constructor(canvas, renderer) {
        super();
        const self = this;
        this.mouseMoved = this.mouseMoved.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.touchMoved = this.touchMoved.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchStart = this.touchStart.bind(this);

        this._canvas = canvas;
        this._renderer = renderer;
        this._hasNewInput = false;
        this._mousePos = new Vec2(0, 0);
        this._mouseButtonDown = false;
        this._mouseButtonClicked = false;

        canvas.addEventListener("mousemove", self.mouseMoved);
        canvas.addEventListener("mousedown", self.mouseDown);
        canvas.addEventListener("mouseup", self.mouseUp);

        canvas.addEventListener("touchmove", self.touchMoved, {'passive': false});
        canvas.addEventListener("touchstart", self.touchStart, {'passive': false});
        canvas.addEventListener("touchend", self.mouseUp);
    }


    // TODO deprecated
    updateStates(stateManager) {
        let x = this._mousePos.x / this._canvas.width;
        x = x * 2 - 1;
        x = Math.round(x * this._renderer.getVirtualViewPortSize().x / 2);
        let y = this._mousePos.y / this._canvas.height;
        y = -(y * 2 - 1);
        y = Math.round(y * this._renderer.getVirtualViewPortSize().y / 2);
        stateManager.fireInputAction(GameInputActions.CURSOR_AT, [x, y]);

        if (this._mouseButtonClicked) {
            stateManager.fireInputAction(GameInputActions.CLICK_AT, [x, y]);
            this._mouseButtonClicked = false;
        }
    }

    /**
     * @deprecated
     * @return {boolean}
     */
    parseInputs() {
        //keyboard input parsing is done on the events.
        const hasNewInput = this._hasNewInput;
        this._hasNewInput = false;
        return hasNewInput;
    }

    /**
     * @param {MouseEvent} event
     */
    mouseMoved(event) {
        this.move(event.clientX, event.clientY);
    }

    mouseDown(event) {
        this.clic(event.clientX, event.clientY);
    }

    mouseUp() {
        this._mouseButtonDown = false;
        this._mouseButtonClicked = false;
        this._hasNewInput = true;
    }

    /**
     * @param {TouchEvent} event
     */
    touchMoved(event){
        const touch = event.touches[0];
        this.move(touch.clientX, touch.clientY);
    }

    /**
     * @param {TouchEvent} event
     */
    touchStart(event){
        const touch = event.touches[0];
        this.clic(touch.clientX, touch.clientY);
    }

    clic(x,y){
        this.move(x,y);
        if (!this._mouseButtonDown)
            this._mouseButtonClicked = true;
        this._mouseButtonDown = true;
    }

    move(x,y){
        this.extractCanvasPos(x,y);
        this._hasNewInput = true;
    }

    extractCanvasPos(x,y) {
        const rect = this._canvas.getBoundingClientRect();
        this._mousePos.x = x - rect.left;
        this._mousePos.y = y - rect.top;
    }
}

