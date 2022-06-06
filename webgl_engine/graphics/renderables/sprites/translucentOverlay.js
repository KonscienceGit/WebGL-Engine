class TranslucentOverlay extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {Vec4} colorVec4
     */
    constructor(renderer, colorVec4) {
        super();
        this._program = null;
        this._shaderName = "TranslucentOverlay";
        this._colorVec4 = colorVec4;
        this._opacity = 1.0;
        this.initOverlay(renderer);
    }

    draw(renderer) {
        const gl = renderer.getGLContext();
        this.setupContext(renderer);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        this.restoreContext(gl);
    }

    initOverlay(renderer){
        // Shader
        const gl = renderer.getGLContext();
        const shaderUtils = renderer.getShaderUtils();
        const vertexCode = ShadersUtil.SHADER_HEADER + this.getVertexCode();
        const fragmentCode = ShadersUtil.SHADER_HEADER + this.getFragmentCode();
        this._program = shaderUtils.getOrCreateShader(gl, this._shaderName, vertexCode, fragmentCode, this.constructor.name);
        gl.useProgram(this._program);
        this._coordAttrib = gl.getAttribLocation(this._program, "vertCoords");
        this._overlayColorUniform = gl.getUniformLocation(this._program, "overlayColor");
        this._opacityUniform = gl.getUniformLocation(this._program, "opacity");

        // VAO
        this._vertex_buffer = gl.createBuffer();
        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this._coordAttrib);
        const stride = 2 * 4; // 2 * FP32
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.FLOAT, false, stride, 0);
    }

    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        gl.useProgram(this._program);
        gl.uniform4fv(this._overlayColorUniform, [this._colorVec4.x, this._colorVec4.y, this._colorVec4.z, this._colorVec4.w]);
        gl.uniform1f(this._opacityUniform, this._opacity);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        // gl.bindVertexArray(null);
    }

    /** @param {Vec4} color the color in [0 to 1] RBGA components */
    setColor(color) {
        this._colorVec4.copy(color);
    }

    /** @param {number} opacity */
    setOpacity(opacity) {
        this._opacity = opacity;
    }

    getVertexCode(){
        return [
            'uniform vec4 overlayColor;',
            'uniform float opacity;',
            'in vec2 vertCoords;',
            'out vec4 color;',

            'void main(void) {',
            '    color = overlayColor;',
            '    color.w *= opacity;',
            '    gl_Position = vec4(vertCoords.xy, 0., 1.);',
            '}'
        ].join('\n');
    }

    getFragmentCode(){
        return [
            'in vec4 color;',
            'out vec4 outColor;',
            'void main(void) {',
            '    outColor = color;',
            '}'
        ].join('\n');
    }

    getVertices() { // Fullscreen quad
        return new Float32Array([
            -1, -1,// T1
            1, -1,
            -1, 1,
            1, 1,// T2
            -1, 1,
            1, -1
        ]);
    }
}
