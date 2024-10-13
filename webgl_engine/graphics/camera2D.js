import {Matrix3} from "../utils/math/matrix.js";
import {Vec2} from '../utils/math/vectors.js';

/**
 * 2D Camera
 */
export class Camera2D {
    constructor() {
        /**
         * @type {Entity | null}
         */
        this._follow = null;
        this._ratio = 1;
        this._zoom = 1;
        this._tmpVec2 = new Vec2();
        this._viewMat = new Matrix3();
        this._projMat = new Matrix3();
        this._viewProjMat = new Matrix3();
        this._screenWorldSize = new Vec2(1, 1);
        this._position = new Vec2(0, 0);
        this.updateMatrix();
    }

    updateMatrix() {
        // Projection convert world coordinates into screen [-1, 1] coordinates
        // Zoom affect the visible scale of the world.
        this._projMat.setScale(
            this._zoom / this._screenWorldSize.x,
            this._zoom / this._screenWorldSize.y
        );

        // View pan the camera in world coordinates
        if (this._follow != null) {
            this._follow.getWorldPosition(this._tmpVec2);
            this._viewMat.setTranslation(
                -this._tmpVec2.x,
                -this._tmpVec2.y
            );
        } else {
            this._viewMat.setTranslation(
                this._position.x,
                this._position.y
            );
        }

        // scene vertices are transformed in this order: View > Proj
        this._viewProjMat.multMat(this._projMat, this._viewMat, this._viewProjMat);
    }

    /**
     * Project the given point from worldSpace to screen space. (Visible screen space is [-1, 1])
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
     * Update this camera
     * @param {number} delta the time delta (in seconds) since the last frame.
     */
    update(delta) {
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

    /**
     * Move the camera, the given screen [-1, 1] coordinates will be internally converted in world coordinates.
     * @param x in screen [-1, 1] coordinates
     * @param y in screen [-1, 1] coordinates
     */
    move(x, y) {
        this._position.x += x * this._screenWorldSize.x / this._zoom;
        this._position.y += y * this._screenWorldSize.y / this._zoom;
        this.updateMatrix();
    }

    getZoomLevel() {
        return this._zoom;
    }

    setZoomLevel(zoom) {
        this._zoom = zoom;
        this.updateMatrix();
    }

    /**
     * The camera will track this entity. Set null to disable.
     * @param {Entity | null} entity
     */
    follow(entity) {
        this._follow = entity;
    }
}
