/**
 * Simple sprite with built-in functionality to enable/disable fullscreen.
 * Pair it with the picking mechanism to enable it.
 */
class FullScreenButton extends Sprite {
    // TODO make button size/pos configurable.
    /**
     * @param {options} [options] the button options.
     * @param {string} [options.imagepath] the path for the button image.
     * @param {Sprite.AutoSizeMode} [options.autosizemode] The button image resizing logic after loading its image. Default is UNIT_VERTICAL.
     * @param {string} [options.name] The button name. Default is FSButton.
     */
    constructor(options) {
        if (options == null) options = {};
        super({
            imagespaths: options.imagepath != null ? options.imagepath : '../../resources/minesweeper/Fullscreen.png',
            name: options.name != null ? options.name : 'FSButton'
        });
        this._init = true;
    }

    draw(renderer) {
        super.draw(renderer);
        if (this._init && document.fullscreenEnabled) {
            this.updateFullScreenPos(renderer.getCamera());
            this.setVisible(true);
            this.isRound = false;
            this._init = false;
            renderer.setOnResizeCallback(() => {
                this.updateFullScreenPos(renderer.getCamera());
            });
        }
    }

    /**
     * Automatically update the button configuration.
     * Override to customize the button size/position after the view change size.
     * @param {AbstractCamera} camera
     */
    updateFullScreenPos(camera) {
        const worldSize = camera.getScreenWorldSize();
        const fsbSize = 0.1 * worldSize.y;
        const offset = fsbSize * 0.75;
        const posX = -0.5 * worldSize.x + offset;
        const posY = -0.5 * worldSize.y + offset;
        this.position.setValues(posX, posY);
        this.scale.setValues(fsbSize, fsbSize);
    }

    /**
     *
     */
    toggleFullScreen() {
        if (document.fullscreenElement == null) {
            document.documentElement.requestFullscreen().catch();
        } else {
            document.exitFullscreen().catch();
        }
    }
}
