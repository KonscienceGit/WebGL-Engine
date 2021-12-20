class PixelPerfectTool {
    constructor(resolution) {
        this._resolution = new Vec2(resolution.x, resolution.y);
    }

    /**
     * Set the sprite position to the given x and y coordinates, with the origin being the top left corner.
     * @param {Sprite} sprite
     * @param {number} x the horizontal offset from the screen leftmost position
     * @param {number} y the vertical offset from the screen topmost position
     */
    setTopLeftPixelPostition(sprite, x, y) {
        sprite.setPosition(x - this._resolution.x / 2, this._resolution.y / 2 - y);
    }

    /**
     * Set the sprite position to the given x and y coordinates, with the origin being the top right corner.
     * @param {Sprite} sprite
     * @param {number} x the horizontal offset from the screen rightmost position
     * @param {number} y the vertical offset from the screen topmost position
     */
    setTopRightPixelPostition(sprite, x, y) {
        sprite.setPosition(this._resolution.x / 2 - x, this._resolution.y / 2 - y);
    }

    getResolution(){
        return this._resolution;
    }
}