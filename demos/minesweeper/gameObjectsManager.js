class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const path = "../../resources/minesweeper/"
        this.pixelPerfectTool = new PositionTool(renderer);
        this.tiles = new MultiSprite(renderer, path + "Tile.png");

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.tiles);
    }
}
