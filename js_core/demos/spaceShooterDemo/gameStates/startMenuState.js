class StartMenuState extends AbstractState {
    /**
     * @param {GameObjectsManager} objectManager
     * @param {SsdBindings} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._nextState = null;
        this._pressToPlayButton = objectManager.getPlayButton();
        this._logoTitleSprite = objectManager.getLogoTitle();
        this._translucentOverlay = objectManager.getTranslucentOverlay();

        this._canvasDimRef = objectManager.getSpaceCraft()._canvasDim;

        // TODO register new inputs system
        this._gameBindings = gameBindings;


        // Bind the closure context
        this.selectMenuActionCallback = this.selectMenuActionCallback.bind(this);

        this.registerBindings();

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(1.0);
    }

    // TODO remove, deprecated
    fireInputAction(action, options) {}

    start(){
        this._growingAnimationState = 0.0;

        this._logoTitleSprite.setPosition(0, 300);
        this._pressToPlayButton.setPosition(0, 0);

        //move before slideIn
        this._pressToPlayButton.getRenderPosition().moveLeft(this._canvasDimRef.y);
        this._logoTitleSprite.getRenderPosition().moveUp(this._canvasDimRef.y);

        this._pressToPlayButton.setVisible(true);
        this._logoTitleSprite.setVisible(true);
        this._translucentOverlay.setOpacity(1.0);
        this._translucentOverlay.setVisible(true);
    }

    finish() {
        this._pressToPlayButton.setVisible(false);
        this._logoTitleSprite.setVisible(false);
        this._translucentOverlay.setVisible(false);
    }

    setNextState(nextState){
        this._nextState = nextState;
    }

    getNextState() {
        return this._nextState;
    }

    selectMenuActionCallback(){
        if(!this.goToNextState()){
            this.setReadyForNextState();
        }
    }

    mainLoop(delta) {
        this._growingAnimationState += 2 * delta;
        if (this._growingAnimationState >= Math.PI) {
            this._growingAnimationState = 0.0;
        }
        const grow = 1.0 + 0.1 * Math.sin(this._growingAnimationState);
        this._pressToPlayButton.setScale(grow, grow);
    }

    animateIn(delta, animationState) {
        const slideIn = this._canvasDimRef.y * delta;
        this._pressToPlayButton.getRenderPosition().moveRight(slideIn);
        this._logoTitleSprite.getRenderPosition().moveDown(slideIn);
    }

    animateOut(delta, animationState) {
        const slideOut = this._canvasDimRef.y * delta;
        this._translucentOverlay.setOpacity(1 - animationState);
        this._pressToPlayButton.getRenderPosition().moveLeft(slideOut);
        this._logoTitleSprite.getRenderPosition().moveUp(slideOut);
    }

    registerBindings(){
        const self = this;
        const validateMenuAction = this._gameBindings.getActionByName(GameInputActions.MENU_VALID_SELECTION);
        validateMenuAction.addActionCallback(self.selectMenuActionCallback);

        //TODO do all other bindings
    }
}