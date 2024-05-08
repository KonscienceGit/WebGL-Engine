import {PositionTool} from "../../webgl_engine/graphics/positionTool.js";
import {Entity} from "../../webgl_engine/utils/entity.js";
import {Sprite} from "../../webgl_engine/graphics/renderables/sprites/sprite.js";
import {MultiSprite} from "../../webgl_engine/graphics/renderables/sprites/multiSprite.js";
import {SpaceCraft} from "./sprites/spaceCraft.js";
import {ScoreCounter} from "./sprites/scoreCounter.js";
import {LifeCounter} from "./sprites/lifeCounter.js";
import {TranslucentOverlay} from "../../webgl_engine/graphics/renderables/sprites/translucentOverlay.js";
import {Vec4} from "../../webgl_engine/utils/math/vectors.js";

export class SpaceShooterObjectsManager {
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer) {
        const path = "../../resources/";
        const aliPathes = [];
        for (let i = 0; i < 4; i++) {
            aliPathes.push(path + "aliens/" + i.toString() + '.png');
        }
        this._pixelPerfectTool = new PositionTool(renderer);

        //---- Setup the sprite render order from back to front: ----//
        this._root = new Entity();

        //BackGround layer
        this._background = new Sprite(renderer, {imagespaths: path + "background.png"});
        this._root.add(this._background);

        //SpaceCraft layer
        this._aliensMissiles = new MultiSprite(renderer, {imagespaths: path + "greenMissile.png"});
        this._aliensMissiles.visible = false;
        this._root.add(this._aliensMissiles);

        this._playerMissiles = new MultiSprite(renderer, {imagespaths: path + "redMissile.png"});
        this._playerMissiles.visible = false;
        this._root.add(this._playerMissiles);

        this._aliens = new MultiSprite(renderer, {imagespaths: aliPathes});
        this._aliens.visible = false;
        this._root.add(this._aliens);

        this._spaceCraft = new SpaceCraft(renderer, path + "actor/", this._pixelPerfectTool);
        this._spaceCraft.visible = false;
        this._root.add(this._spaceCraft);

        //GUI layer
        this._scoreCounter = new ScoreCounter(renderer, path + "numbers/", this._pixelPerfectTool);
        this._scoreCounter.visible = false;
        this._root.add(this._scoreCounter);

        this._lifeCounter = new LifeCounter(renderer, path, this._pixelPerfectTool);
        this._lifeCounter.visible = false;
        this._root.add(this._lifeCounter);

        //Transparent overlay
        this._translucentOverlay = new TranslucentOverlay(renderer, new Vec4(0, 0, 0, 0.6));
        this._root.add(this._translucentOverlay);

        //GUI menu layer
        this._pressToPlayButton = new Sprite(renderer, {imagespaths: path + "pressToPlay.png"});
        this._root.add(this._pressToPlayButton);

        this._logoTitle = new Sprite(renderer, {imagespaths: path + "title_logo.png"});
        this._root.add(this._logoTitle);

        this._replayMenuSprite = new Sprite(renderer, {imagespaths: path + "gameOver.png"});
        this._replayMenuSprite.visible = false;
        this._root.add(this._replayMenuSprite);
    }

    /** @return {PositionTool} */
    getPixelPerfectTool() {
        return this._pixelPerfectTool;
    }

    /** @return {MultiSprite} */
    getAliens() {
        return this._aliens;
    }

    /** @return {MultiSprite} */
    getAliensMissiles() {
        return this._aliensMissiles;
    }

    /** @return {MultiSprite} */
    getPlayerMissiles() {
        return this._playerMissiles;
    }

    /** @return {SpaceCraft} */
    getSpaceCraft() {
        return this._spaceCraft;
    }

    /** @return {ScoreCounter} */
    getScoreCounter() {
        return this._scoreCounter;
    }

    /** @return {LifeCounter} */
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

    /** @return {Entity} */
    getRoot() {
        return this._root;
    }
}
