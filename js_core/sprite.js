class Sprite {
    constructor(gl, canvas, imageLoc) {
        this.imgLoc = imageLoc;
        this.texture = gl.createTexture();
        this.loadTexture(gl, this, this.texture);
        this.canvasDim = new Vec2(canvas.width, canvas.height);
        this.position = new Vec2(0.0, 0.0);
        this.movingDir = 0;
        this.scale = new Vec2(1.0, 1.0);
        this.referenceScale = new Vec2(1.0, 1.0);
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        this.shaderProgram = ShadersUtil.createProgram(this.getVertexShaderCode(), this.getFragmentShaderCode(), gl);
        this.initShaderAttributes(gl);
    }

    initShaderAttributes(gl) {
        gl.useProgram(this.shaderProgram);
        this.coordAttrib = gl.getAttribLocation(this.shaderProgram, "coordinates");
        this.textCoordAttrib = gl.getAttribLocation(this.shaderProgram, "textCoordinates");
        this.scaleAndPosUniform = gl.getUniformLocation(this.shaderProgram, "scaleAndPos");

        let floatBytes = 4;
        let vertexCoord = 2;
        let textCoord = 2;
        let stride = vertexCoord * textCoord * floatBytes;
        let textCoordOffset = vertexCoord * floatBytes;
        gl.vertexAttribPointer(this.coordAttrib, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribPointer(this.textCoordAttrib, 2, gl.FLOAT, false, stride, textCoordOffset);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw(gl) {
        this.setupContext(gl);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.restoreContext(gl);
    }

    setupContext(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.useProgram(this.shaderProgram);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.enableVertexAttribArray(this.coordAttrib);
        gl.enableVertexAttribArray(this.textCoordAttrib);
        gl.uniform4fv(this.scaleAndPosUniform, [this.scale.x, this.scale.y, this.position.x, this.position.y]);
    }

    restoreContext(gl) {
        gl.disableVertexAttribArray(this.coordAttrib);
        gl.disableVertexAttribArray(this.textCoordAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
            let imgDim = new Vec2(image.width, image.height);
            let scaleX = imgDim.x / obj.canvasDim.x;
            let scaleY = imgDim.y / obj.canvasDim.y;
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

    getVertexShaderCode() {
        return '#ifdef GL_ES \n precision mediump float; \n #endif \n' +

            'uniform vec4 scaleAndPos;' +
            'attribute vec2 coordinates;' +
            'attribute vec2 textCoordinates;' +
            'varying vec2 textCoord;' +

            'void main(void) {' +
            ' textCoord = textCoordinates;' +
            ' vec2 pos = coordinates*scaleAndPos.xy + scaleAndPos.zw;' +
            ' gl_Position = vec4(pos,0.0, 1.0);' +
            '}';
    }

    getFragmentShaderCode() {
        return '#ifdef GL_ES \n precision mediump float; \n #endif \n' +
            'varying vec2 textCoord;' +
            'uniform sampler2D textureSample;' +

            'void main(void) {' +
            ' vec4 frcolor = texture2D(textureSample, textCoord);' +
            ' if (frcolor.a == 0.)' +
            '  discard;' +
            ' gl_FragColor = frcolor;' +
            '}';
    }

    getVertices() {
        return new Float32Array([-1, -1, 0.0, 1.0, +1, -1, 1.0, 1.0, -1, +1, 0.0, 0.0, +1, +1, 1.0, 0.0, -1, +1, 0.0, 0.0, +1, -1, 1.0, 1.0]);
    }
}