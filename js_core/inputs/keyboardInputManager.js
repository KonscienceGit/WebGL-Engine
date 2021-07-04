class KeyboardStatus {
    constructor() {
        //TODO unify the control state class across controllers
        this.leftButtonDown = false;
        this.leftButtonClicked = false;
        this.rightButtonDown = false;
        this.rightButtonClicked = false;
        this.actionButtonDown = false;
        this.actionButtonClicked = false;
        this.returnButtonDown = false;
        this.returnButtonClicked = false;
    }
}

class KeyboardInputManager extends AbstractInputManager {
    constructor() {
        super();
        this._hasNewInput = false;
        this._states = new KeyboardStatus();
        const _self = this;//closure context

        window.onkeydown = function (keyEvent) {
            switch (keyEvent.key) {
                case "ArrowLeft":
                    _self._states.leftButtonClicked = !_self._states.leftButtonDown;
                    _self._states.leftButtonDown = true;
                    _self._hasNewInput = true;
                    break;
                case "ArrowRight":
                    _self._states.rightButtonClicked = !_self._states.rightButtonDown;
                    _self._states.rightButtonDown = true;
                    _self._hasNewInput = true;
                    break;
                case "Enter":
                    _self._states.actionButtonClicked = !_self._states.actionButtonDown;
                    _self._states.actionButtonDown = true;
                    _self._hasNewInput = true;
                    break;
                case "Escape":
                    _self._states.returnButtonClicked = !_self._states.returnButtonDown;
                    _self._states.returnButtonDown = true;
                    _self._hasNewInput = true;
                    break;
                default:
            }
        };

        window.onkeyup = function (keyEvent) {
            switch (keyEvent.key) {
                case "ArrowLeft":
                    _self._states.leftButtonDown = false;
                    _self._hasNewInput = true;
                    break;
                case "ArrowRight":
                    _self._states.rightButtonDown = false;
                    _self._hasNewInput = true;
                    break;
                case "Enter":
                    _self._states.actionButtonDown = false;
                    _self._hasNewInput = true;
                    break;
                case "Escape":
                    _self._states.returnButtonDown = false;
                    _self._hasNewInput = true;
                    break;
                default:
            }
        };
    }

    /**
     * Update the given state manager with this inputManager input states.
     * @param {StateManager} stateManager
     */
    updateStates(stateManager) {
        if (this._states.leftButtonClicked) {
            stateManager.fireInputAction(InputActions.LEFT);
            this._states.leftButtonClicked = false;
        }
        if (this._states.rightButtonClicked) {
            stateManager.fireInputAction(InputActions.RIGHT);
            this._states.rightButtonClicked = false;
        }
        if (this._states.actionButtonClicked) {
            stateManager.fireInputAction(InputActions.ACTION);
            this._states.actionButtonClicked = false;
        }
        if (this._states.returnButtonClicked) {
            stateManager.fireInputAction(InputActions.RETURN);
            this._states.returnButtonClicked = false;
        }
        if (this._states.leftButtonDown && !this._states.rightButtonDown) stateManager.fireInputAction(InputActions.LEFT_HOLD);
        if (this._states.rightButtonDown && !this._states.leftButtonDown) stateManager.fireInputAction(InputActions.RIGHT_HOLD);
        if(this._states.actionButtonDown) stateManager.fireInputAction(InputActions.ACTION_HOLD);
    }

    /**
     * @returns {boolean} true if a new input has been detected while parsing.
     */
    parseInputs() {
        //keyboard input parsing is done on the events.
        const hasNewInput = this._hasNewInput;
        this._hasNewInput = false;
        return hasNewInput;
    }
}