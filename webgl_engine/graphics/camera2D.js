/**
 * 2D Camera
 */
class Camera2D extends AbstractCamera{
    constructor() {
        super();
        this._ratio = 1;
        this._screenWorldSize = new Vec2(1,1);
        this._uniTmp = new Float32Array(2);
        this._screenWorldSize.toArray(this._uniTmp);
    }

    setRatio(ratio) {
        this._ratio = ratio;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this._screenWorldSize.toArray(this._uniTmp);
    }

    /**
     * Set the size of the world depicted by the vertical dimension of the viewport.
     * @param {number} verticalScreenWorldSize
     */
    setVerticalScreenWorldSize(verticalScreenWorldSize){
        this._screenWorldSize.y = verticalScreenWorldSize;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this._screenWorldSize.toArray(this._uniTmp);
    }

    setProjectionUniform(gl, projectionUniform){
        gl.uniform2fv(projectionUniform, this._uniTmp);
    }

    getScreenWorldSize(){
        return this._screenWorldSize;
    }
}
