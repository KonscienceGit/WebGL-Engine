class ShadersUtil {
    static createProgram(vertCode, fragCode, glContext) {
        let vertShader = glContext.createShader(glContext.VERTEX_SHADER);
        glContext.shaderSource(vertShader, vertCode);
        glContext.compileShader(vertShader);

        let fragShader = glContext.createShader(glContext.FRAGMENT_SHADER);
        glContext.shaderSource(fragShader, fragCode);
        ShadersUtil.compileAndCheck(fragShader, glContext);

        let shaderProgram = glContext.createProgram();
        glContext.attachShader(shaderProgram, vertShader);
        glContext.attachShader(shaderProgram, fragShader);
        glContext.linkProgram(shaderProgram);

        return shaderProgram;
    }

    static compileAndCheck(shader, glContext) {
        glContext.compileShader(shader);
        let success = glContext.getShaderParameter(shader, glContext.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + glContext.getShaderInfoLog(shader);
        }
    }
}