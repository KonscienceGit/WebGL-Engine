class LifeCounter extends Sprite {
    constructor(renderer, pixelPerfectTool) {
        super(renderer, "resources/", Sprite.getFileName("life",".png"));
        this._lifeCount = 3;
        this._pixelPerfectTool = pixelPerfectTool;
    }

    setLifeCount(lifes) {
        this._lifeCount = lifes;
    }

    getLifeCount() {
        return this._lifeCount;
    }

    imageLoaded() {
        super.imageLoaded();
        this.resetPosition();
    }

    resetPosition() {
        this._pixelPerfectTool.setTopRightPixelPostition(
            this,
            40 + this._entityProperties.renderSizeXY.x / 2,
            30 + this._entityProperties.renderSizeXY.y / 2
        );
    }

    draw(gl) {
        if (!this.isVisible()) {
            return;
        }
        let increment = this._entityProperties.renderSizeXY.x;
        this.getRenderPosition().x = this.getReferencePosition().x;
        for (let i = 0; i < 3; i++) {
            if (i < this._lifeCount) {
                super.draw(gl);
            }
            this.getRenderPosition().moveLeft(increment);
        }
    }
}