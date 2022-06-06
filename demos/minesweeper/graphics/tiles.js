class Tiles extends MultiSprite {
    constructor(renderer, numbersSprites) {
        const path = "../../resources/minesweeper/"
        super(renderer, [
            path + "Tile.png",
            path + "EmptyTile.png",
            path + "Mine.png",
            path + "SecureTile.png"
            ]);
        this._numbers = numbersSprites;

        // Texture layers
        // this._COVER = 0;
        this._REVEALED = 1;
        this._MINE = 2;
        this._SECURED = 3;

        // Numbers Colormap
        this._numColor = [];
        this._numColor[0] = new Vec4(1, 1, 1, 1);
        this._numColor[1] = new Vec4(0, 0, 1, 1);
        this._numColor[2] = new Vec4(0, 1, 0, 1);
        this._numColor[3] = new Vec4(1, 0, 0, 1);
        this._numColor[4] = new Vec4(1, 1, 0, 1);
        this._numColor[5] = new Vec4(1, 1, 1, 1);
        this._numColor[6] = new Vec4(1, 1, 1, 1);
        this._numColor[7] = new Vec4(1, 1, 1, 1);
        this._numColor[8] = new Vec4(1, 1, 1, 1);
    }

    createTiles() {
        const nbRow = 9;
        const nbCol = 9;
        const size = 1 / Math.max(nbRow, nbCol);
        const numberHeight = size * 0.6;
        this._numbers.setHeight(numberHeight);
        const array = [];
        for (let row = 0; row < nbRow; row++) {
            array.push([]);
            let y = row / nbRow - 0.5 + size / 2;
            for (let col = 0; col < nbCol; col++) {
                let x = col / nbCol - 0.5 + size / 2;
                const tile = this.createNewInstance();
                tile.name = col +'_' + row;
                tile.position.setValues(x, y);
                tile.isRound = false;
                tile.size.setValues(size, size);
                tile.isMine = Math.random() < 0.2;
                tile.isRevealed = false;
                tile.isSecured = false;
                array[row][col] = tile;
                this.addInstance(tile);
            }
        }
        for (let row = 0; row < nbRow; row++) {
            for (let col = 0; col < nbCol; col++) {
                const tile = array[row][col];
                tile.nbMine = this.getNbMine(array, row, col, nbRow - 1, nbCol - 1);
                // TODO DEBUG
                if (tile.isMine) {
                    tile.textureLayer = this._MINE;
                } else {
                    this.createNumber(tile)
                    tile.textureLayer = this._REVEALED;
                }
            }
        }
    }

    /**
     * @private
     * @returns the number of adjacent mines
     */
    getNbMine(array, row, col, maxRow, maxCol) {
        let nbMine = 0;
        if (row > 0 && col > 0 && array[row - 1][col - 1].isMine) nbMine++;
        if (row > 0 && array[row - 1][col].isMine) nbMine++;
        if (row > 0 && col < maxCol && array[row - 1][col + 1].isMine) nbMine++;
        if (col < maxCol && array[row][col + 1].isMine) nbMine++;
        if (row < maxRow && col < maxCol && array[row + 1][col + 1].isMine) nbMine++;
        if (row < maxRow && array[row + 1][col].isMine) nbMine++;
        if (row < maxRow && col > 0 && array[row + 1][col - 1].isMine) nbMine++;
        if (col > 0 && array[row][col - 1].isMine) nbMine++;
        return nbMine;
    }

    /**
     * Returns
     * 0 - nothing happen
     * 1 - tile safely revealed
     * 2 - fortified
     * 3 - mine triggered
     * @param {CursorProperties} cursorProp
     * @returns tile code
     */
    clicTile(cursorProp) {
        const tile = cursorProp.pick(this.getInstances());
        if (tile == null || tile.isRevealed) return 0;
        // TODO secure mechanism
        if (tile.isSecured) return 0;
        // reveal tile for better or worse
        tile.isRevealed = true;
        if (tile.isMine) {
            tile.textureLayer = this._MINE;
            return 3;
        }
        tile.textureLayer = this._REVEALED;
        if (tile.nbMine > 0) this.createNumber(tile);
        return 1;
    }

    createNumber(tile) {
        const num = this._numbers.createNewInstance();
        num.position.copy(tile.position);
        num.textureLayer = tile.nbMine;
        num.color.copy(this._numColor[tile.nbMine]);
        num.alphaOutline = 2;
        this._numbers.addInstance(num);
    }
}
