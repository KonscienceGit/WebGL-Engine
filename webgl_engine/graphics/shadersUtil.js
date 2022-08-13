

class ShadersUtil {
    static GLSL_300_ES = '#version 300 es \n';
    static LOWP = 'precision lowp ';
    static MEDIUMP = 'precision mediump ';
    static HIGHP = 'precision highp ';
    static P_FLOAT = 'float;\n';
    static P_INT = 'int;\n';
    static P_SAMPLER2D = 'sampler2D;\n';
    static P_SAMPLERCUBE = 'samplerCube;\n';
    static P_SAMPLER2DARRAY = 'sampler2DArray;\n';

    static SHADER_HEADER =
        this.GLSL_300_ES +
        this.HIGHP + this.P_FLOAT +
        this.HIGHP + this.P_INT +
        this.HIGHP + this.P_SAMPLER2D +
        this.HIGHP + this.P_SAMPLERCUBE +
        this.HIGHP + this.P_SAMPLER2DARRAY;

    static VERTEX_SHADER_CODE = ShadersUtil.SHADER_HEADER +
        'uniform vec2 scale;' +
        'uniform vec2 position;' +
        'uniform float rotation;' +
        'uniform vec2 spriteDimensions;' +
        'uniform vec2 canvasDimensions;' +
        'uniform vec2 canvasPosition;' +
        'in vec2 vertCoords;' +
        'in vec2 textCoordinates;' +
        'out vec2 textCoord;' +

        'void main(void) {' +
        '    textCoord = textCoordinates;' +
        '    float viewRatio = canvasDimensions.x/canvasDimensions.y;' +
        '    vec2 spriteScale = spriteDimensions/canvasDimensions;' +
        '    float r_cos = cos(rotation);' +
        '    float r_sin = sin(rotation);' +
        '    vec2 screenSpacePosition = 2. * (position + canvasPosition) / canvasDimensions;' +

        '    /*scale*/' +
        '    vec2 pos = vertCoords * spriteScale * scale;' +

        '    /*screen ratio*/' +
        '    pos.y /= viewRatio;' +

        '    /*rotation*/' +
        '    float x = pos.x * r_cos - pos.y * r_sin;' +
        '    float y = (pos.x * r_sin + pos.y * r_cos) * viewRatio;' +

        '    /*translation*/' +
        '    x += screenSpacePosition.x;' +
        '    y += screenSpacePosition.y;' +

        '    gl_Position = vec4(x, y, 0.0, 1.0);' +
        '}';

    static SPRITE_FRAGMENT_SHADER_CODE = ShadersUtil.SHADER_HEADER +
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

    static DEFAULT_BLUE_PIXEL_DATA = new Uint8Array([0, 0, 255, 255]);


    /**
     * @param {WebGL2RenderingContext} glContext
     * @returns {ShadersUtil}
     */
    constructor(glContext) {
        //Singleton!//
        if (!ShadersUtil.instance) {
            this._spriteShaderProgram = ShadersUtil.createProgram(ShadersUtil.VERTEX_SHADER_CODE, ShadersUtil.SPRITE_FRAGMENT_SHADER_CODE, glContext);
            ShadersUtil.instance = this;
            this._shaderPrograms = [];
        }
        return ShadersUtil.instance;
    }

    getOrCreateShader(gl, shaderName, vertexCode, fragmentCode, objectName){
        let exist = false;
        for (let i = 0; i < this._shaderPrograms.length; i++){
            if (this._shaderPrograms[i].isThisMe(shaderName, vertexCode, fragmentCode)){
                exist = true;
                this._shaderPrograms[i].registerUser(objectName);
                return this._shaderPrograms[i].webglShaderProgram;
            }
        }
        if (!exist){
            const shaderObj = new ShaderObject(shaderName, vertexCode, fragmentCode, objectName);
            shaderObj.webglShaderProgram = ShadersUtil.createProgram(vertexCode, fragmentCode, gl);
            this._shaderPrograms.push(shaderObj);
            return shaderObj.webglShaderProgram;
        }
    }

    /**
     * @param {String} vertCode
     * @param {String} fragCode
     * @param {WebGL2RenderingContext} glContext
     * @returns {WebGLProgram}
     */
    static createProgram(vertCode, fragCode, glContext) {
        let vertShader = glContext.createShader(glContext.VERTEX_SHADER);
        glContext.shaderSource(vertShader, vertCode);
        ShadersUtil.compileAndCheck(vertShader, glContext);

        let fragShader = glContext.createShader(glContext.FRAGMENT_SHADER);
        glContext.shaderSource(fragShader, fragCode);
        ShadersUtil.compileAndCheck(fragShader, glContext);

        let shaderProgram = glContext.createProgram();
        glContext.attachShader(shaderProgram, vertShader);
        glContext.attachShader(shaderProgram, fragShader);
        ShadersUtil.linkAndCheck(shaderProgram, glContext);

        return shaderProgram;
    }

    /**
     * @param {WebGLShader} shader
     * @param {WebGL2RenderingContext} glContext
     */
    static compileAndCheck(shader, glContext) {
        glContext.compileShader(shader);
        let success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + glContext.getShaderInfoLog(shader);
        }
    }

    /**
     * @param {WebGLProgram} program
     * @param {WebGL2RenderingContext} glContext
     */
    static linkAndCheck(program, glContext) {
        glContext.linkProgram(program);
        let success = glContext.getProgramParameter(program, glContext.LINK_STATUS);
        if (!success) {
            throw "could not link program:" + glContext.getProgramInfoLog(program);
        }
    }

    /**
     * @returns {Uint8Array}
     */
    static getDefaultBluePixelData() {
        return ShadersUtil.DEFAULT_BLUE_PIXEL_DATA;
    }

    /**
     * @returns {WebGLProgram}
     */
    getSpriteShaderProgram() {
        return this._spriteShaderProgram;
    }
}
