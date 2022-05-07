const SHADER_HEADER = '#version 300 es \n' +
    'precision highp float;';

const VERTEX_SHADER_CODE = SHADER_HEADER +
    'uniform vec2 scale;' +
    'uniform vec2 position;' +
    'uniform float rotation;' +
    'uniform vec2 spriteDimensions;' +
    'uniform vec2 canvasDimensions;' +
    'in vec2 vertCoords;' +
    'in vec2 textCoordinates;' +
    'out vec2 textCoord;' +

    'void main(void) {' +
    '    textCoord = textCoordinates;' +
    '    float viewRatio = canvasDimensions.x/canvasDimensions.y;' +
    '    vec2 spriteScale = spriteDimensions/canvasDimensions;' +
    '    float r_cos = cos(rotation);' +
    '    float r_sin = sin(rotation);' +
    '    vec2 screenSpacePosition = 2. * position / canvasDimensions;' +

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

const SPRITE_FRAGMENT_SHADER_CODE = SHADER_HEADER +
    'precision mediump sampler2DArray;' +
    'uniform int textureLayer;' +
    'uniform sampler2DArray textureSample;' +
    'in vec2 textCoord;' +
    'out vec4 outColor;' +

    'void main(void) {' +
    '    outColor = texture(textureSample, vec3(textCoord, textureLayer));' +
    '}';

const DEFAULT_BLUE_PIXEL_DATA = new Uint8Array([0, 0, 255, 255]);


class ShadersUtil {
    /**
     * @param {WebGL2RenderingContext} glContext
     * @returns {ShadersUtil}
     */
    constructor(glContext) {
        //Singleton!//
        if (!ShadersUtil.instance) {
            this._spriteShaderProgram = ShadersUtil.createProgram(VERTEX_SHADER_CODE, SPRITE_FRAGMENT_SHADER_CODE, glContext);
            ShadersUtil.instance = this;
            this._shaderPrograms = [];
        }

        return ShadersUtil.instance;
    }

    GLSL_300_ES = '#version 300 es \n';

    FP_PRECISION_HIGH = 'precision highp float;\n';
    FP_PRECISION_MEDIUM = 'precision mediump float;\n';
    FP_PRECISION_LOW = 'precision lowp float;\n';

    INT_PRECISION_HIGH = 'precision highp float;\n';
    INT_PRECISION_MEDIUM = 'precision mediump float;\n';
    INT_PRECISION_LOW = 'precision lowp float;\n';

    SAMPLER2D_PRECISION_HIGH = 'precision highp sampler2D;\n';
    SAMPLER2D_PRECISION_MEDIUM = 'precision mediump sampler2D;\n';
    SAMPLER2D_PRECISION_LOW = 'precision lowp sampler2D;\n';

    SAMPLERCUBE_PRECISION_HIGH = 'precision highp samplerCube;\n';
    SAMPLERCUBE_PRECISION_MEDIUM = 'precision mediump samplerCube;\n';
    SAMPLERCUBE_PRECISION_LOW = 'precision lowp samplerCube;\n';

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
        return DEFAULT_BLUE_PIXEL_DATA;
    }

    /**
     * @returns {WebGLProgram}
     */
    getSpriteShaderProgram() {
        return this._spriteShaderProgram;
    }
}
