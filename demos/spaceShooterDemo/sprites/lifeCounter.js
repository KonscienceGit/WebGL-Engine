class LifeCounter extends Sprite {
    constructor(renderer, resourcePath, pixelPerfectTool) {
        super(renderer, {imagespaths: resourcePath + "life.png"});
        this._lifeCount = 3;
        this._pixelPerfectTool = pixelPerfectTool;
        this._tmpPos = new Vec2();
    }

    setLifeCount(lifes) {
        this._lifeCount = lifes;
    }

    onImageLoaded() {
        super.onImageLoaded();
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
        const increment = this.size.x;
        this._tmpPos.copy(this.position);
        for (let i = 0; i < 3; i++) {
            if (i < this._lifeCount) {
                super.draw(renderer); // render each heart using parent draw method
            }
            this.position.moveLeft(increment);
        }
        this.position.copy(this._tmpPos);
    }
}
