/**
 * 2D Camera
 */
class Camera2D extends AbstractCamera {
    constructor() {
        super();
        this._ratio = 1;
        this._uniProjArray = new Float32Array(2);
        this._uniViewArray = new Float32Array(2);
        this._viewProjMat = new Matrix3();
        this._screenWorldSize = new Vec2(1, 1);
        this._position = new Vec3(0, 0, 0);
        this.updateMatrix();
    }

    updateMatrix() {
        // Translation (is affected by scale)
        this._viewProjMat.makeTranslation(
            this._position.x / this._screenWorldSize.x,
            this._position.y / this._screenWorldSize.y
        );
        // Scale
        this._viewProjMat.makeScale(
            1 / (this._screenWorldSize.x),
            1 / (this._screenWorldSize.y)
        );
        this._screenWorldSize.toArray(this._uniProjArray);
        this._position.toArray(this._uniViewArray);
    }

    setRatio(ratio) {
        this._ratio = ratio;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this.updateMatrix();
    }

    setVerticalScreenWorldSize(verticalScreenWorldSize) {
        this._screenWorldSize.y = verticalScreenWorldSize;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this.updateMatrix();
    }

    setViewProjectionUniform(gl, viewProjMatUniform) {
        gl.uniformMatrix3fv(viewProjMatUniform, false, this._viewProjMat.m);
    }

    setWorldUniform(gl, projectionUniform, viewUniform) {
        gl.uniform2fv(projectionUniform, this._uniProjArray);
        gl.uniform2fv(viewUniform, this._uniViewArray);
    }

    getScreenWorldSize(target) {
        if (!target) return this._screenWorldSize.clone();
        target.copy(this._screenWorldSize);
        return target;
    }

    getPosition(target) {
        if (!target) return this._position.clone();
        target.x = this._position.x;
        target.y = this._position.y;
        if (target.z != null) {
            target.z = 0;
        }
        return target;
    }

    setPosition(position) {
        this._position.copy(position);
        this.updateMatrix();
    }
}
