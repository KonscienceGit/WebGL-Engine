/**
 * Can be animated by storing multiple images.
 */
class Sprite extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {String[]|String} imagesPaths the path (or array of pathes) to the images to loaf in the sprites.
     */
    constructor(renderer, imagesPaths) {
        super();
        this.setLoaded(false);
        this._referencePosition = new Vec2(0, 0);
        let gl = renderer.getGLContext();
        this._texture = gl.createTexture();
        this.loadTempTexture(gl, this._texture);
        this.initGraphics(gl);
        if (!Array.isArray(imagesPaths)) imagesPaths = [imagesPaths];
        this._imageCount = imagesPaths.length;
        this._imageLoadedCount = 0;

        for (let i = 0; i < this._imageCount; i++) {
            this.loadImage(i, imagesPaths[i], gl, this._texture);
        }
    }

    initGraphics(gl) {
        // Shaders, get attributes and uniforms handles
        this._shaderProgram = new ShadersUtil(gl).getSpriteShaderProgram();
        gl.useProgram(this._shaderProgram);
        this._coordAttrib = gl.getAttribLocation(this._shaderProgram, "vertCoords");
        this._textCoordAttrib = gl.getAttribLocation(this._shaderProgram, "textCoordinates");

        this._scaleUniform = gl.getUniformLocation(this._shaderProgram, "scale");
        this._positionUniform = gl.getUniformLocation(this._shaderProgram, "position");
        this._rotationUniform = gl.getUniformLocation(this._shaderProgram, "rotation");
        this._spriteDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "spriteDimensions");
        this._canvasDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "canvasDimensions");
        this._textureLayerUniform = gl.getUniformLocation(this._shaderProgram, "textureLayer");
        this._initTexture = true;

        // VAO setup
        this._vertex_buffer = gl.createBuffer();
        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        const floatBytes = 4;
        const vertexCoord = 2;
        const textCoord = 2;
        const stride = (vertexCoord + textCoord) * floatBytes;
        const textCoordOffset = vertexCoord * floatBytes;
        gl.enableVertexAttribArray(this._coordAttrib);
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(this._textCoordAttrib);
        gl.vertexAttribPointer(this._textCoordAttrib, 2, gl.FLOAT, false, stride, textCoordOffset);
    }

    /**
     * Must be called when this entity has finished loading and initializing (its texture that might be deferred etc).
     * It is important that this method is called in a finite time, to allow loading managers that depend on it to progress.
     */
    imageLoaded() {
        this.setLoaded(true);
        this.radius = this.size.x / 2;
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.restoreContext(gl);
    }

    /**
     * @param {Renderer} renderer
     */
    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        gl.useProgram(this._shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        this.setupUniforms(renderer);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        // gl.bindVertexArray(null);
    }

    /**
     * @param {number} layerIndex
     */
    setTextureLayer(layerIndex) {
        this.textureLayer = layerIndex;
    }

    /**
     * @returns {number}
     */
    getImageCount() {
        return this._imageCount;
    }

    /**
     * @param {Renderer} renderer
     */
    setupUniforms(renderer) {
        const camera = renderer.getCamera();
        const gl = renderer.getGLContext();
        gl.uniform2fv(this._scaleUniform, [this.scale.x, this.scale.y]);
        gl.uniform2fv(this._positionUniform, [this.position.x, this.position.y]);
        gl.uniform1f(this._rotationUniform, this.rotation);
        gl.uniform2fv(this._spriteDimensionsUniform, [this.size.x, this.size.y]);
        camera.setProjectionUniform(gl, this._canvasDimensionsUniform);
        gl.uniform1i(this._textureLayerUniform, this.textureLayer);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} tex
     */
    loadTempTexture(gl, tex) {
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, ShadersUtil.getDefaultBluePixelData());
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }

    /**
     * @param {number} index
     * @param {String} url
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} tex
     */
    loadImage(index, url, gl, tex) {
        const _self = this;
        let image = new Image();
        image.src = url;
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            let imgDim = new Vec2(image.width, image.height);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
            if (_self._initTexture) {
                _self._initTexture = false;
                _self.setImageDimensions(new Vec2(image.width, image.height));
                gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, imgDim.x, imgDim.y, _self._imageCount);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, index, imgDim.x, imgDim.y, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);
            _self._imageLoadedCount++;
            if (_self._imageLoadedCount === _self._imageCount) {
                _self.imageLoaded();
            }
        });
    }

    static getFileName(fileName, extension) {
        return [fileName + extension];
    }

    /**
     * @param {Vec2} imgDim
     */
    setImageDimensions(imgDim) {
        this.size.copy(imgDim);
    }

    /**
     * @returns {Float32Array}
     */
    getVertices() {
        return new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0, -1, 1, 0, 0, 1, -1, 1, 1]);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setScale(x, y) {
        this.scale.x = x;
        this.scale.y = y;
    }

    /**
     * @returns {Vec2}
     */
    // TODO remove
    getReferencePosition() {
        return this._referencePosition;
    }

    /**
     * @returns {Vec2}
     */
    getRenderPosition() {
        return this.position;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this._referencePosition.x = x;
        this._referencePosition.y = y;
    }
}
