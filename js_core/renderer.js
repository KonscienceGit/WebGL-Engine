class Renderer {
    constructor(canvas) {
        this._gl = canvas.getContext('webgl2', {
            antialias: false,
            depth: false,
            alpha: false,
            stencil: false
        });
        this._gl.clearColor(0.5, 0.9, 0.5, 0.9);
        this._gl.viewport(0, 0, canvas.width, canvas.height);
        this.clear();
    }

    draw(nodeArray) {
        nodeArray.forEach(node => node.draw(this._gl));
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
}
