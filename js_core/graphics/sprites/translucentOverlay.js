class TranslucentOverlay extends Sprite {
    /**
     * @param {Renderer} renderer
     * @param {Vec4} colorVec4
     */
    constructor(renderer, colorVec4) {
        super(renderer, "", []);
        this._colorArray = new Uint8Array([0, 0, 0, 0]);
        this._colorVec4 = new Vec4(0, 0, 0, 0);
        this._opacity = 1.0;
        this._update = true;
        this.setColor(colorVec4);
        this.updateColorTexture(renderer.getGL());
        this._entityProperties.renderSizeXY.set(this._canvasDim);//set the sprite to cover the whole canvas
        this.imageLoaded();
    }

    draw(gl) {
        if (this._update) {
            this._update = false;
            this.updateColorTexture(gl);
        }
        super.draw(gl);
    }

    /**
     * @param {Vec4} color
     */
    setColor(color) {
        this._colorVec4.set(color);
        this._colorArray[0] = this._colorVec4.x;
        this._colorArray[1] = this._colorVec4.y;
        this._colorArray[2] = this._colorVec4.z;
        this._colorArray[3] = this._colorVec4.w * this._opacity;
        this._update = true;
    }

    /**
     * @param {number} opacity
     */
    setOpacity(opacity) {
        this._opacity = opacity;
        this._colorArray[3] = this._colorVec4.w * this._opacity;
        this._update = true;
    }

    loadTempTexture(gl, tex) {
        //override, do nothing
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    updateColorTexture(gl) {
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, this._colorArray);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }
}
