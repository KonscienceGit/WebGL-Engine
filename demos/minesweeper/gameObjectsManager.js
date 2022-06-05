class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     * @param {CursorProperties} cursorProperties used for the grpahic cursor
     */
    constructor(renderer, cursorProperties) {
        // this.pixelPerfectTool = new PositionTool(renderer);
        this.tiles = new Tiles(renderer);
        // this.graphicCursor = new GraphicCursor(renderer, cursorProperties);
        // this.graphicCursor.visible = true;

        //---- Setup the sprite render order from back to front: ----//
        this.spriteArray = [];
        this.spriteArray.push(this.tiles);
        // this.spriteArray.push(this.graphicCursor);
    }
}
