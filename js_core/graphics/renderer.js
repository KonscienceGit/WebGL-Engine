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
        this._gl.clearColor(1, 1, 1, 1);

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
        const clWidth = this._canvas.parentNode.clientWidth;
        const clHeight = this._canvas.parentNode.clientHeight;
        const scWidth = screen.availWidth;
        const scHeight = screen.availHeight;
        this._windowResolution.x = Math.min(clWidth, scWidth);
        this._windowResolution.y = Math.min(clHeight, scHeight);

        switch (this._displayMode) {
            default:
            case Renderer.DISPLAY_MODE.FULLSCREEN:
                this._renderResolution.set(this._windowResolution);
                this._ratio =  this._renderResolution.x /  this._renderResolution.y;
                break;
            case Renderer.DISPLAY_MODE.FIXED_RESOLUTION:
                this._ratio =  this._renderResolution.x /  this._renderResolution.y;
                break;
            case Renderer.DISPLAY_MODE.FIXED_RATIO:
                this._renderResolution.set(this._windowResolution);
                break;
        }
        this._canvas.width = this._renderResolution.x;
        this._canvas.height = this._renderResolution.y;
        this._gl.viewport(0, 0, this._renderResolution.x, this._renderResolution.y);
        this.clear();
        this._camera.setRatio(this._ratio);
    }

    /**
     * @param {Array.<Sprite>} spriteArray
     */
    draw(spriteArray) {
        spriteArray.forEach(entity => entity.draw(this));
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    setDisplayFullscreen() {
        this._displayMode = Renderer.DISPLAY_MODE.FULLSCREEN;
        this.updateScreenSize();
    }

    setDisplayFixedResolution(resolution){
        this._displayMode = Renderer.DISPLAY_MODE.FIXED_RESOLUTION;
        this._renderResolution.set(resolution);
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
