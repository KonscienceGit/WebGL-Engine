class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        this._pixelPerfectTool = new PositionTool(renderer);
        this._background = new Sprite(renderer, "resources/", Sprite.getFileName("background",".png"));
        this._background.setVisible(true);

        this._aliensMissiles = new MultiSprite(renderer, "resources/", Sprite.getFileName("greenMissile",".png"));
        this._playerMissiles = new MultiSprite(renderer, "resources/", Sprite.getFileName("redMissile",".png"));
        this._spaceCraft = new SpaceCraft(renderer, this._pixelPerfectTool);
        this._aliens = new MultiSprite(renderer, "resources/aliens/", Sprite.generateFileNameList(4, ".png"));

        this._scoreCounter = new ScoreCounter(renderer, this._pixelPerfectTool);
        this._lifeCounter = new LifeCounter(renderer, this._pixelPerfectTool);

        this._translucentOverlay = new TranslucentOverlay(renderer, new Vec4(0, 0, 0, 0.6));
        this._pressToPlayButton = new Sprite(renderer, "resources/", Sprite.getFileName("pressToPlay",".png"));
        this._logoTitle = new Sprite(renderer, "resources/", Sprite.getFileName("title_logo",".png"));

        this._replayMenuSprite = new Sprite(renderer, "resources/", Sprite.getFileName("gameOver",".png"));

        //---- Setup the sprite render order from back to front: ----//
        this._spriteArray = [];
        //BackGround layer
        this._spriteArray.push(this._background);
        //SpaceCraft layer
        this._spriteArray.push(this._aliensMissiles);
        this._spriteArray.push(this._playerMissiles);
        this._spriteArray.push(this._aliens);
        this._spriteArray.push(this._spaceCraft);
        //GUI layer
        this._spriteArray.push(this._scoreCounter);
        this._spriteArray.push(this._lifeCounter);
        //Transparent overlay
        this._spriteArray.push(this._translucentOverlay);
        //GUI menu layer
        this._spriteArray.push(this._pressToPlayButton);
        this._spriteArray.push(this._logoTitle);
        this._spriteArray.push(this._replayMenuSprite);
    }

    /** @return {PositionTool} */
    getPixelPerfectTool() {
        return this._pixelPerfectTool;
    }

    /** @return {Sprite} */
    getAliens() {
        return this._aliens;
    }

    /** @return {Sprite} */
    getAliensMissiles() {
        return this._aliensMissiles;
    }

    /** @return {Sprite} */
    getPlayerMissiles() {
        return this._playerMissiles;
    }

    /** @return {Sprite} */
    getSpaceCraft() {
        return this._spaceCraft;
    }

    /** @return {Sprite} */
    getScoreCounter() {
        return this._scoreCounter;
    }

    /** @return {Sprite} */
    getLifeCounter() {
        return this._lifeCounter;
    }

    /** @return {TranslucentOverlay} */
    getTranslucentOverlay() {
        return this._translucentOverlay;
    }

    /** @return {Sprite} */
    getPlayButton() {
        return this._pressToPlayButton;
    }

    /** @return {Sprite} */
    getLogoTitle() {
        return this._logoTitle;
    }

    /** @return {Sprite} */
    getReplayMenuSprite() {
        return this._replayMenuSprite;
    }

    /** @return {Sprite[]} */
    getRenderableArray() {
        return this._spriteArray;
    }
}