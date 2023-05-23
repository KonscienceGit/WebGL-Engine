/**
 * Tile data for the Mine Sweeper
 */
class TileEntity extends Entity {
    constructor(col, row, size) {
        super();
        this.name = col +'_' + row;
        this.visible = true;
        this.isRound = false;
        this.size.setValues(size, size);
        this.isMine = false;
        this.isRevealed = false;
        this.isSecured = false;
        this.row = row;
        this.col = col;
        this.nbMine = 0;

        this.textureLayer = 0;
    }
}
