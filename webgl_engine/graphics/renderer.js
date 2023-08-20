const UNIT_MATRIX = new Matrix3();

// TODO split this into:
//  A renderer which only have a unique GL context
//  One or multiple Scenes (a scene is just a combination of a scenegraph and a camera, but each scenegraph/cmera can be reused accross multiple scenes.)
//  Potentially, a Scene can depend on sub-scenes (ex: render a camera monitor in-game, or simply a virtual computer screen in-game)
//  of which the result is an offscreen image used as a texture in the parent scene.
class Renderer {

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Camera2D} camera
     */
    constructor(canvas, camera) {
        this._canvas = canvas;
        this._camera = camera;
        this._righClickEnabled = null;
        this._disableRightClickFn = function (event) {
            event.preventDefault();
        };
        this.setBrowserRightClickEnabled(false);

        this._displayMode = Renderer.DISPLAY_MODE.FULLSCREEN;
        this._windowResolution = new Vec2(1, 1);
        this._renderResolution = new Vec2(1, 1);
        this._clearColor = new Vec4(1, 0, 1, 1);
        this._needRepaint = true;
        this.updateScreenSize = this.updateScreenSize.bind(this);

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

        window.onresize = () => {
            this.updateScreenSize();
            if (this._onResizeCallback != null) {
                this._onResizeCallback();
            }
        };

        this._shaderUtils = new ShadersUtil(this._gl);
    }

    static DISPLAY_MODE = {
        FULLSCREEN: 0,
        FIXED_RATIO: 1,
        FIXED_RESOLUTION: 2
    };

    setOnResizeCallback(callback) {
        this._onResizeCallback = callback;
    }

    /**
     * @param {Scene2D} scene
     */
    setScene(scene) {
        this._scene = scene;
    }

    getScene() {
        return this._scene;
    }

    updateScreenSize() {
        this._windowResolution.x = window.innerWidth;
        this._windowResolution.y = window.innerHeight;
        switch (this._displayMode) {
            default:
            case Renderer.DISPLAY_MODE.FULLSCREEN:
                this._renderResolution.copy(this._windowResolution);
                this._ratio = this._renderResolution.x / this._renderResolution.y;
                break;
            case Renderer.DISPLAY_MODE.FIXED_RESOLUTION:
                this._ratio = this._renderResolution.x / this._renderResolution.y;
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
        this._needRepaint = true;
    }

    /**
     * Render the attached scene
     * @param {number} detlaTime in seconds
     */
    render(detlaTime) {
        const scene = this.getScene();
        if (scene == null) {
            console.warn('Cannot render, Scene has not been defined');
        }
        const root = scene.getRoot();
        const camera = scene.getCamera();
        if (root == null || camera == null) {
            console.warn('Cannot render, root or camera is not defined');
        }
        // 1. update entities status and matrices
        root.update(detlaTime, UNIT_MATRIX);

        // 2. render scenegraph
        root.draw(this);
        this._needRepaint = false;
    }

    /**
     * Clear the render target with the defined clear color.
     */
    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    /**
     * Set the clear color to clear the rendertarget.
     * @param {Vec4} color the color in [0 to 1] RBGA components
     */
    setClearColor(color) {
        this._clearColor.copy(color);
        this._gl.clearColor(this._clearColor.x, this._clearColor.y, this._clearColor.z, this._clearColor.w);
    }

    setDisplayFullscreen() {
        this._displayMode = Renderer.DISPLAY_MODE.FULLSCREEN;
        this.updateScreenSize();
    }

    setDisplayFixedResolution(resolution) {
        this._displayMode = Renderer.DISPLAY_MODE.FIXED_RESOLUTION;
        this._renderResolution.copy(resolution);
        this.updateScreenSize();
    }

    setDisplayFixedRatio(ratio) {
        this._displayMode = Renderer.DISPLAY_MODE.FIXED_RATIO;
        this._ratio = ratio;
        this.updateScreenSize();
    }

    getCanvas() {
        return this._canvas;
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
    getCamera() {
        return this._camera;
    }

    /** @returns {ShadersUtil} */
    getShaderUtils() {
        return this._shaderUtils;
    }

    needRepaint() {
        return this._needRepaint;
    }

    /**
     * Turn the browser right click contextual menu on or off. Default is false.
     * Should be left to false to allow theengine Right click mouse events to work properly.
     * @param {boolean} enabled
     */
    setBrowserRightClickEnabled(enabled) {
        if (this._righClickEnabled === enabled) return;
        this._righClickEnabled = enabled;
        if (this._righClickEnabled) {
            window.removeEventListener("contextmenu", this._disableRightClickFn);
        } else {
            window.addEventListener("contextmenu", this._disableRightClickFn);
        }
    }
}
