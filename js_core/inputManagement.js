class InputManagement {
    constructor() {
        this._keyLeft = false;
        this._keyRight = false;
    }

    handleInputs(actor) {
        let thisObject = this;
        window.onkeydown = function (keyEvent) {
            switch (keyEvent.key) {
                // switch (keyEvent.key || keyEvent.keyCode) {
                case "ArrowLeft":
                    thisObject._keyLeft = true;
                    break;

                case "ArrowRight":
                    thisObject._keyRight = true;
                    break;
                default:
            }
        };

        window.onkeyup = function (keyEvent) {
            switch (keyEvent.key) {
                case "ArrowLeft":
                    thisObject._keyLeft = false;
                    break;
                case "ArrowRight":
                    thisObject._keyRight = false;
                    break;
                default:
            }
        };

        if (this._keyLeft && !this._keyRight) {
            actor.move(-1);
        } else if (this._keyRight && !this._keyLeft) {
            actor.move(1);
        } else {
            actor.move(0);
        }
    }
}