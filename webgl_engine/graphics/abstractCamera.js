class AbstractCamera {
    constructor() {
    }

    /**
     * @abstract
     * @param {WebGL2RenderingContext} gl
     * @param projectionUniform
     */
    setProjectionUniform(gl, projectionUniform){
        ConsoleUtils.nonImplementedError();
    }

    /**
     * @abstract
     * @returns {Vec2} the screen world size, mainly used for 2D rendering and UI positions
     */
    getScreenWorldSize(){
        ConsoleUtils.nonImplementedError();
        return new Vec2();
    }
}
