/**
 * Can be animated by storing multiple images.
 * Images should be named as follow (if the file extension is .png)
 * 0.png, 1.png, 2.png ... N.png
 */
class Sprite {
    /**
     * @param {Renderer} renderer
     * @param {String} imageFolder
     * @param {String[]} imagesNames the array of images names to load in the sprites. Can contain only 1 image name.
     */
    constructor(renderer, imageFolder, imagesNames) {
        let gl = renderer.getGL();
        this._entityProperties = new EntityProperties();
        this._entityProperties.isVisible = false;
        this._isLoaded = false;
        this._texture = gl.createTexture();
        this._referencePosition = new Vec2(0, 0);

        this._canvasDim = renderer._viewPortPixelSize.clone();
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
     * Must be called when this entity has finished loading and initializing (its texture thatm ight be deffered etc).
     * It is important that this method is called in a finite time, to allow loading managers that depend on it to progress.
     */
    imageLoaded() {
        this.setLoaded(true);
        this._entityProperties.physicSizeXY.set(this._entityProperties.renderSizeXY);
        this._entityProperties.radius = this._entityProperties.physicSizeXY.x / 2;
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    draw(gl) {
        if (!this.isVisible()) {
            return;
        }
        this.setupContext(gl);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.restoreContext(gl);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    setupContext(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.useProgram(this._shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        this.setupAttribs(gl);
        this.setupUniforms(gl);
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
     * @param {number} delta
     */
    updateSprite(delta) {
        this._entityProperties.timeAlive += delta;
    }

    /**
     * @param {number} layerIndex
     */
    setTextureLayer(layerIndex) {
        this._entityProperties.textureLayer = layerIndex;
    }

    /**
     * @returns {number}
     */
    getImageCount() {
        return this._imageCount;
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    setupUniforms(gl) {
        gl.uniform2fv(this._scaleUniform, [this._entityProperties.scale.x, this._entityProperties.scale.y]);
        gl.uniform2fv(this._positionUniform, [this._entityProperties.position.x, this._entityProperties.position.y]);
        gl.uniform1f(this._rotationUniform, this._entityProperties.rotation);
        gl.uniform2fv(this._spriteDimensionsUniform, [this._entityProperties.renderSizeXY.x, this._entityProperties.renderSizeXY.y]);
        gl.uniform2fv(this._canvasDimensionsUniform, [this._canvasDim.x, this._canvasDim.y]);
        gl.uniform1i(this._textureLayerUniform, this._entityProperties.textureLayer);
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
        this._entityProperties.renderSizeXY.set(imgDim);
    }

    /**
     * @returns {Vec2}
     */
    getImageDimensions() {
        return this._entityProperties.renderSizeXY;
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
    isVisible() {
        return this._entityProperties.isVisible;
    }

    /**
     * @param {boolean} bool
     */
    setVisible(bool) {
        this._entityProperties.isVisible = bool;
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
        this._entityProperties.scale.x = x;
        this._entityProperties.scale.y = y;
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
        return this._entityProperties.position;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setPosition(x, y) {
        this._entityProperties.position.x = x;
        this._entityProperties.position.y = y;
        this._referencePosition.x = x;
        this._referencePosition.y = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setTopLeftPixelPostition(x, y) {
        this.setPosition(x - this._canvasDim.x / 2, this._canvasDim.y / 2 - y);
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    setTopRightPixelPostition(x, y) {
        this.setPosition(this._canvasDim.x / 2 - x, this._canvasDim.y / 2 - y);
    }

    /**
     * @returns {EntityProperties}
     */
    getEntityProperties() {
        return this._entityProperties;
    }
}