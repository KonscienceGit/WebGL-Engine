"use strict";

function main() {
    let canvas = document.querySelector("#render_canvas");
    let renderer = new Renderer(canvas, new Vec2(1100,800));
    let actor = new ActorSprite(renderer._gl, canvas, "resources/actor/", ".png", 3);
    let shapeArray = [];
    shapeArray.push(new Sprite(renderer._gl, canvas, "resources/background.png"));
    shapeArray.push(actor);
    shapeArray.push(new Sprite(renderer._gl, canvas, "resources/foreground.png"));
    let previous = 0;
    let firstDraw = true;
    let inputManagement = new InputManagement();


    requestAnimationFrame(frame);

    function frame(timeStamp) {

        inputManagement.handleInputs(actor);
        let deltaTime = computeDelta(timeStamp);

        actor.update(deltaTime);
        renderer.draw(shapeArray);

        requestAnimationFrame(frame);
    }

    function computeDelta(timeStamp) {
        timeStamp *= 0.001;
        let deltaTime = 0.0;
        if (firstDraw) {
            firstDraw = false;
        } else {
            deltaTime = timeStamp - previous;
        }
        previous = timeStamp;
        return deltaTime;
    }
}
