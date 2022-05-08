class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const path = "../../resources/"
        this.pixelPerfectTool = new PositionTool(renderer);
        this.tiles = new MultiSprite(renderer, path + "life.png");

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.tiles);
    }
}
