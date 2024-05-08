import {MultiSprite} from "../../../webgl_engine/graphics/renderables/sprites/multiSprite.js";
import {Vec4} from "../../../webgl_engine/utils/math/vectors.js";
import {TileEntity} from "../tileEntity.js";

export class Tiles extends MultiSprite {
    /**
     * Minesweeper Tiles constructor
     * @param {MultiSprite} numbersSprites
     */
    constructor(numbersSprites) {
        const path = "../../resources/minesweeper/";
        const pathes = [
            path + "Tile.png",
            path + "EmptyTile.png",
            path + "Mine.png",
            path + "SecureTile.png"
        ];
        super({imagespaths: pathes});
        this._DEBUG_REVEAL_ALL = false;
        this._firstClick = true;
        this._numbers = numbersSprites;
        this.nbRow = 0;
        this.nbCol = 0;
        this._triggered = false;
        this._triggeredMine = null;
        this._fuseStage = 0;
        this._fuseBlip = 0;
        this._fuseBlipStage = 0;
        this._hasWon = false;
        this._hasLost = false;
        this._mineRowColArray = null;

        // Texture layers
        this._COVER = 0;
        this._REVEALED = 1;
        this._MINE = 2;
        this._SECURED = 3;

        // Numbers Colormap
        this._numColor = [
            new Vec4(1, 1, 1, 1),
            new Vec4(0, 0, 1, 1),
            new Vec4(0, 1, 0, 1),
            new Vec4(1, 0, 0, 1),
            new Vec4(1, 1, 0, 1),
            new Vec4(1, 1, 1, 1),
            new Vec4(1, 1, 1, 1),
            new Vec4(1, 1, 1, 1),
            new Vec4(1, 1, 1, 1)
        ];
    }

    createTiles(nbRow, nbCol, mineRatio) {
        this.nbRow = nbRow;
        this.nbCol = nbCol;
        const size = 1 / Math.max(nbRow, nbCol);
        const numberSize = size * 0.6;
        this._numbers.setSizeKeepAspectRatio(numberSize);

        const array = this.createTileEntities(nbRow, nbCol, size);

        this.spreadMines(mineRatio);

        this._mineRowColArray = array;
        if (this._DEBUG_REVEAL_ALL) this.revealAll();
    }

    /**
     * Fill tiles from top left to bottom right, row by row.
     * @param nbRow
     * @param nbCol
     * @param size
     * @returns {TileEntity[][]}
     */
    createTileEntities(nbRow, nbCol, size) {
        const array = [];
        for (let row = 0; row < nbRow; row++) {
            array.push([]);
            const y = 0.5 - (1 + row) / nbRow + size / 2;
            for (let col = 0; col < nbCol; col++) {
                const x = col / nbCol - 0.5 + size / 2;
                const tile = new TileEntity(col, row, size);
                tile.position.setValues(x, y);
                array[row][col] = tile;
                this.add(tile);
            }
        }
        return array;
    }

    spreadMines(mineRatio) {
        let tiles = this.childrenNodes.slice();
        const nbTile = tiles.length;
        let nbMine = Math.round(nbTile * mineRatio) - 1;
        if (nbMine <= 0) nbMine = 1;

        // Remove top left mine, as in the classic mineSweeper
        tiles = this.removeTileFromArray(tiles, 0);
        for (let i = 0; i < nbMine; i++) {
            const nbTileLeft = tiles.length; // this get updated each loop
            const tileIndex = Math.floor(Math.random() * nbTileLeft);
            tiles[tileIndex].customData.isMine = true;
            tiles = this.removeTileFromArray(tiles, tileIndex);
        }
    }

    removeTileFromArray(array, tileIndex) {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
            if (i !== tileIndex) newArray.push(array[i]);
        }
        return newArray;
    }

    /**
     * @param {TileEntity} clickedTile
     */
    countMinesAndReposition(clickedTile) {
        const array = this._mineRowColArray;
        if (clickedTile.customData.isMine) {
            clickedTile.customData.isMine = false;
            array[0][0].customData.isMine = true;
        }

        const nbRow = this.nbRow;
        const nbCol = this.nbCol;
        for (let row = 0; row < nbRow; row++) {
            for (let col = 0; col < nbCol; col++) {
                const tile = array[row][col];
                tile.nbMine = this.getNbMine(array, row, col, nbRow - 1, nbCol - 1);
            }
        }
    }

    // update(delta, patrix) {
    //     super.update(delta, patrix);
    //     const tile = this.childrenNodes[0];
    //     console.log('mat', tile.position.x);
    // }

    revealAll() {
        console.warn('Debug: Reveal all tiles');
        const tiles = this.childrenNodes;
        const nbTile = tiles.length;
        for (let i = 0; i < nbTile; i++) {
            const tile = tiles[i];
            if (tile.customData.isMine) {
                tile.textureLayer = this._MINE;
            } else {
                tile.textureLayer = this._REVEALED;
            }
        }
    }

    hasLost() {
        return this._hasLost;
    }

    hasWon() {
        return this._hasWon;
    }

    /**
     * @private
     * @returns {number} the number of adjacent mines
     */
    getNbMine(array, row, col, maxRow, maxCol) {
        let nbMine = 0;
        if (row > 0 && col > 0 && array[row - 1][col - 1].customData.isMine) nbMine++;
        if (row > 0 && array[row - 1][col].customData.isMine) nbMine++;
        if (row > 0 && col < maxCol && array[row - 1][col + 1].customData.isMine) nbMine++;
        if (col < maxCol && array[row][col + 1].customData.isMine) nbMine++;
        if (row < maxRow && col < maxCol && array[row + 1][col + 1].customData.isMine) nbMine++;
        if (row < maxRow && array[row + 1][col].customData.isMine) nbMine++;
        if (row < maxRow && col > 0 && array[row + 1][col - 1].customData.isMine) nbMine++;
        if (col > 0 && array[row][col - 1].customData.isMine) nbMine++;
        return nbMine;
    }

    /**
     * @param {CursorProperties} cursorProp the cursor properties
     * @param {boolean} leftClick if this is a left click.
     */
    clicTile(cursorProp, leftClick) {
        /**
         * @type {TileEntity|null}
         */
        const tile = cursorProp.pick(this.childrenNodes);
        if (tile == null) return;
        if (this._firstClick) {
            this._firstClick = false;
            this.countMinesAndReposition(tile);
            if (this._DEBUG_REVEAL_ALL) this.revealAll();
        }
        if (tile.isRevealed) return;
        const rightClick = !leftClick;
        if (leftClick && tile.isSecured) return;
        if (rightClick) { // Toggle tile secure
            tile.isSecured = !tile.isSecured;
            tile.textureLayer = tile.isSecured ? this._SECURED : this._COVER;
            return;
        }
        // reveal tile for better or worse
        tile.isRevealed = true;
        if (tile.customData.isMine) {
            tile.textureLayer = this._MINE;
            this.triggerMine(tile);
            return;
        }
        tile.textureLayer = this._REVEALED;
        if (tile.nbMine > 0) this.createNumber(tile);
    }

    createNumber(tile) {
        const num = this._numbers.createSubSprite(true);
        num.position.copy(tile.position);
        num.textureLayer = tile.nbMine;
        num.color.copy(this._numColor[tile.nbMine]);
        num.alphaOutline = 2;
    }

    triggerMine(tile) {
        this._triggered = true;
        this._triggeredMine = tile;
        this._fuseStage = 0;
        this._fuseBlip = 0;
        this._fuseBlipStage = 0;
    }

    updateEntity(delta) {
        super.updateEntity(delta);
        if (this._triggered) {
            this.dampenBlip(delta);
            const maxRadius = 0.5 * Math.max(this.nbCol, this.nbRow);
            this._fuseBlip += delta;
            if (this._fuseBlipStage === 0 && this._fuseBlip >= 0) {
                const radius = 0;
                this.blipMines(radius, this._fuseBlipStage);
                this._fuseBlipStage++;
            }
            if (this._fuseBlipStage === 1 && this._fuseBlip >= 0.2 && this._fuseStage >= 1) {
                const radius = 0.5 * maxRadius;
                this.blipMines(radius, this._fuseBlipStage);
                this._fuseBlipStage++;
            }
            if (this._fuseBlipStage === 2 && this._fuseBlip >= 0.4 && this._fuseStage >= 2) {
                this.blipMines(maxRadius, this._fuseBlipStage);
                this._fuseBlipStage++;
            }
            if (this._fuseBlip >= 1.3) {
                this._fuseStage++;
                this._fuseBlip = 0;
                this._fuseBlipStage = 0;
            }
            if (this._fuseStage >= 3) {
                this._fuseStage = 0;
                this._triggered = false;
                this._hasLost = true;
                this._hasWon = false;
            }
        }
    }

    dampenBlip(delta) {
        const tiles = this.childrenNodes;
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (!tile.customData.isMine) continue;
            if (tile.color.x >= 2) {
                tile.color.x -= 5 * delta;
            } else if (tile.color.x >= 1.5) {
                tile.color.x -= 3 * delta;
            } else if (tile.color.x >= 1.0) {
                tile.color.x -= 2 * delta;
            } else {
                tile.color.x = 1.0;
            }
        }
    }

    blipMines(radius, stage) {
        const row = this._triggeredMine.customData.row;
        const col = this._triggeredMine.customData.col;
        const minRow = row - radius;
        const maxRow = row + radius;
        const minCol = col - radius;
        const maxCol = col + radius;
        const tiles = this.childrenNodes;
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            if (!tile.customData.isMine) continue;
            if (tile.customData.row < minRow || tile.customData.row > maxRow || tile.customData.col < minCol || tile.customData.col > maxCol) continue;
            if (tile.fromStage != null && tile.fromStage !== stage) continue;
            tile.fromStage = stage;
            tile.color.x = 4;
        }
    }

    reset() {
        this.childrenNodes = [];
        this._firstClick = true;
        this._hasLost = false;
        this._hasWon = false;
        this._mineRowColArray = null;
    }
}
