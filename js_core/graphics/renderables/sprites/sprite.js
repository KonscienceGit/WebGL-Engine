/**
 * Can be animated by storing multiple images.
 * Images should be named as follow (if the file extension is .png)
 * 0.png, 1.png, 2.png ... N.png
 */
class Sprite extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {String} imageFolder
     * @param {String[]} imagesNames the array of images names to load in the sprites. Can contain only 1 image _name.
     */
    constructor(renderer, imageFolder, imagesNames) {
        super();
        let gl = renderer.getGLContext();
        this.visible = false;
        this._isLoaded = false;
        this._texture = gl.createTexture();
        this._referencePosition = new Vec2(0, 0);
        this._vertex_buffer = gl.createBuffer();

        this.loadTempTexture(gl, this._texture);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        this._shaderProgram = this.getShaderProgram(gl);
        this.initShaderAttributes(gl);
        this._imageCount = imagesNames.length;
        this._imageFolder = imageFolder;
        this._imageLoadedCount = 0;

        for (let i = 0; i < this._imageCount; i++) {
            this.loadSubImage(i, this._imageFolder + imagesNames[i], gl, this._texture);
        }
    }

    getShaderProgram(gl) {
        return new ShadersUtil(gl).getSpriteShaderProgram();
    }

    initShaderAttributes(gl) {
        gl.useProgram(this._shaderProgram);
        this._coordAttrib = gl.getAttribLocation(this._shaderProgram, "vertCoords");
        this._textCoordAttrib = gl.getAttribLocation(this._shaderProgram, "textCoordinates");
        this._scaleUniform = gl.getUniformLocation(this._shaderProgram, "scale");
        this._positionUniform = gl.getUniformLocation(this._shaderProgram, "position");
        this._rotationUniform = gl.getUniformLocation(this._shaderProgram, "rotation");
        this._spriteDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "spriteDimensions");
        this._canvasDimensionsUniform = gl.getUniformLocation(this._shaderProgram, "canvasDimensions");

        const floatBytes = 4;
        const vertexCoord = 2;
        const textCoord = 2;
        const stride = vertexCoord * textCoord * floatBytes;
        const textCoordOffset = vertexCoord * floatBytes;
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(this._textCoordAttrib, 2, gl.FLOAT, false, stride, textCoordOffset);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this._textureLayerUniform = gl.getUniformLocation(this._shaderProgram, "textureLayer");
        this._initTexture = true;
    }

    /**
     * Must be called when this entity has finished loading and initializing (its texture that might be deferred etc).
     * It is important that this method is called in a finite time, to allow loading managers that depend on it to progress.
     */
    imageLoaded() {
        this.setLoaded(true);
        this.physicSizeXY.set(this.renderSizeXY);
        this.radius = this.physicSizeXY.x / 2;
    }

    /**
     * @param {Renderer} renderer
     */
    draw(renderer) {
        if (!this.isVisible()) {
            return;
        }
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
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.useProgram(this._shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        this.setupAttribs(gl);
        this.setupUniforms(renderer);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    setupAttribs(gl) {
        gl.enableVertexAttribArray(this._coordAttrib);
        gl.enableVertexAttribArray(this._textCoordAttrib);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        gl.disableVertexAttribArray(this._coordAttrib);
        gl.disableVertexAttribArray(this._textCoordAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
        gl.uniform2fv(this._spriteDimensionsUniform, [this.renderSizeXY.x, this.renderSizeXY.y]);
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
    loadSubImage(index, url, gl, tex) {
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

    /**
     * @param {number} spriteCount
     * @param {String} extension
     * @returns {String[]}
     */
    static generateFileNameList(spriteCount, extension) {
        let numberList = [];
        for (let i = 0; i < spriteCount; i++) {
            numberList.push(i.toString() + extension);
        }
        return numberList;
    }

    static getFileName(fileName, extension) {
        return [fileName + extension];
    }

    /**
     * @param {Vec2} imgDim
     */
    setImageDimensions(imgDim) {
        this.renderSizeXY.set(imgDim);
    }

    /**
     * @returns {Float32Array}
     */
    getVertices() {
        return new Float32Array([-1, -1, 0.0, 1.0, +1, -1, 1.0, 1.0, -1, +1, 0.0, 0.0, +1, +1, 1.0, 0.0, -1, +1, 0.0, 0.0, +1, -1, 1.0, 1.0]);
    }

    /**
     * @returns {boolean}
     */
    isLoaded() {
        return this._isLoaded;
    }

    /**
     * @param {boolean} bool
     */
    setLoaded(bool) {
        this._isLoaded = bool;
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