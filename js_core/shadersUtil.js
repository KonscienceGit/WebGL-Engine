let vertCode =
    '#ifdef GL_ES \n precision mediump float; \n #endif \n' +

    'uniform vec4 scaleAndPos;' +
    'attribute vec2 coordinates;' +
    'attribute vec2 textCoordinates;' +
    'varying vec2 textCoord;' +

    'void main(void) {' +
    ' textCoord = textCoordinates;' +
    ' vec2 pos = coordinates*scaleAndPos.xy + scaleAndPos.zw;' +
    ' gl_Position = vec4(pos,0.0, 1.0);' +
    '}';

let fragCode =
    '#ifdef GL_ES \n precision mediump float; \n #endif \n' +
    'varying vec2 textCoord;' +
    'uniform sampler2D u_texture;' +

    'void main(void) {' +
    ' vec4 frcolor = texture2D(u_texture, textCoord);' +
    ' if (frcolor.a == 0.)' +
    '  discard;' +

    ' gl_FragColor = frcolor;' +
    '}';

class ShadersUtil {
    constructor() {
    }

    createProgram(vertCode, fragCode, glContext) {
        let vertShader = glContext.createShader(glContext.VERTEX_SHADER);
        glContext.shaderSource(vertShader, vertCode);
        glContext.compileShader(vertShader);

        let fragShader = glContext.createShader(glContext.FRAGMENT_SHADER);
        glContext.shaderSource(fragShader, fragCode);
        this.compileAndCheck(fragShader, glContext);

        let shaderProgram = glContext.createProgram();
        glContext.attachShader(shaderProgram, vertShader);
        glContext.attachShader(shaderProgram, fragShader);
        glContext.linkProgram(shaderProgram);

        return shaderProgram;
    }

    compileAndCheck(shader, glContext) {
        glContext.compileShader(shader);
        let success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + glContext.getShaderInfoLog(shader);
        }
    }
}