class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const resourcesPath = "../../resources/"
        this._pixelPerfectTool = new PositionTool(renderer);
        this._Tiles = new MultiSprite(renderer, resourcesPath, Sprite.getFileName("greenMissile",".png"));
        // this._background = new Sprite(renderer, resourcesPath, Sprite.getFileName("background",".png"));
        // this._aliensMissiles = new MultiSprite(renderer, resourcesPath, Sprite.getFileName("greenMissile",".png"));
        // this._spaceCraft = new SpaceCraft(renderer, resourcesPath + "actor/", this._pixelPerfectTool);
        // this._scoreCounter = new ScoreCounter(renderer, resourcesPath + "numbers/", this._pixelPerfectTool);
        // this._translucentOverlay = new TranslucentOverlay(renderer, new Vec4(0, 0, 0, 0.6));
        // this._pressToPlayButton = new Sprite(renderer, resourcesPath, Sprite.getFileName("pressToPlay",".png"));

        //---- Setup the sprite render order from back to front: ----//
        this._spriteArray = [];
        //BackGround layer
        // this._spriteArray.push(this._background);
    }

    /** @return {PositionTool} */
    getPixelPerfectTool() {
        return this._pixelPerfectTool;
    }

    /** @return {Sprite[]} */
    getRenderableArray() {
        return this._spriteArray;
    }
}
