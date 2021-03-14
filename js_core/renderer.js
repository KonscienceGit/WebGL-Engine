class Renderer {
    constructor(canvas) {
        this.glContext = canvas.getContext('webgl', {
            antialias: false,
            depth: false,
            alpha: false,
            stencil: false
        });
        this.canvas = canvas;
        this.shadersUtil = new ShadersUtil();

        this.glContext.clearColor(0.5, 0.9, 0.5, 0.9);
        this.glContext.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    createShape() {
        this.shape = new Shape(this.shadersUtil, this.glContext, this.canvas);
        return this.shape;
    }

    draw() {
        let gl = this.glContext;

        gl.clear(gl.COLOR_BUFFER_BIT);

        this.shape.draw(gl);
    }
}
