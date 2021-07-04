class GameObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        this._spriteArray = [];
        this._background = new Sprite(renderer, "resources/", Sprite.getFileName("background",".png"));
        this._aliensMissiles = new MultiSprite(renderer, "resources/", Sprite.getFileName("greenMissile",".png"));
        this._playerMissiles = new MultiSprite(renderer, "resources/", Sprite.getFileName("redMissile",".png"));
        this._spaceCraft = new SpaceCraft(renderer);
        this._aliens = new MultiSprite(renderer, "resources/aliens/", Sprite.generateFileNameList(4, ".png"));
        this._scoreCounter = new ScoreCounter(renderer);
        this._lifeCounter = new LifeCounter(renderer);

        // noinspection JSUnusedLocalSymbols // next line is just to visualize color in JetBrains's IDEs
        let translucentOverlayColor = "rgba(20,20,20,0.9)";
        this._translucentOverlay = new TranslucentOverlay(renderer, new Vec4(0, 0, 0, 150));

        this._pressToPlayButton = new Sprite(renderer, "resources/", Sprite.getFileName("pressToPlay",".png"));
        this._logoTitle = new Sprite(renderer, "resources/", Sprite.getFileName("title_logo",".png"));
        this._replayMenuSprite = new Sprite(renderer, "resources/", Sprite.getFileName("gameOver",".png"));

        this._background.setVisible(true);

        //---- Setup the sprite render order from back to front: ----//
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

    getAliens() {
        return this._aliens;
    }

    getAliensMissiles() {
        return this._aliensMissiles;
    }

    getPlayerMissiles() {
        return this._playerMissiles;
    }

    getSpaceCraft() {
        return this._spaceCraft;
    }

    getScoreCounter() {
        return this._scoreCounter;
    }

    getLifeCounter() {
        return this._lifeCounter;
    }

    getTranslucentOverlay() {
        return this._translucentOverlay;
    }

    getPlayButton() {
        return this._pressToPlayButton;
    }

    getLogoTitle() {
        return this._logoTitle;
    }

    getReplayMenuSprite() {
        return this._replayMenuSprite;
    }

    getSpriteArray() {
        return this._spriteArray;
    }
}