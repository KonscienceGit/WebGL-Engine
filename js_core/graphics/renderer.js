class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Vec2} viewPortPixelSize
     */
    constructor(canvas, viewPortPixelSize) {
        this._viewPortPixelSize = viewPortPixelSize;
        // noinspection JSUnresolvedVariable
        let clWidth = canvas.parentNode.clientWidth;
        // noinspection JSUnresolvedVariable
        let clHeight = canvas.parentNode.clientHeight;
        let scWidth = screen.availWidth;
        let scHeight = screen.availHeight;
        let height = Math.min(clHeight, scHeight);
        let width = Math.min(clWidth, scWidth);

        let scaleh = 1.;
        if (height < canvas.height) {
            scaleh = height / canvas.height;
        }
        let scalew = 1.;
        if (width < canvas.width) {
            scalew = width / canvas.width;
        }
        let scale = Math.min(scalew, scaleh);

        this._gl = canvas.getContext('webgl2', {
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
        canvas.width = Math.floor(canvas.width * scale);
        canvas.height = Math.floor(canvas.height * scale);
        this._gl.viewport(0, 0, canvas.width, canvas.height);
        this.clear();
    }

    /**
     * @param {Array.<Sprite>} spriteArray
     */
    draw(spriteArray) {
        spriteArray.forEach(entity => entity.draw(this._gl));
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }

    /**
     * @returns {WebGL2RenderingContext}
     */
    getGL() {
        return this._gl;
    }

    getVirtualViewPortSize(){
        return this._viewPortPixelSize;
    }
}
