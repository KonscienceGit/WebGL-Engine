/**
 * Can be animated by storing multiple images.
 * Images should be named as follow (if the file extension is .png)
 * 0.png, 1.png, 2.png ... N.png
 *
 * @param gl openGL context
 * @param canvas the canvas used for render
 * @param imageFolder the path to the folder holding the images
 * @param fileExtension the file format extension (usually .png)
 * @param imageCount the number of image in the given folder
 */
class AnimatedSprite extends Sprite {
    constructor(gl, canvas, imageFolder, fileExtension, imageCount) {
        super(gl, canvas, imageFolder);
        this._imageCount = imageCount;
        this._fileExtension = fileExtension;
        this._imageFolder = imageFolder;

        for (let i = 0; i < this._imageCount; i++) {
            this.loadSubImage(i, this._imageFolder + i + this._fileExtension, gl, this, this._texture);
        }
    }

    initShaderAttributes(gl) {
        super.initShaderAttributes(gl);
        this.textureLayerUniform = gl.getUniformLocation(this.shaderProgram, "textureLayer");
        this.initTexture = true;
        this._textureLayer = 0;
    }

    setTextureLayer(layerIndex) {
        this._textureLayer = layerIndex;
    }

    getImageCount() {
        return this._imageCount;
    }

    setupContext(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.useProgram(this.shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this._texture);
        gl.enableVertexAttribArray(this.coordAttrib);
        gl.enableVertexAttribArray(this.textCoordAttrib);
        gl.uniform4fv(this.scaleAndPosUniform, [this.scale.x, this.scale.y, this.position.x, this.position.y]);
        gl.uniform1i(this.textureLayerUniform, this._textureLayer);
    }

    loadTexture(gl, thisClass, tex) {
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }


    loadSubImage(index, url, gl, obj, tex) {
        let image = new Image();
        image.src = url;
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            let imgDim = new Vec2(image.width, image.height);
            obj._imgDim = imgDim.clone();
            let scaleX = imgDim.x / obj.canvasDim.x;
            let scaleY = imgDim.y / obj.canvasDim.y;
            obj.scale = new Vec2(scaleX, scaleY);
            obj.referenceScale = new Vec2(scaleX, scaleY);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, tex);
            if (obj.initTexture) {
                obj.initTexture = false;
                gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, imgDim.x, imgDim.y, 3);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            }
            gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, index, imgDim.x, imgDim.y, 1, gl.RGBA, gl.UNSIGNED_BYTE, image);
        });
    }

    getFragmentShaderCode() {
        return SHADER_HEADER +
            'precision mediump sampler2DArray;' +
            'uniform int textureLayer;' +
            'uniform sampler2DArray textureSample;' +
            'in vec2 textCoord;' +
            'out vec4 outColor;' +

            'void main(void) {' +
            ' vec4 frcolor = texture(textureSample, vec3(textCoord, textureLayer));' +
            ' if (frcolor.a == 0.)' +
            '  discard;' +
            ' outColor = frcolor;' +
            '}';
    }
}