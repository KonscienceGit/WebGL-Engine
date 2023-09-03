const DEFAULT_VERTICES = new Float32Array([
    // 0---1
    // | / |
    // 2-- 3
    // X, Y, U, V
    -0.5, -0.5, 0, 1,
    0.5, -0.5, 1, 1,
    -0.5, 0.5, 0, 0,
    0.5, 0.5, 1, 0
]);

const DEFAULT_INDICES = new Uint8Array([
    0, 1, 2, 2, 1, 3
]);
const DEFAULT_VERTICE_ATTRIBS_COUNT = 4; // X,Y,U,V

const VERTEX_SHADER = ShadersUtil.SHADER_HEADER +
    'uniform mat3 modelWorld;' +
    'uniform mat3 viewProj;' +
    'in vec2 vertCoords;' +
    'in vec2 textCoordinates;' +
    'out vec2 textCoord;' +

    'void main(void) {' +
    '    textCoord = textCoordinates;' +
    '    vec3 pos = vec3(vertCoords, 1.);' +
    // x2 to convert from [-0.5, 0.5] to [-1, 1] space
    '    pos = pos * modelWorld * viewProj * 2.;' +
    '    gl_Position = vec4(pos.xy, 0., 1.);' +
    '}';

const FRAGMENT_SHADER = ShadersUtil.SHADER_HEADER +
    'uniform int textureLayer;' +
    'uniform vec4 color;' +
    'uniform sampler2DArray textureSample;' +
    'uniform float alphaOutline;' +
    'in vec2 textCoord;' +
    'out vec4 outColor;' +

    'void main(void) {' +
    '    outColor = color * texture(textureSample, vec3(textCoord, textureLayer));' +
    '    outColor.rgb = outColor.rgb * pow(outColor.a, alphaOutline);' +
    '}';

/**
 * Can be animated by storing multiple images.
 */
class Sprite extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {options} [options] the sprite options.
     * @param {string[]|string} [options.imagespaths] the path (or array of pathes) to the images to loaf in the sprites.
     * @param {Vec4} [options.color] the sprite color, if not using an image (or the image is not found.)
     * @param {Sprite.AutoSizeMode} [options.autosizemode] The sprite resizing logic after loading its image. Default is UNIT_VERTICAL.
     */
    // TODO remove renderer arg in all implementations, after making init asyncrhonous
    constructor(renderer, options) {
        super();
        this._shaderName = 'Sprite';
        this._initialized = false;
        this._autoSizeMode = Sprite.AutoSizeMode.UNIT_VERTICAL;
        this.setVisible(true);
        this.setVertices(DEFAULT_VERTICES);
        this.setIndices(DEFAULT_INDICES);
        this.size.setValues(1, 1);
        this._updateVBO = false;
        this.textureSize = new Vec2(1, 1);
        this._time = 0;
        const gl = renderer.getGLContext();

        let imagesPaths = null;
        let color = null;
        if (options == null) {
            console.warn('Sprite: warning, missing options in constructor');
        } else {
            if (options.hasOwnProperty('color')) color = options.color;
            if (options.hasOwnProperty('imagespaths')) imagesPaths = options.imagespaths;
            if (options.hasOwnProperty('autosizemode')) this._autoSizeMode = options.autosizemode;
        }

        // TODO move to asynchronous
        this._texture = gl.createTexture();
        this.loadTempTexture(gl, this._texture, color);
        this.initGraphics(renderer);

        if (imagesPaths != null) {
            this.setLoaded(false);
            if (!Array.isArray(imagesPaths)) imagesPaths = [imagesPaths];
            this._imageCount = imagesPaths.length;
            this._imageLoadedCount = 0;

            for (let i = 0; i < this._imageCount; i++) {
                this.loadImage(i, imagesPaths[i], gl, this._texture);
            }
        }
        this._uniFp2 = new Float32Array(2);
        this._uniFp4 = new Float32Array(4);
    }

    /**
     * Define the auto resizing behavior of the Sprite once the image has been loaded.
     * In all case, the sprite center remain at the sprite center,
     * so sprite position might need an update after the image has been loaded, depending on needs.
     * @enum
     */
    static AutoSizeMode = {
        /**
         * The Sprite size will match the image pixel size.
         * (ie: a 50x80px image will then set the SPrite size to 50 width and 80 height.)
         * Main use is with pixel art.
         */
        PIXEL_SIZE: 0,
        /**
         * The Sprite size will be unit (1) vertically, and the horizontal size will depend on the image aspect ratio.
         * (ie: a 100x200 px image will have a size of 0.5 width and 1 height, since the image is 2x taller than large).
         */
        UNIT_VERTICAL: 1,
        /**
         * The Sprite size will be unit (1) horizontally, and the vertical size will depend on the image aspect ratio.
         * (ie: a 100x200 px image will have a size of 1 width and 2 height, since the image is 2x taller than large).
         */
        UNIT_HORIZONTAL: 2,
        /**
         * The Sprite size will remain at the size defined by the user before loading the image.
         * By default (if not changed) this will be x:1, y:1.
         */
        OFF: 3
    };

    updateEntity(delta) {
        super.updateEntity(delta);
        this._time += delta;
    }

    initGraphics(renderer) {
        // Shaders, get attributes and uniforms handles
        const gl = renderer.getGLContext();
        const shaderUtils = renderer.getShaderUtils();
        this._program = shaderUtils.getOrCreateShader(gl, this._shaderName, VERTEX_SHADER, FRAGMENT_SHADER, this.constructor.name);
        gl.useProgram(this._program);
        this._coordAttrib = gl.getAttribLocation(this._program, "vertCoords");
        this._textCoordAttrib = gl.getAttribLocation(this._program, "textCoordinates");

        this._scaleUniform = gl.getUniformLocation(this._program, "scale");
        this._positionUniform = gl.getUniformLocation(this._program, "position");
        this._rotationUniform = gl.getUniformLocation(this._program, "rotation");
        this._colorUniform = gl.getUniformLocation(this._program, "color");

        this._modelWorldMatUniform = gl.getUniformLocation(this._program, "modelWorld");
        this._viewProjMatUniform = gl.getUniformLocation(this._program, "viewProj");

        this._spriteDimensionsUniform = gl.getUniformLocation(this._program, "spriteDimensions");
        this._canvasPositionUniform = gl.getUniformLocation(this._program, "canvasPosition");
        this._textureLayerUniform = gl.getUniformLocation(this._program, "textureLayer");
        this._alphaOutlineUniform = gl.getUniformLocation(this._program, "alphaOutline");
        this._initTexture = true;

        // VAO setup
        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);

        this._vertex_buffer = gl.createBuffer();
        this._index_buffer = gl.createBuffer();
        this.updateVBO(gl);

        const fp32Bytes = 4;
        const vertexCoord = 2;
        const textCoord = 2;
        const stride = (vertexCoord + textCoord) * fp32Bytes;
        const textCoordOffset = vertexCoord * fp32Bytes;
        gl.enableVertexAttribArray(this._coordAttrib);
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(this._textCoordAttrib);
        gl.vertexAttribPointer(this._textCoordAttrib, 2, gl.FLOAT, false, stride, textCoordOffset);
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        // if (!this._initialized) {
        //     this._initialized = true;
        //     this._texture = gl.createTexture();
        //     this.loadTempTexture(gl, this._texture, color);
        //     this.initGraphics(renderer);
        // }
        this.setupContext(renderer);
        const nbIndices = this.getIndices().length;
        gl.drawElements(gl.TRIANGLES, nbIndices, gl.UNSIGNED_BYTE, 0);
        this.restoreContext(gl);
        super.draw(renderer);
    }

    /**
     * Set this Sprite size. Only change the quad size, this sprite children are not affected.
     * This has the side effect of setting the autoSizeMode to OFF, enforcing the given size.
     * To keep the aspect ratio of the loaded image, please instead use .setSizeKeepAspectRatio().
     * This internally update the Sprite vertices and will be slower than updating the Sprite scale.
     * If performance is a concern, please consider using .scale instead.
     * @param {number} x
     * @param {number} y
     */
    setSize(x, y) {
        this.size.setValues(x, y);
        this._autoSizeMode = Sprite.AutoSizeMode.OFF;
        this.updateSize();
    }

    /**
     * Set this Sprite size, keeping the original image aspect ration.
     * Please make sure this sprite.autoSizeMode is set either to UNIT_VERTICAL or UNIT_HORIZONTAL to avoid side effects.
     * Only change the quad size, this sprite children are not affected.
     * This internally update the Sprite vertices and will be slower than updating the Sprite scale.
     * If performance is a concern, please consider using .scale instead.
     * @param {number} size
     */
    setSizeKeepAspectRatio(size) {
        const backupAutosize = this._autoSizeMode;
        switch (this._autoSizeMode) {
            default:
            case Sprite.AutoSizeMode.UNIT_VERTICAL:
                this.size.x = size * this.textureSize.x / this.textureSize.y;
                this.size.y = size;
                break;
            case Sprite.AutoSizeMode.UNIT_HORIZONTAL:
                this.size.x = size;
                this.size.y = size * this.textureSize.y / this.textureSize.x;
                break;
        }
        this._autoSizeMode = Sprite.AutoSizeMode.OFF;
        this.updateSize();
        this._autoSizeMode = backupAutosize;
    }

    /**
     * @private
     */
    updateSize() {
        switch (this._autoSizeMode) {
            default:
            case Sprite.AutoSizeMode.OFF:
                break;
            case Sprite.AutoSizeMode.PIXEL_SIZE:
                this.size.copy(this.textureSize);
                break;
            case Sprite.AutoSizeMode.UNIT_VERTICAL:
                this.size.x = this.textureSize.x / this.textureSize.y;
                this.size.y = 1;
                break;
            case Sprite.AutoSizeMode.UNIT_HORIZONTAL:
                this.size.x = 1;
                this.size.y = this.textureSize.y / this.textureSize.x;
                break;
        }
        this.generateVertices(this.size);
    }

    /**
     * @protected
     * @param {Renderer} renderer
     */
    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        if (this._updateVBO) {
            this.updateVBO(gl);
        }
        gl.useProgram(this._program);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        this.setupUniforms(gl, this);
        renderer.getCamera().setViewProjectionUniform(gl, this._viewProjMatUniform);
    }

    /**
     *
     * @param {WebGL2RenderingContext} gl
     */
    updateVBO(gl) {
        this._updateVBO = false;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.getIndices(), gl.STATIC_DRAW);
    }

    /**
     * If this sprite uses texture(s), this method is fired as soon as all texture are loaded.
     * @protected
     */
    onImageLoaded() {
        this.radius = (this.size.x + this.size.y) / 4;
    }

    /**
     * For debug purpose. Can be disabled if the scene renders correctly without it.
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        gl.bindVertexArray(null);
    }

    /**
     * @returns {number}
     */
    getImageCount() {
        return this._imageCount;
    }

    /**
     * Setup the uniforms for the given entity. Usually a sprite will setup its own uniforms,
     * but for multi-sprites which render a lot of similar sprites (sharing the same shader and texture)
     * this can be used to set the uniforms of other entity on this entity render.
     * @protected
     * @param {WebGL2RenderingContext} gl
     * @param {Entity} entity
     */
    setupUniforms(gl, entity) {
        gl.uniform1i(this._textureLayerUniform, entity.textureLayer);
        gl.uniform1f(this._rotationUniform, entity.rotation);
        gl.uniform1f(this._alphaOutlineUniform, entity.alphaOutline);
        gl.uniformMatrix3fv(this._modelWorldMatUniform, false, entity.modelWorldMat.m);
        const u2 = this._uniFp2;
        gl.uniform2fv(this._spriteDimensionsUniform, entity.size.toArray(u2));
        gl.uniform2fv(this._scaleUniform, entity.scale.toArray(u2));
        gl.uniform2fv(this._positionUniform, entity.position.toArray(u2));
        gl.uniform4fv(this._colorUniform, entity.color.toArray(this._uniFp4));
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} tex
     * @param {Vec4} color
     */
    loadTempTexture(gl, tex, color) {
        let pixelData;
        if (color) {
            pixelData = new Uint8Array([color.x * 255, color.y * 255, color.z * 255, color.w * 255]);
        } else {
            pixelData = ShadersUtil.getDefaultBluePixelData();
        }
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }

    /**
     * @param {number} index
     * @param {String} url
     * @param {WebGL2RenderingContext} gl
     * @param {WebGLTexture} tex
     */
    loadImage(index, url, gl, tex) {
        const image = new Image();
        image.src = url;
        image.addEventListener('load', () => {
            const tsize = this.textureSize;
            const target = gl.TEXTURE_2D_ARRAY;
            gl.bindTexture(target, tex);
            if (this._initTexture) {
                this._initTexture = false;
                tsize.setValues(image.width, image.height);
                gl.texStorage3D(target, 1, gl.RGBA8, tsize.x, tsize.y, this._imageCount);
                gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
            gl.texSubImage3D(target, 0, 0, 0, index, tsize.x, tsize.y, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);
            this._imageLoadedCount++;
            if (this._imageLoadedCount === this._imageCount) {
                this.updateSize();
                this.setLoaded(true);
                this.onImageLoaded();
            }
        });
    }

    /**
     * Default implementation, generate vertice data for a quad with UV properties.
     * @param {any} size Vector 2 for the Quad size, but the type can be customized by overriding in inherited classes.
     */
    generateVertices(size) {
        const nbVals = DEFAULT_VERTICES.length;
        const verts = new Float32Array(nbVals);
        const x = this.size.x;
        const y = this.size.y;
        for (let i = 0; i < nbVals; i += DEFAULT_VERTICE_ATTRIBS_COUNT) {
            verts[i] = DEFAULT_VERTICES[i] * x;
            verts[i + 1] = DEFAULT_VERTICES[i + 1] * y;
            verts[i + 2] = DEFAULT_VERTICES[i + 2];
            verts[i + 3] = DEFAULT_VERTICES[i + 3];
        }
        this.setVertices(verts);
    }

    /**
     * @returns {Float32Array}
     */
    getVertices() {
        return this._vertices;
    }

    /**
     * @param {Float32Array} verts
     */
    setVertices(verts) {
        this._vertices = verts;
        this._updateVBO = true;
    }

    /**
     * @returns {Uint8Array}
     */
    getIndices() {
        return this._indices;
    }

    /**
     * @param {Uint8Array} indices
     */
    setIndices(indices) {
        this._indices = indices;
        this._updateVBO = true;
    }
}
