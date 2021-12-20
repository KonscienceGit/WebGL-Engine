/**
 * 2D Camera use pixels
 */
class Camera2D extends AbstractCamera{
    constructor() {
        super();
        this._ratio = 1;
        this._worldSize = new Vec2(1,1);
    }

    setRatio(ratio) {
        this._ratio = ratio;
        this._worldSize.x = this._ratio * this._worldSize.y;
    }

    setVerticalWorldSize(verticalWorldSize){
        this._worldSize.y = verticalWorldSize;
        this._worldSize.x = this._ratio * this._worldSize.y;
    }

    setProjectionUniform(gl, projectionUniform){
        gl.uniform2fv(projectionUniform, [this._worldSize.x, this._worldSize.y]);
    }

    getFullScreenQuadSize(){
        return this._worldSize;
    }
}