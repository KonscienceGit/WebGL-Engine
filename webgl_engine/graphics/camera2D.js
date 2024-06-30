import {Matrix3} from "../utils/math/matrix.js";
import {Vec2} from "../utils/math/vectors.js";

/**
 * 2D Camera
 */
export class Camera2D {
    constructor() {
        this._ratio = 1;
        this._uniProjArray = new Float32Array(2);
        this._uniViewArray = new Float32Array(2);
        this._viewProjMat = new Matrix3();
        this._screenWorldSize = new Vec2(1, 1);
        this._position = new Vec2(0, 0);
        this.updateMatrix();
    }

    updateMatrix() {
        this._viewProjMat.setTranslation(
            this._position.x,
            this._position.y
        );
        this._viewProjMat.setScale(
            1 / this._screenWorldSize.x,
            1 / this._screenWorldSize.y
        );
        this._screenWorldSize.toArray(this._uniProjArray);
        this._position.toArray(this._uniViewArray);
    }

    /**
     * Project the given point from worldSpace to [?, ?] screen space
     * @param {Vec2} vec2 the vector to project.
     */
    project(vec2) {
        // TODO
    }

    /**
     * Set the aspect ratio of the camera viewport.
     * @param {number} ratio
     */
    setRatio(ratio) {
        if (ratio === this._ratio) return;
        this._ratio = ratio;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this.updateMatrix();
    }

    /**
     * Set the size of the world depicted by the vertical dimension of the viewport.
     * @param {number} verticalScreenWorldSize
     */
    setVerticalScreenWorldSize(verticalScreenWorldSize) {
        this._screenWorldSize.y = verticalScreenWorldSize;
        this._screenWorldSize.x = this._ratio * this._screenWorldSize.y;
        this.updateMatrix();
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLUniformLocation} viewProjMatUniform
     */
    setViewProjectionUniform(gl, viewProjMatUniform) {
        gl.uniformMatrix3fv(viewProjMatUniform, false, this._viewProjMat.m);
    }

    setWorldUniform(gl, projectionUniform, viewUniform) {
        gl.uniform2fv(projectionUniform, this._uniProjArray);
        gl.uniform2fv(viewUniform, this._uniViewArray);
    }

    /**
     * @param {Vec2} [target] an optional target vector to hold the size, create a new one if absent.
     * @returns {Vec2} the screen world size, mainly used for 2D rendering and UI positions
     */
    getScreenWorldSize(target) {
        if (!target) return this._screenWorldSize.clone();
        target.copy(this._screenWorldSize);
        return target;
    }

    /**
     * @param {Vec2} [target] an optional target vector to hold the position, create a new one if absent.
     * @returns {Vec2} a copy of the camera position in the world.
     */
    getPosition(target) {
        if (!target) return this._position.clone();
        target.x = this._position.x;
        target.y = this._position.y;
        return target;
    }

    /**
     * @param {Vec2} position the camera position to set. Vector values are copied to avoid unwanted modifications after setting.
     */
    setPosition(position) {
        this._position.copy(position);
        this.updateMatrix();
    }
}
