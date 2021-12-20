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
}