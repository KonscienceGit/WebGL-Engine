class MineSweeperObjectsManager {
    /**
     * MineSweeperObjectsManager's constructor
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const numbersPath = "../../resources/numbers/";
        const numbersPathes = [];
        for (let i = 0; i < 9; i++) {
            numbersPathes.push(numbersPath + i + ".png");
        }
        this._root = new Entity();
        this.renderer = renderer;

        this.tilesNumbers = new MultiSprite({
            imagespaths: numbersPathes,
            autosizemode: Sprite.AutoSizeMode.OFF
        });
        this.fullscreenButton = new Sprite({imagespaths: '../../resources/minesweeper/Fullscreen.png'});
        this.tiles = new Tiles(this.tilesNumbers);

        this.redBlock = new Sprite({color: new Vec4(1, 0, 0, 0.3)}); // debug red overlay for left side
        this.greenBlock = new Sprite({color: new Vec4(0, 1, 0, 0.3)}); // debug green overlay for right side
        this.blueBlock = new Sprite({color: new Vec4(0, 0, 1, 0.3)}); // debug green overlay for right side

        //---- Setup the sprite render order from back to front: ----//
        this._root.add(this.tiles);
        this._root.add(this.tilesNumbers);
        this._root.add(this.fullscreenButton);

        // this._root.add(this.redBlock);
        // this._root.add(this.greenBlock);
        // this._root.add(this.blueBlock);
    }

    getRoot() {
        return this._root;
    }
}
