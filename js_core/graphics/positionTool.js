class PositionTool {
    constructor(renderer) {
        this.camera = renderer.getCamera();
        this.renderer = renderer;
    }

    /**
     * Set the sprite position to the given x and y coordinates, with the origin being the top left corner.
     * @param {Sprite} sprite
     * @param {number} x the horizontal offset from the screen leftmost position
     * @param {number} y the vertical offset from the screen topmost position
     */
    setTopLeftWorldPosition(sprite, x, y) {
        const ws = this.camera.getScreenWorldSize();
        sprite.setPosition(x - ws.x / 2, ws.y / 2 - y);
    }

    /**
     * Set the sprite position to the given x and y coordinates, with the origin being the top right corner.
     * @param {Sprite} sprite
     * @param {number} x the horizontal offset from the screen rightmost position
     * @param {number} y the vertical offset from the screen topmost position
     */
    setTopRightWorldPosition(sprite, x, y) {
        const ws = this.camera.getScreenWorldSize();
        sprite.setPosition(ws.x / 2 - x, ws.y / 2 - y);
    }

    getResolution(){
        return this.camera.getScreenWorldSize().clone();
    }
}