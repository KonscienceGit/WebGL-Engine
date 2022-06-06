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
        this.size.setValues(0, 0);
        this._definedWidth = null;
        this._definedHeight = null;
        this.textureSize = new Vec2(0, 0);
        this.setLoaded(false);
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
        this._colorUniform = gl.getUniformLocation(this._shaderProgram, "color");
        this._spriteDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "spriteDimensions");
        this._canvasDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "canvasDimensions");
        this._textureLayerUniform = gl.getUniformLocation(this._shaderProgram, "textureLayer");
        this._alphaOutlineUniform = gl.getUniformLocation(this._shaderProgram, "alphaOutline");
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
        this.radius = (this.size.x + this.size.y) / 4;
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.restoreContext(gl);
    }

    /**
     * Set the sprite width, the sprite will adapt the height based on the sprite aspect ratio
     * @param {number | null} s size in world coordinates, or null for automatic size based on height and the texture aspect ratio
     */
    setWidth(s) {
        this._definedWidth = s;
        if (this.isLoaded()) this.updateSize();
    }

    /**
     * Set the sprite height, the sprite will adapt the width based on the sprite aspect ratio
     * @param {number | null} s size in world coordinates, or null for automatic size based on width and the texture aspect ratio
     */
    setHeight(s) {
        this._definedHeight = s;
        if (this.isLoaded()) this.updateSize();
    }

    /**
     * @private
     */
    updateSize() {
        const ratio = this.textureSize.x / this.textureSize.y;
        this.size.x = this._definedWidth;
        this.size.y = this._definedHeight;
        // case 1: width defined, but not height
        if (this.size.x == null && this.size.y != null) {
            this.size.x = this.size.y * ratio;
        }
        // case 2: height defined, but not width
        if (this.size.x != null && this.size.y == null) {
            this.size.y = this.size.x / ratio;
        }
        // case 3: both undefined
        if (this.size.x == null && this.size.y == null) {
            this.size.copy(this.textureSize);
        }
    }

    /**
     * @protected
     * @param {Renderer} renderer
     */
    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        gl.useProgram(this._shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        this.setupUniforms(gl, this);
        renderer.getCamera().setProjectionUniform(gl, this._canvasDimensionsUniform);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        // gl.bindVertexArray(null);
    }

    /**
     * @returns {number}
     */
    getImageCount() {
        return this._imageCount;
    }

    /**
     * @protected
     * @param {WebGL2RenderingContext} gl
     * @param {Entity} entity
     */
    setupUniforms(gl, entity) {
        gl.uniform2fv(this._spriteDimensionsUniform, [entity.size.x, entity.size.y]);
        gl.uniform2fv(this._scaleUniform, [entity.scale.x, entity.scale.y]);
        gl.uniform2fv(this._positionUniform, [entity.position.x, entity.position.y]);
        gl.uniform1f(this._rotationUniform, entity.rotation);
        gl.uniform4fv(this._colorUniform, [entity.color.x, entity.color.y, entity.color.z, entity.color.w]);
        gl.uniform1i(this._textureLayerUniform, entity.textureLayer);
        gl.uniform1f(this._alphaOutlineUniform, entity.alphaOutline);

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
            const tsize = _self.textureSize;
            const target = gl.TEXTURE_2D_ARRAY;
            gl.bindTexture(target, tex);
            if (_self._initTexture) {
                _self._initTexture = false;
                tsize.setValues(image.width, image.height);
                gl.texStorage3D(target, 1, gl.RGBA8, tsize.x, tsize.y, _self._imageCount);
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
            gl.texSubImage3D(target, 0, 0, 0, index, tsize.x, tsize.y, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);
            _self._imageLoadedCount++;
            if (_self._imageLoadedCount === _self._imageCount) {
                _self.updateSize();
                _self.imageLoaded();
            }
        });
    }

    /**
     * @private
     * @returns {Float32Array}
     */
    getVertices() {
        return new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0, -1, 1, 0, 0, 1, -1, 1, 1]);
    }
}
