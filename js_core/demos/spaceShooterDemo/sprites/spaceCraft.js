class SpaceCraft extends Sprite {
    constructor(renderer, pixelPerfectTool) {
        super(renderer, "resources/actor/", Sprite.generateFileNameList(5, ".png"));
        this._pixelPerfectTool = pixelPerfectTool;
        this._movingDir = 0;
        this._animationPos = 0.0;
        this._lifeCount = 5;

        //movement default settings
        this._speed = 0.60 * this._pixelPerfectTool.getResolution().x;
        this._animationSpeed = 8;

        //defined at image load
        this._screenLimit = 0;
        this._spaceCraftBaseYPosition = 0;
    }

    updateSpaceCraft(delta, movement) {
        this.moveAndAnimate(delta, movement);
        this.wrapActorPosition();
    }

    moveAndAnimate(delta, movement) {
        this._movingDir = movement;
        this.updateAnimationLayer(delta);
        this.moveActor(delta);
    }

    looseOneLife() {
        this._lifeCount -= 1;
    }

    setLifeCount(count) {
        this._lifeCount = count;
    }

    getLifeCount() {
        return this._lifeCount;
    }

    /**
     * Update texture when moving
     * @private
     * @param {number} delta
     */
    updateAnimationLayer(delta) {
        if (this._movingDir === 0) {
            this.setTextureLayer(0);
            return;
        }

        let firstAnimationFrame;
        let lastAnimationFrame;

        if (this._movingDir > 0) {
            firstAnimationFrame = 1;
            lastAnimationFrame = 2;
        } else {
            firstAnimationFrame = 3;
            lastAnimationFrame = 4;
        }

        if (this._animationPos > lastAnimationFrame || this._animationPos < firstAnimationFrame) {
            this._animationPos = firstAnimationFrame;
        }
        this.setTextureLayer(Math.round(this._animationPos));
        this._animationPos += delta * this._animationSpeed;
    }

    moveActor(delta) {
        if (this._movingDir === 0) {
            return;
        }
        this.getRenderPosition().x += delta * this._movingDir * this._speed;
    }

    wrapActorPosition() {
        //Wrap around edges
        if (this.getRenderPosition().x > this._screenLimit) {
            this.getRenderPosition().x = -this._screenLimit + 1;
        } else if (this.getRenderPosition().x < -this._screenLimit) {
            this.getRenderPosition().x = this._screenLimit - 1;
        }
    }

    imageLoaded() {
        super.imageLoaded();
        this._screenLimit = 1.25 * 0.5 * this._pixelPerfectTool.getResolution().x;
        this._spaceCraftBaseYPosition = 0.5 * (-this._pixelPerfectTool.getResolution().y + this.renderSizeXY.y) + 1;
        this.radius = 0.6 * this.renderSizeXY.y;
        this.resetPosition();
    }

    resetPosition() {
        this.setPosition(this._screenLimit - 1, this._spaceCraftBaseYPosition);
    }
}