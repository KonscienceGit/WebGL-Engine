/**
 * 2D Camera
 */
class Camera2D extends AbstractCamera{
    constructor() {
        super();
        this._ratio = 1;
        this._screenWorldSize = new Vec2(1,1);
        this._uniProjArray = new Float32Array(2);
        this._screenWorldSize.toArray(this._uniProjArray);
        this._position = new Vec3(0, 0, 0);
        this._uniViewArray = new Float32Array(2);
        this._tmpVec2 = new Vec2(0, 0); // Cast vec3 to vec2 for uniforms
        this._tmpVec2.copy(this._position);
        this._tmpVec2.toArray(this._uniViewArray);
    }

    setRatio(ratio) {
        this._ratio = ratio;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this._screenWorldSize.toArray(this._uniProjArray);
    }

    setVerticalScreenWorldSize(verticalScreenWorldSize){
        this._screenWorldSize.y = verticalScreenWorldSize;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this._screenWorldSize.toArray(this._uniProjArray);
    }

    setViewProjectionUniform(gl, projectionUniform, viewUniform){
        gl.uniform2fv(projectionUniform, this._uniProjArray);
        gl.uniform2fv(viewUniform, this._uniViewArray);
    }

    getScreenWorldSize(target){
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
        this._position.toArray(this._uniViewArray);
    }
}
