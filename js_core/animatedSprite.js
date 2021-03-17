class AnimatedSprite extends Sprite {
    initShaderAttributes(gl) {
        super.initShaderAttributes(gl);
        this.textureLayerUniform = gl.getUniformLocation(this.shaderProgram, "textureLayer");
    }

    setupContext(gl) {
        let textureLayer = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.useProgram(this.shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.enableVertexAttribArray(this.coordAttrib);
        gl.enableVertexAttribArray(this.textCoordAttrib);
        gl.uniform4fv(this.scaleAndPosUniform, [this.scale.x, this.scale.y, this.position.x, this.position.y]);
        gl.uniform1i(this.textureLayerUniform, textureLayer);
    }

    loadTexture(gl, obj, tex) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        gl.bindTexture(gl.TEXTURE_2D, null);

        //Asynchronously load an image
        let image = new Image();
        image.src = this.imgLoc;
        image.addEventListener('load', function () {
            // Now that the image has loaded make copy it to the texture.
            obj.imgDim = new Vec2(image.width, image.height);
            let scaleX = obj.imgDim.x / obj.canvasDim.x;
            let scaleY = obj.imgDim.y / obj.canvasDim.y;
            obj.scale = new Vec2(scaleX, scaleY);
            obj.referenceScale = new Vec2(scaleX, scaleY);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        });
    }

    getFragmentShaderCode() {
        return '#ifdef GL_ES \n precision mediump float; \n #endif \n' +
            'varying vec2 textCoord;' +
            'uniform int textureLayer;' +
            'uniform sampler2D textureSample;' +

            'void main(void) {' +
            ' vec4 frcolor = texture2D(textureSample, textCoord);' +
            ' if (frcolor.a == 0.)' +
            '  discard;' +
            ' gl_FragColor = frcolor;' +
            '}';
    }
}