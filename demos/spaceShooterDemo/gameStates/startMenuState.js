class StartMenuState extends AbstractState {
    /**
     * @param {SpaceShooterObjectsManager} objectManager
     * @param {SpaceShooterInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._nextState = null;
        this._pressToPlayButton = objectManager.getPlayButton();
        this._logoTitleSprite = objectManager.getLogoTitle();
        this._translucentOverlay = objectManager.getTranslucentOverlay();
        this._worldPixelSize = objectManager.getPixelPerfectTool().getResolution();
        this._scoreCounter = objectManager.getScoreCounter();
        this._lifeCounter = objectManager.getLifeCounter();

        // Bind the closure context
        this.selectMenuActionCallback = this.selectMenuActionCallback.bind(this);

        this.registerBindings(gameBindings);

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(1.0);
    }

    start(){
        this._growingAnimationState = 0.0;

        this._logoTitleSprite.position.setValues(0, 0);
        this._pressToPlayButton.position.setValues(0, 0);

        // move before slideIn
        this._pressToPlayButton.position.moveLeft(this._worldPixelSize.y);
        this._logoTitleSprite.position.moveUp(this._worldPixelSize.y);

        this._pressToPlayButton.setVisible(true);
        this._logoTitleSprite.setVisible(true);
        this._translucentOverlay.setOpacity(1.0);
        this._translucentOverlay.setVisible(true);
        this._scoreCounter.setVisible(false);
        this._lifeCounter.setVisible(false);
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

    mainLoop(delta) {
        this._growingAnimationState += 2 * delta;
        if (this._growingAnimationState >= Math.PI) {
            this._growingAnimationState = 0.0;
        }
        const grow = 1.0 + 0.1 * Math.sin(this._growingAnimationState);
        this._pressToPlayButton.scale.setValues(grow, grow);
    }

    animateIn(delta, animationState) {
        const slideIn = this._worldPixelSize.y * delta;
        this._pressToPlayButton.position.moveRight(slideIn);
        this._logoTitleSprite.position.moveDown(slideIn);
    }

    animateOut(delta, animationState) {
        const slideOut = this._worldPixelSize.y * delta;
        this._translucentOverlay.setOpacity(1 - animationState);
        this._pressToPlayButton.position.moveLeft(slideOut);
        this._logoTitleSprite.position.moveUp(slideOut);
    }

    selectMenuActionCallback(value){
        if(this.isInMainLoop() && value > 0){
            this.setReadyForNextState();
        }
    }

    registerBindings(gameBindings){
        const self = this;
        const validateMenuAction = gameBindings.getActionByName(SpaceShooterActions.MENU_VALID_SELECTION);
        validateMenuAction.addActionCallback(self.selectMenuActionCallback);
    }
}
