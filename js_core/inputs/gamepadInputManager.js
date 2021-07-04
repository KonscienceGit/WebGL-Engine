// see http://luser.github.io/gamepadtest/
// noinspection JSUnusedGlobalSymbols // broken inspection
class GamePadKeyStatus {
    constructor() {
        this.leftAxisPushed = false;
        this.rightAxisPushed = false;
        this.leftButtonDown = false;
        this.leftButtonClicked = false;
        this.rightButtonDown = false;
        this.rightButtonClicked = false;
        this.actionButtonDown = false;
        this.actionButtonClicked = false;
    }
}

class GamepadInputManager extends AbstractInputManager {
    constructor() {
        super();
        this._axisDeadZone = 0.4;
        const haveEvents = 'GamepadEvent' in window;
        const haveWebkitEvents = 'WebKitGamepadEvent' in window;

        this.connecthandler = this.connecthandler.bind(this);
        this.disconnecthandler = this.disconnecthandler.bind(this);

        this._controllers = [];
        this._controllerKeyStatuses = [];
        this._activePadIndex = 0;

        if (haveEvents) {
            window.addEventListener("gamepadconnected", this.connecthandler);
            window.addEventListener("gamepaddisconnected", this.disconnecthandler);
        } else if (haveWebkitEvents) {
            window.addEventListener("webkitgamepadconnected", this.connecthandler);
            window.addEventListener("webkitgamepaddisconnected", this.disconnecthandler);
        }
    }

    parseInputs() {
        super.parseInputs();
        this.scangamepads();
        let hasNewInput = false;
        for (let c = 0; c < this._controllers.length; c++) {
            const gamepad = this._controllers[c];
            if (gamepad == null) continue;
            if (this.parseGamepadInputs(gamepad)) {
                hasNewInput = true;
                break;
            }
        }
        return hasNewInput;
    }

    updateStates(stateManager) {
        super.updateStates(stateManager);

        const activeGamepad = this._controllers[this._activePadIndex];
        if (activeGamepad == null) return;
        const states = this._controllerKeyStatuses[this._activePadIndex];

        if (states.leftButtonClicked) {
            stateManager.fireInputAction(InputActions.LEFT);
            states.leftButtonClicked = false;
        }
        if (states.rightButtonClicked) {
            stateManager.fireInputAction(InputActions.RIGHT);
            states.rightButtonClicked = false;
        }
        if (states.actionButtonClicked) {
            stateManager.fireInputAction(InputActions.ACTION);
            states.actionButtonClicked = false;
        }
        const left = states.leftButtonDown || states.leftAxisPushed;
        const right = states.rightButtonDown || states.rightAxisPushed;
        if (left && !right) stateManager.fireInputAction(InputActions.LEFT_HOLD);
        if (right && !left) stateManager.fireInputAction(InputActions.RIGHT_HOLD);
        if(states.actionButtonDown) stateManager.fireInputAction(InputActions.ACTION_HOLD);
    }

    scangamepads() {
        // noinspection JSUnresolvedVariable
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] && (gamepads[i].index in this._controllers)) {
                this._controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }

    /**
     * @param {Gamepad} gamepad
     * @returns {boolean}
     */
    parseGamepadInputs(gamepad) {
        const index = gamepad.index;
        let hasNewInput = false;
        let padStatus;
        if (this._controllerKeyStatuses[index] === undefined) {
            padStatus = new GamePadKeyStatus();
            this._controllerKeyStatuses[index] = padStatus;
        } else {
            padStatus = this._controllerKeyStatuses[index];
        }

        //--LEFT--//
        //Button
        const isLeftPressed = this.isButtonDown(gamepad.buttons[14]);
        if (isLeftPressed !== padStatus.leftButtonDown) hasNewInput = true;
        const leftButtonFreshlyPressed = (isLeftPressed && !padStatus.leftButtonDown);
        padStatus.leftButtonDown = isLeftPressed;
        //Axis
        const isLeftAxisPushed = this.isAxisPushedLeft(gamepad.axes[0]);
        if (isLeftAxisPushed !== padStatus.leftAxisPushed) hasNewInput = true;
        const leftAxisFreshlyPushed = (isLeftAxisPushed && !padStatus.leftAxisPushed);
        padStatus.leftAxisPushed = isLeftAxisPushed;

        //--RIGHT--//
        //Button
        const isRightPressed = this.isButtonDown(gamepad.buttons[15]);
        if (isRightPressed !== padStatus.rightButtonDown) hasNewInput = true;
        const rightButtonFreshlyPressed = (isRightPressed && !padStatus.rightButtonDown);
        padStatus.rightButtonDown = isRightPressed;
        //Axis
        const isRightAxisPushed = this.isAxisPushedRight(gamepad.axes[0]);
        if (isRightAxisPushed !== padStatus.rightAxisPushed) hasNewInput = true;
        const rightAxisFreshlyPushed = (isRightAxisPushed && !padStatus.rightAxisPushed);
        padStatus.rightAxisPushed = isRightAxisPushed;

        //--ACTION--// A or START
        const isActionPushed = this.isButtonDown(gamepad.buttons[0]) || this.isButtonDown(gamepad.buttons[9]);
        if (isActionPushed !== padStatus.actionButtonDown) hasNewInput = true;
        padStatus.actionButtonClicked = (isActionPushed && !padStatus.actionButtonDown);
        padStatus.actionButtonDown = isActionPushed;

        //Clicked/Freshly pressed notion
        padStatus.leftButtonClicked = leftButtonFreshlyPressed || leftAxisFreshlyPushed;
        padStatus.rightButtonClicked = rightButtonFreshlyPressed || rightAxisFreshlyPushed;

        return hasNewInput;
    }

    /**
     * @param {GamepadButton} button the gamepad button to set
     * @returns {boolean}
     */
    isButtonDown(button) {
        let val = 0;
        if (typeof (button) == "object") {
            if ('touched' in button && button.touched) {
                val = button.value;
            } else if ('pressed' in button) {
                val = button.pressed ? 1. : 0.;
            }
        } else {
            val = button;
        }
        return val > 0;
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    connecthandler(gamepadEvent) {
        let gamepad = gamepadEvent.gamepad;
        this._controllers[gamepad.index] = gamepad;
        this.parseInputs(gamepad);
    }

    /**
     * @param {GamepadEvent} gamepadEvent
     */
    disconnecthandler(gamepadEvent) {
        let gamepad = gamepadEvent.gamepad;
        delete this._controllers[gamepad.index];
    }

    /**
     * @param {number} axis
     * @returns {boolean}
     */
    isAxisPushedLeft(axis) {
        return axis < -this._axisDeadZone;
    }

    /**
     * @param {number} axis
     * @returns {boolean}
     */
    isAxisPushedRight(axis) {
        return axis > this._axisDeadZone;
    }
}

