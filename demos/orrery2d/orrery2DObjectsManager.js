class Orrery2DObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        this._root = new Entity();
        this.renderer = renderer;

        this.fullscreenButton = new Sprite(renderer, {imagespaths: '../../resources/minesweeper/Fullscreen.png'});

        this.redBlock = new Sprite(renderer, {color: new Vec4(1, 0, 0, 0.3)}); // debug red overlay for left side
        this.greenBlock = new Sprite(renderer, {color: new Vec4(0, 1, 0, 0.3)}); // debug green overlay for right side
        this.blueBlock = new Sprite(renderer, {color: new Vec4(0, 0, 1, 0.3)}); // debug green overlay for right side

        //---- Setup the sprite render order from back to front: ----//
        this._root.add(this.fullscreenButton);

        // this._root.add(this.redBlock);
        // this._root.add(this.greenBlock);
        // this._root.add(this.blueBlock);
    }

    getRoot() {
        return this._root;
    }
}
