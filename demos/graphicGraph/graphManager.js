class GraphManager {
    /**
     * @param {Renderer} renderer
     * @param {CursorProperties} cursorProperties used for the grpahic cursor
     */
    constructor(renderer, cursorProperties, gameBindings) {
        const whiteColor = new Vec4(1,1,1,1);
        const blackColor = new Vec4(0,0,0,1);
        const darkRedColor = new Vec4(0.8,0,0,1);
        this._cursorProperties = null;

        // Bind the 'this' context for theses functions (otherwise it's lost when used as callback)
        this.leftClickCallback = this.leftClickCallback.bind(this);
        this.cursorMoveCallback = this.cursorMoveCallback.bind(this);
        this.registerBindings(gameBindings);

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
    }

    leftClickCallback(value){
        if (!this._cursorProperties || value !== 1) return;
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
    }

    registerBindings(gameBindings){
        const self = this;
        const cursorMove = gameBindings.getActionByName(GameInputActions.CURSOR_AT);
        cursorMove.addActionCallback(self.cursorMoveCallback);

        const leftClick = gameBindings.getActionByName(GameInputActions.LEFT_CLICK);
        leftClick.addActionCallback(self.leftClickCallback);
    }
}
