class Renderer {
    constructor(canvas) {
        this.glContext = canvas.getContext('experimental-webgl');
        this.canvas = canvas;
        this.shadersUtil = new ShadersUtil();

        this.glContext.clearColor(0.5, 0.5, 0.5, 0.9);
        this.glContext.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    createShape() {
        this.shape = new Shape(this.shadersUtil, this.glContext);
        return this.shape;
    }

    draw() {
        let gl = this.glContext;
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.shape.setupContext(gl);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        this.shape.restoreContext(gl);
    }
}
