class AnnotatedAxisOverlay extends Entity {
    /**
     * @param {Renderer} renderer
     * @param {Vec4} colorVec4
     */
    constructor(renderer, colorVec4) {
        super();
        this.visible = true;
        this._program = null;
        this._shaderName = "AnnotatedOverlay";
        this._opacity = 1.0;
        this.color = colorVec4;
        this._fp4 = new Float32Array(4);
        this._fp2 = new Float32Array(2);
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
        this._resolutionUniform = gl.getUniformLocation(this._program, "resolution");
        this._screenWorldSizeUniform = gl.getUniformLocation(this._program, "screenWorldSize");
        this._canvasPositionUniform = gl.getUniformLocation(this._program, "canvasPosition");
        this._overlayColorUniform = gl.getUniformLocation(this._program, "overlayColor");
        this._opacityUniform = gl.getUniformLocation(this._program, "opacity");

        // VAO
        this._vertex_buffer = gl.createBuffer();
        this._vao = gl.createVertexArray();
        gl.bindVertexArray(this._vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.getVertices(), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this._coordAttrib);
        const stride = 2; // 2 * Byte
        gl.vertexAttribPointer(this._coordAttrib, 2, gl.BYTE, false, stride, 0);
    }

    setupContext(renderer) {
        const gl = renderer.getGLContext();
        gl.bindVertexArray(this._vao);
        gl.useProgram(this._program);
        gl.uniform4fv(this._overlayColorUniform, this.color.toArray(this._fp4));
        gl.uniform2fv(this._resolutionUniform, renderer.getRenderResolution().toArray(this._fp2));
        gl.uniform1f(this._opacityUniform, this._opacity);
        renderer.getCamera().setViewProjectionUniform(gl, this._screenWorldSizeUniform, this._canvasPositionUniform);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     */
    restoreContext(gl) {
        // gl.bindVertexArray(null);
    }

    /** @param {Vec4} color the color in [0 to 1] RBGA components */
    setColor(color) {
        this.color.copy(color);
    }

    /** @param {number} opacity */
    setOpacity(opacity) {
        this._opacity = opacity;
    }

    getVertexCode(){
        return [
            'uniform vec4 overlayColor;',
            'uniform float opacity;',
            'uniform vec2 resolution;',
            'uniform vec2 screenWorldSize;',
            'uniform vec2 canvasPosition;',
            'in vec2 vertCoords;',
            'out vec4 color;',
            'out vec2 pixelPos;',
            'out vec2 worldPos;',
            'out vec2 worldToPixel;',

            'void main(void) {',
            '    color = overlayColor;',
            '    color.w *= opacity;',
            '    gl_Position = vec4(vertCoords, 0., 1.);',
            '    vec2 offset = vec2(0., 0.);',
            '    float off = 0.5;',
            '    if (fract(resolution.x / 2.) > 0.1 ) offset.x = off;',
            '    if (fract(resolution.y / 2.) > 0.1 ) offset.y = off;',
            '    vec2 adjustedCoord = vertCoords - canvasPosition / screenWorldSize;',
            '    worldPos = vertCoords * screenWorldSize / 2. - canvasPosition;',
            '    pixelPos = offset + (worldPos / screenWorldSize) * resolution;',
            '    worldToPixel = resolution / screenWorldSize;',
            '}'
        ].join('\n');
    }

    getFragmentCode(){
        return [
            'uniform vec2 resolution;',
            'in vec4 color;',
            'in vec2 pixelPos;',
            'in vec2 worldPos;',
            'in vec2 worldToPixel;',
            'out vec4 outColor;',
            'vec4 transparent = vec4(0., 0., 0., 0.);',
            'float markEpsilon = 0.001;',
            'bool vertical = false;',
            'bool horizontal = true;',
            'float smallTickLength = 8.;',
            'float smallTickSpacing = 0.1;',
            'float smallTickWidth = 1.;',

            'float bigTickLength = 16.;',
            'float bigTickSpacing = 1.;',
            'float bigTickWidth = 2.;',

            'bool keepMark(bool horizontal, float spacing, float length, float width) {',
            '    float worldToPix = horizontal ? worldToPixel.x : worldToPixel.y;',
            '    float worldpos = horizontal ? worldPos.x : worldPos.y;',
            '    float pixelpos = horizontal ? pixelPos.x : pixelPos.y;',
            '    float posOrthoAxis = horizontal ? pixelPos.y : pixelPos.x;',
            '    float markWidth = width / spacing + markEpsilon;',
            '    float markPos = fract(worldpos / spacing);',
            '    bool origin = (worldpos / spacing - markPos) == 0.;',
            '    float pixelMarkpos = worldToPix * markPos;',
            '    bool keepMarkX = pixelMarkpos > 0. && pixelMarkpos < markWidth;',
            '    return (posOrthoAxis < 0. && posOrthoAxis > -length) && keepMarkX && !origin;',
            '}',

            'bool keepLines(bool horizontal, float spacing, float width) {',
            '    float worldToPix = horizontal ? worldToPixel.x : worldToPixel.y;',
            '    float worldpos = horizontal ? worldPos.x : worldPos.y;',
            '    float pixelpos = horizontal ? pixelPos.x : pixelPos.y;',
            '    float posOrthoAxis = horizontal ? pixelPos.y : pixelPos.x;',
            '    float markWidth = width / spacing + markEpsilon;',
            '    float markPos = fract(worldpos / spacing);',
            '    float pixelMarkpos = worldToPix * markPos;',
            '    bool keepMarkX = pixelMarkpos > 0. && pixelMarkpos < markWidth;',
            '    return keepMarkX;',
            '}',

            'void main(void) {',
            '    outColor = color;',
            //   Axes
            '    bool keep_axes = false;',
            '    keep_axes = (pixelPos.x > -1. && pixelPos.x < 1.) ? true : keep_axes;',
            '    keep_axes = (pixelPos.y > -1. && pixelPos.y < 1.) ? true : keep_axes;',

            //   Small marks
            '    bool keep_mark = false;',
            '    keep_mark = keepMark(horizontal, smallTickSpacing, smallTickLength, smallTickWidth) ? true : keep_mark;',
            '    keep_mark = keepMark(vertical, smallTickSpacing, smallTickLength, smallTickWidth) ? true : keep_mark;',
            //   Big marks
            '    keep_mark = keepMark(horizontal, bigTickSpacing, bigTickLength, bigTickWidth) ? true : keep_mark;',
            '    keep_mark = keepMark(vertical, bigTickSpacing, bigTickLength, bigTickWidth) ? true : keep_mark;',

            //   Dim lines for "grid"
            '    bool keep_gridline = false;',
            '    keep_gridline = keepLines(horizontal, bigTickSpacing, 1.) ? true : keep_gridline;',
            '    keep_gridline = keepLines(vertical, bigTickSpacing, 1.) ? true : keep_gridline;',
            //   Reduce opacity for gridline
            '    bool is_gridline  = keep_gridline && !keep_mark && !keep_axes;',
            '    outColor.a *= is_gridline ? 0.33 : 1.;',

            '    bool do_discard = !(keep_axes || keep_mark || keep_gridline);',
            '    if (do_discard) discard;',
            '}'
        ].join('\n');
    }

    getVertices() { // Fullscreen quad
        return new Int8Array([-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1]);
    }
}
