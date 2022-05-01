class ReplayMenuState extends BasicState {
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

        // Bind closure context
        this.selectMenuActionCallback = this.selectMenuActionCallback.bind(this);
        this.registerBindings(gameBindings);
    }

    start(){
        this._menuSpriteAnimationState = 0.0;
        this._guiShift = this._worldPixelSize.y;
        this._replaySprite.setPosition(0, 0);
        this._replaySprite.getRenderPosition().moveDown(this._guiShift);
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
        const slideIn = this._worldPixelSize.y * delta;
        this._translucentOverlay.setOpacity(animationState);
        this._replaySprite.getRenderPosition().moveUp(slideIn);
    }

    animateOut(delta, animationState) {
        const slideOut = this._worldPixelSize.y * delta;
        this._replaySprite.getRenderPosition().moveDown(slideOut);
        this._scoreCounter.getReferencePosition().moveLeft(slideOut);
    }

    moveCraftOut(delta) {
        if (this._spaceCraft.getRenderPosition().x < this._spaceCraft._screenLimit) {
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
        const animFrame = Math.floor(this._menuSpriteAnimationState);
        this._replaySprite.setTextureLayer(animFrame);
    }

    selectMenuActionCallback(value){
        if(this.isInMainLoop() && value > 0){
            this.setReadyForNextState();
        }
    }

    registerBindings(gameBindings){
        const self = this;
        const validateMenuAction = gameBindings.getActionByName(GameInputActions.MENU_VALID_SELECTION);
        validateMenuAction.addActionCallback(self.selectMenuActionCallback);
    }
}
