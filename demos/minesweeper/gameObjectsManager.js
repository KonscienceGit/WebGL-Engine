class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     * @param {CursorProperties} cursorProperties used for the grpahic cursor
     */
    constructor(renderer, cursorProperties) {
        // this.pixelPerfectTool = new PositionTool(renderer);
        const numbersPath = "../../resources/numbers/";
        const numbersPathes = [];
        for (let i = 0; i < 10; i++) {
            numbersPathes.push(numbersPath + i + ".png");
        }
        this.tilesNumbers = new MultiSprite(renderer, numbersPathes);
        this.tiles = new Tiles(renderer, this.tilesNumbers);
        // this.graphicCursor = new GraphicCursor(renderer, cursorProperties);
        // this.graphicCursor.visible = true;

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.tiles);
        this.spriteArray.push(this.tilesNumbers);
        // this.spriteArray.push(this.graphicCursor);
    }
}
