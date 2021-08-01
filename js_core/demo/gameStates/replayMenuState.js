class ReplayMenuState extends AbstractState {
    constructor(objectManager) {
        super();

        this._slideIn = true;
        this._slideInState = 0;
        this._slideOut = false;
        this._slideOutState = 1.0;
        this._goToNextState = false;

        this._menuSpriteAnimationState = 0;
        this._canvasDim = objectManager.getSpaceCraft()._canvasDim.clone();

        this._replaySprite = objectManager.getReplayMenuSprite();
        this._translucentOverlay = objectManager.getTranslucentOverlay();
        this._spaceCraft = objectManager.getSpaceCraft();
        this._scoreCounter = objectManager.getScoreCounter();

        this._guiShift = this._canvasDim.y;

        this._replaySprite.setPosition(0, 0);
        this._replaySprite.getRenderPosition().moveDown(this._guiShift);
        this._replaySprite.setVisible(true);
        this._translucentOverlay.setVisible(true);
    }

    getNextState() {
        return "StartMenuState";
    }

    fireInputAction(action, options) {
        if (!this._slideIn && (action === GameInputActions.ACTION || action === GameInputActions.CLICK_AT)){
            this._slideOut = true;
        }
    }

    updateState(delta) {
        super.updateState(delta);
        if (this._slideIn) {
            this.slideIn(delta);
        }

        if (this._slideOut) {
            this.slideOut(delta);
        }
        this.moveCraftOut(delta);
        this.animateMenuSprite(delta);
    }

    // noinspection DuplicatedCode
    slideIn(delta) {
        this._slideInState += delta;
        let slideFactor = delta;
        if (this._slideInState >= 1) {
            slideFactor -= this._slideInState - 1;
            this._slideIn = false;
            this._slideInState = 1;
        }
        const slideIn = this._canvasDim.y * slideFactor;
        this._translucentOverlay.setOpacity(this._slideInState);
        this._replaySprite.getRenderPosition().moveUp(slideIn);
    }

    // noinspection DuplicatedCode
    slideOut(delta) {
        this._slideOutState -= delta;
        let slideOutFactor = delta;
        if (this._slideOutState <= 0) {
            slideOutFactor += this._slideOutState;
            this._slideOut = false;
            this._goToNextState = true;
        }
        const slideOut = this._canvasDim.y * slideOutFactor;
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

    finish() {
        this._replaySprite.setVisible(false);
        this._translucentOverlay.setVisible(false);
    }

    goToNextState() {
        return this._goToNextState;
    }
}