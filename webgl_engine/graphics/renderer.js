class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Camera2D} camera
     */
    constructor(canvas, camera) {
        this._canvas = canvas;
        this._camera = camera;

        this._displayMode = Renderer.DISPLAY_MODE.FULLSCREEN;
        this._windowResolution = new Vec2(1,1);
        this._renderResolution = new Vec2(1,1);
        this._clearColor = new Vec4(1, 0, 1, 1);
        this._gl = this._canvas.getContext('webgl2', {
            antialias: false,
            depth: false,
            premultipliedAlpha: false,
            stencil: false
        });
        //enable blending
        this._gl.enable(this._gl.BLEND);
        this._gl.blendEquation(this._gl.FUNC_ADD);
        // correct blending, even on non opaque destination
        this._gl.blendFuncSeparate(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA, this._gl.ONE, this._gl.ONE_MINUS_SRC_ALPHA);
        this.setClearColor(this._clearColor);

        this.updateScreenSize();

        const self = this;
        window.onresize = function () {
            self.updateScreenSize();
        }

        this._shaderUtils = new ShadersUtil(this._gl);
    }

    static DISPLAY_MODE = {
        FULLSCREEN: 0,
        FIXED_RATIO: 1,
        FIXED_RESOLUTION: 2
    }

    updateScreenSize() {
        const docBody = document.body;
        const docElem = document.documentElement;
        // TODO only one of them is best for mobile, need to find which...
        this._windowResolution.x = docElem.clientWidth || docBody.clientWidth || window.innerWidth;
        this._windowResolution.y = docElem.clientHeight || docBody.clientHeight || window.innerHeight;
        switch (this._displayMode) {
            default:
            case Renderer.DISPLAY_MODE.FULLSCREEN:
                this._renderResolution.copy(this._windowResolution);
                this._ratio =  this._renderResolution.x /  this._renderResolution.y;
                break;
            case Renderer.DISPLAY_MODE.FIXED_RESOLUTION:
                this._ratio =  this._renderResolution.x /  this._renderResolution.y;
                break;
            case Renderer.DISPLAY_MODE.FIXED_RATIO:
                const ratioWidth = this._windowResolution.y * this._ratio;
                if (ratioWidth > this._windowResolution.x) {
                    this._renderResolution.x = this._windowResolution.x;
                    this._renderResolution.y = this._windowResolution.x / this._ratio;
                } else {
                    this._renderResolution.x = ratioWidth;
                    this._renderResolution.y = this._windowResolution.y;
                }
                break;
        }

        this._canvas.width = this._renderResolution.x;
        this._canvas.height = this._renderResolution.y;
        this._gl.viewport(0, 0, this._renderResolution.x, this._renderResolution.y);
        this.clear();
        this._camera.setRatio(this._ratio);
    }

    /**
     * @param {Entity[]} entityArray
     */
    draw(entityArray) {
        const renderer = this;
        entityArray.forEach(function (entity){
            if (entity.isVisible()) entity.draw(renderer);
        });
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    /** @param {Vec4} color the color in [0 to 1] RBGA components */
    setClearColor(color) {
        this._clearColor.copy(color);
        this._gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w);
    }

    setDisplayFullscreen() {
        this._displayMode = Renderer.DISPLAY_MODE.FULLSCREEN;
        this.updateScreenSize();
    }

    setDisplayFixedResolution(resolution){
        this._displayMode = Renderer.DISPLAY_MODE.FIXED_RESOLUTION;
        this._renderResolution.copy(resolution);
        this.updateScreenSize();
    }

    setDisplayFixedRatio(ratio){
        this._displayMode = Renderer.DISPLAY_MODE.FIXED_RATIO;
        this._ratio = ratio;
        this.updateScreenSize();
    }

    /** @returns {WebGL2RenderingContext} */
    getGLContext() {
        return this._gl;
    }

    /** @returns {Vec2} */
    getRenderResolution() {
        return this._renderResolution;
    }

    /** @returns {AbstractCamera} */
    getCamera(){
        return this._camera;
    }

    /** @returns {ShadersUtil} */
    getShaderUtils(){
        return this._shaderUtils;
    }
}
