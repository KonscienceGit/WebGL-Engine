class LifeCounter extends Sprite {
    constructor(renderer, resourcePath, pixelPerfectTool) {
        super(renderer, Sprite.getFileName(resourcePath + "life", ".png"));
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
        this._pixelPerfectTool.setTopRightWorldPosition(
            this,
            40 + this.size.x / 2,
            30 + this.size.y / 2
        );
    }

    draw(renderer) {
        let increment = this.size.x;
        this.getRenderPosition().x = this.getReferencePosition().x;
        for (let i = 0; i < 3; i++) {
            if (i < this._lifeCount) {
                super.draw(renderer); // render each number using parent draw method
            }
            this.getRenderPosition().moveLeft(increment);
        }
    }
}
