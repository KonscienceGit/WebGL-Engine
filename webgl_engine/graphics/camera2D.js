/**
 * 2D Camera use pixels
 */
class Camera2D extends AbstractCamera{
    constructor() {
        super();
        this._ratio = 1;
        this._screenWorldSize = new Vec2(1,1);
    }

    setRatio(ratio) {
        this._ratio = ratio;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
    }

    /**
     * Set the size of the world depicted by the vertical dimension of the viewport.
     * @param {number} verticalScreenWorldSize
     */
    setVerticalScreenWorldSize(verticalScreenWorldSize){
        this._screenWorldSize.y = verticalScreenWorldSize;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
    }

    setProjectionUniform(gl, projectionUniform){
        gl.uniform2fv(projectionUniform, [this._screenWorldSize.x, this._screenWorldSize.y]);
    }

    getScreenWorldSize(){
        return this._screenWorldSize;
    }
}