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

        this._logoOuterPos = new Vec2(0, 100);
        this._logoCenterPos = this._logoOuterPos.clone();
        this._logoOuterPos.moveUp(this._worldPixelSize.y);

        this._pressPlayOuterPos = new Vec2(0, 0);
        this._pressPlayCenterPos = this._pressPlayOuterPos.clone();
        this._pressPlayOuterPos.moveLeft(this._worldPixelSize.x);

        // Bind context to callback
        const selectMenuBindedCallback = this.selectMenuActionCallback.bind(this);
        // Assign callback to action
        gameBindings.addCallbackToAction(SpaceShooterActions.MENU_VALID_SELECTION, selectMenuBindedCallback);

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(1.0);
    }

    start(){
        this._growingAnimationState = 0.0;

        this._logoTitleSprite.position.copy(this._logoOuterPos);
        this._pressToPlayButton.position.copy(this._pressPlayOuterPos);

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
        this._logoTitleSprite.position.lerp(this._logoOuterPos, this._logoCenterPos, animationState);
        this._pressToPlayButton.position.lerp(this._pressPlayOuterPos, this._pressPlayCenterPos, animationState);
    }

    animateOut(delta, animationState) {
        this._translucentOverlay.setOpacity(1 - animationState);
        this._logoTitleSprite.position.lerp(this._logoCenterPos, this._logoOuterPos, animationState);
        this._pressToPlayButton.position.lerp(this._pressPlayCenterPos, this._pressPlayOuterPos, animationState);
    }

    selectMenuActionCallback(value){
        if(this.isInMainLoop() && value > 0){
            this.setReadyForNextState();
        }
    }
}
