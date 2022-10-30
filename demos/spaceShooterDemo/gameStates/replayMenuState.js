class ReplayMenuState extends AbstractState {
    /**
     * @param {SpaceShooterObjectsManager} objectManager
     * @param {SpaceShooterInputManager} gameBindings
     */
    constructor(objectManager, gameBindings) {
        super();
        this._nextState = null;
        this._replaySprite = objectManager.getReplayMenuSprite();
        this._translucentOverlay = objectManager.getTranslucentOverlay();
        this._spaceCraft = objectManager.getSpaceCraft();
        this._scoreCounter = objectManager.getScoreCounter();
        this._worldPixelSize = objectManager.getPixelPerfectTool().getResolution();

        // Set animations duration
        this.setAnimateInLength(1.0);
        this.setAnimateOutLength(1.0);

        // Bind context to callback
        const selectMenuBindedCallback = this.selectMenuActionCallback.bind(this);
        // Assign callback to action
        gameBindings.addCallbackToAction(SpaceShooterActions.MENU_VALID_SELECTION, selectMenuBindedCallback);
    }

    start(){
        this._menuSpriteAnimationState = 0.0;
        this._guiShift = this._worldPixelSize.y;
        this._replaySprite.position.setValues(0, 0);
        this._replayPin = this._replaySprite.position.clone();
        this._replaySprite.position.moveDown(this._guiShift);
        this._replayPoff = this._replaySprite.position.clone();
        this._replaySprite.setVisible(true);
        this._translucentOverlay.setVisible(true);
    }

    finish() {
        this._replaySprite.setVisible(false);
    }

    setNextState(nextState){
        this._nextState = nextState;
    }

    getNextState() {
        return this._nextState;
    }

    mainLoop(delta) {
        this.moveCraftOut(delta);
        this.animateMenuSprite(delta);
    }

    animateIn(delta, animationState) {
        this._translucentOverlay.setOpacity(animationState);
        this._replaySprite.position.lerp(this._replayPoff, this._replayPin, animationState);
    }

    animateOut(delta, animationState) {
        const slideOut = this._worldPixelSize.y * delta;
        this._replaySprite.position.lerp(this._replayPin, this._replayPoff, animationState);
    }

    moveCraftOut(delta) {
        if (this._spaceCraft.position.x < this._spaceCraft._screenLimit) {
            this._spaceCraft.moveAndAnimate(delta, -1);
        } else {
            this._spaceCraft.moveAndAnimate(0, 0);
        }
    }

    animateMenuSprite(delta) {
        this._menuSpriteAnimationState += delta;
        if (this._menuSpriteAnimationState >= 2) {
            this._menuSpriteAnimationState = 0;
        }
        this._replaySprite.textureLayer = Math.floor(this._menuSpriteAnimationState);
    }

    selectMenuActionCallback(value){
        if(this.isInMainLoop() && value > 0){
            this.setReadyForNextState();
        }
    }
}
