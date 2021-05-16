class Renderer {
    constructor(canvas) {
        this._canvas = canvas;
        this._viewPortPixelSize = viewPortPixelSize;
        let clWidth = canvas.parentNode.clientWidth;
        let clHeight = canvas.parentNode.clientHeight;
        let scWidth = screen.availWidth;
        let scHeight = screen.availHeight;
        let height = Math.min(clHeight, scHeight);
        let width = Math.min(clWidth, scWidth);
        console.log(width);
        console.log(height);

        let scaleh = 1.;
        if(height < canvas.height){
            scaleh = height / canvas.height;
        }
        let scalew = 1.;
        if(width < canvas.width){
            scalew = width / canvas.width;
        }
        let scale = Math.min(scalew, scaleh);

        console.log(scale);
        this._gl = canvas.getContext('webgl2', {
            antialias: false,
            depth: false,
            premultipliedAlpha: false,
            stencil: false
        });

        //enable blending
        this._gl.enable(this._gl.BLEND);
        this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE_MINUS_SRC_ALPHA);
        this._gl.clearColor(1, 1, 1, 1);
        canvas.width *= scale;
        canvas.height *= scale;
        this._gl.viewport(0, 0, canvas.width, canvas.height);
        // this._gl.viewport(0, 0, canvas.width/scale, canvas.height/scale);
        //this._gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
        this.clear();
    }

    draw(nodeArray) {
        nodeArray.forEach(node => node.draw(this._gl));
    }

    clear() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
    }
}
