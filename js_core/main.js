const main = function () {
    let canvas = document.getElementById('my_Canvas');
    let renderer = new Renderer(canvas);
    let shape = renderer.createShape();

    //requestAnimationFrame(frame);
    setInterval(frame, 1000.0 / 60.0);

    function frame() {
        shape.update();
        renderer.draw(this.canvas);
    }
};