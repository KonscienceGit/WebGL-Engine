import {Sprite} from "../../../webgl_engine/graphics/renderables/sprites/sprite.js";
import {Vec2} from "../../../webgl_engine/utils/math/vectors.js";

export class LifeCounter extends Sprite {
    constructor(renderer, resourcePath, pixelPerfectTool) {
        super({imagespaths: resourcePath + "life.png"});
        this._lifeCount = 3;
        this._pixelPerfectTool = pixelPerfectTool;
        this._tmpPos = new Vec2();
    }

    /**
     * @param lifes {number}
     */
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

    /**
     * @param renderer {Renderer}
     */
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
