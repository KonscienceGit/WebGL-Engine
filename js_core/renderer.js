class Renderer {
    constructor(canvas) {
        let height = screen.availHeight;
        let width = screen.availWidth;
        let scaleh = 1.;
        if(height < canvas.height){
            scaleh = height / canvas.height;
        }
        let scalew = 1.;
        if(width < canvas.width){
            scalew = width / canvas.width;
        }
        let scale = Math.min(scalew, scaleh);
        
        this._gl = canvas.getContext('webgl2', {
            antialias: false,
            depth: false,
            alpha: false,
            stencil: false
        });
        this._gl.clearColor(0.5, 0.9, 0.5, 0.9);
        this._gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
        this.clear();
    }

    draw(nodeArray) {
        nodeArray.forEach(node => node.draw(this._gl));
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
}
