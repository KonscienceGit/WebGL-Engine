let vertices = [-0.5, 0.5, -0.5, -0.5, 0.0, -0.5,];
let x = 0.0;

class Shape {
    constructor(shadersUtil, gl) {
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.shaderProgram = shadersUtil.createProgram(vertCode, fragCode, gl);

        gl.useProgram(this.shaderProgram);
        this.coordAttrib = gl.getAttribLocation(this.shaderProgram, "coordinates");
        this.colorUniform = gl.getUniformLocation(this.shaderProgram, "colorUniform");

        gl.vertexAttribPointer(this.coordAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    setupContext(gl) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.useProgram(this.shaderProgram);
        gl.enableVertexAttribArray(this.coordAttrib);
        gl.uniform4fv(this.colorUniform, [x, 0, 0, 1]);
    }

    restoreContext(gl) {
        gl.disableVertexAttribArray(this.coordAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    update(delta) {
        x += delta;
        if (x > 1.0) {
            x = 0.0;
        }
    }
}