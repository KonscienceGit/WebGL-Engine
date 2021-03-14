"use strict";

function main() {
    let canvas = document.querySelector("#render_canvas");
    let renderer = new Renderer(canvas);
    let shape = renderer.createShape();
    let previous = 0;
    let firstDraw = true;

    requestAnimationFrame(frame);

    function frame(timeStamp) {

        if (firstDraw) {
            firstDraw = false;
        }
        timeStamp *= 0.001;
        let deltaTime = timeStamp - previous;
        previous = timeStamp;

        shape.update(deltaTime);
        renderer.draw();

        requestAnimationFrame(frame);
    }
}