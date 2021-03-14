let vertCode =
    '#ifdef GL_ES \n precision mediump float; \n #endif \n' +

    'attribute vec2 coordinates;' +
    'void main(void) {' +
    ' gl_Position = vec4(coordinates,0.0, 1.0);' +
    '}';

let fragCode =
    '#ifdef GL_ES \n precision mediump float; \n #endif \n' +
    'uniform vec4 colorUniform;' +
    'void main(void) {' +
    ' gl_FragColor = colorUniform;' +
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