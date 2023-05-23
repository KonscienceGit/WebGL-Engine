class MineSweeperObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const numbersPath = "../../resources/numbers/";
        const numbersPathes = [];
        for (let i = 0; i < 9; i++) {
            numbersPathes.push(numbersPath + i + ".png");
        }
        this.renderer = renderer;
        this.tilesNumbers = new MultiSprite(renderer, {imagespaths: numbersPathes});
        this.fullscreenButton = new Sprite(renderer, {imagespaths: '../../resources/minesweeper/Fullscreen.png'});
        this.tiles = new Tiles(renderer, this.tilesNumbers);

        this.redBlock = new Sprite(renderer, {color: new Vec4(1, 0, 0, 0.3)}); // debug red overlay for left side
        this.greenBlock = new Sprite(renderer, {color: new Vec4(0, 1, 0, 0.3)}); // debug green overlay for right side
        this.blueBlock = new Sprite(renderer, {color: new Vec4(0, 0, 1, 0.3)}); // debug green overlay for right side

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.tiles);
        this.spriteArray.push(this.tilesNumbers);
        this.spriteArray.push(this.fullscreenButton);

        // this.spriteArray.push(this.redBlock);
        // this.spriteArray.push(this.greenBlock);
        // this.spriteArray.push(this.blueBlock);
    }
}
