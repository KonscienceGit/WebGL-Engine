class AbstractCamera {
    constructor() {
    }

    /**
     * @abstract
     * @param {WebGL2RenderingContext} gl
     * @param viewProjUniform
     */
    setViewProjectionUniform(gl, viewProjUniform) {
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * @param {Vec2} [target] an optional target vector to hold the size, create a new one if absent.
     * @returns {Vec2} the screen world size, mainly used for 2D rendering and UI positions
     */
    getScreenWorldSize(target) {
        ConsoleUtils.nonImplementedError();
        return new Vec2();
    }

    /**
     * @abstract
     * @param {Vec2|Vec3} [target] an optional target vector to hold the position, create a new one if absent.
     * @returns {Vec2|Vec3} a copy of the camera position in the world. If the camera is 2D, the z component will remain 0.
     */
    getPosition(target) {
        ConsoleUtils.nonImplementedError();
        return new Vec3();
    }

    /**
     * @abstract
     * @param {Vec3} position the camera position to set. Vector values are copied to avoid unwanted modifications after setting.
     */
    setPosition(position) {
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * Set the size of the world depicted by the vertical dimension of the viewport.
     * @param {number} verticalScreenWorldSize
     */
    setVerticalScreenWorldSize(verticalScreenWorldSize) {
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * Set the ratio of the camera viewport.
     * @param {number} ratio
     */
    setRatio(ratio) {
        ConsoleUtils.nonImplementedError();
    }
}
