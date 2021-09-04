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
        const self = this;//closure context

        window.onkeydown = function (keyEvent) {
            switch (keyEvent.key) {
                case "ArrowLeft":
                    self._states.leftButtonClicked = !self._states.leftButtonDown;
                    self._states.leftButtonDown = true;
                    self._hasNewInput = true;
                    break;
                case "ArrowRight":
                    self._states.rightButtonClicked = !self._states.rightButtonDown;
                    self._states.rightButtonDown = true;
                    self._hasNewInput = true;
                    break;
                case "Enter":
                    self._states.actionButtonClicked = !self._states.actionButtonDown;
                    self._states.actionButtonDown = true;
                    self._hasNewInput = true;
                    break;
                case "Escape":
                    self._states.returnButtonClicked = !self._states.returnButtonDown;
                    self._states.returnButtonDown = true;
                    self._hasNewInput = true;
                    break;
                default:
            }
        };

        window.onkeyup = function (keyEvent) {
            switch (keyEvent.key) {
                case "ArrowLeft":
                    self._states.leftButtonDown = false;
                    self._hasNewInput = true;
                    break;
                case "ArrowRight":
                    self._states.rightButtonDown = false;
                    self._hasNewInput = true;
                    break;
                case "Enter":
                    self._states.actionButtonDown = false;
                    self._hasNewInput = true;
                    break;
                case "Escape":
                    self._states.returnButtonDown = false;
                    self._hasNewInput = true;
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
            stateManager.fireInputAction(GameInputActions.LEFT);
            this._states.leftButtonClicked = false;
        }
        if (this._states.rightButtonClicked) {
            stateManager.fireInputAction(GameInputActions.RIGHT);
            this._states.rightButtonClicked = false;
        }
        if (this._states.actionButtonClicked) {
            stateManager.fireInputAction(GameInputActions.ACTION);
            this._states.actionButtonClicked = false;
        }
        if (this._states.returnButtonClicked) {
            stateManager.fireInputAction(GameInputActions.RETURN);
            this._states.returnButtonClicked = false;
        }
        if (this._states.leftButtonDown && !this._states.rightButtonDown) stateManager.fireInputAction(GameInputActions.LEFT_HOLD);
        if (this._states.rightButtonDown && !this._states.leftButtonDown) stateManager.fireInputAction(GameInputActions.RIGHT_HOLD);
        if(this._states.actionButtonDown) stateManager.fireInputAction(GameInputActions.ACTION_HOLD);
    }

    /**
     * @deprecated
     * @returns {boolean} true if a new input has been detected while parsing.
     */
    parseInputs() {
        //keyboard input parsing is done on the events.
        const hasNewInput = this._hasNewInput;
        this._hasNewInput = false;
        return hasNewInput;
    }
}