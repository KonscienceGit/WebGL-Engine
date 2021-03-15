"use strict";

function main() {
    let canvas = document.querySelector("#render_canvas");
    let renderer = new Renderer(canvas);
    let actor = renderer.createShape("resources/actor.png");
    let shapeArray = [];
    shapeArray.push(renderer.createShape("resources/background.png"));
    shapeArray.push(actor);
    shapeArray.push(renderer.createShape("resources/foreground.png"));
    let previous = 0;
    let firstDraw = true;

    document.addEventListener("keydown", function (e) {
        key_handler(e, actor, true);
    }, true);
    document.addEventListener("keyup", function (e) {
        key_handler(e, actor, false);
    }, true);

    requestAnimationFrame(frame);

    function frame(timeStamp) {

        timeStamp *= 0.001;
        if (firstDraw) {
            firstDraw = false;
            previous = timeStamp;
            requestAnimationFrame(frame);
        }
        let deltaTime = timeStamp - previous;
        previous = timeStamp;

        actor.update(deltaTime);
        renderer.draw(shapeArray);

        requestAnimationFrame(frame);
    }
}