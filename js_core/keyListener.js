let forward = 1;
let backward = -1;
let stop = 0;

function key_handler(e, actor, keyDown) {
    let nothing_handled = false;
    switch (e.key || e.keyCode) {
        case "ArrowLeft":
        case 37:
            if (keyDown) {
                actor.move(backward);
            } else {
                actor.move(stop);
            }
            break;
        case "ArrowRight":
        case 39:
            if (keyDown) {
                actor.move(forward);
            } else {
                actor.move(stop);
            }
            break;
        default:
            nothing_handled = true;
    }
    if (!nothing_handled) e.preventDefault();
}