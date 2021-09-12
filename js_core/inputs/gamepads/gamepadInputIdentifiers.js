const GAMEPAD_BUTTON = "BUTTON";
const GAMEPAD_AXIS = "AXIS";
const XBOX_GAMEPAD = "Xbox";
const AXIS_POSITIVE_RANGE = 1;
const AXIS_NEGATIVE_RANGE = -1;

class GamepadInputIdentifier{
    /**
     * @param gamepadType
     * @param inputType
     * @param inputNumber
     * @param {boolean} [axisDirection] true if
     */
    constructor(gamepadType, inputType, inputNumber, axisDirection) {
        this.gamepadType = gamepadType;
        this.inputType = inputType;
        this.inputNumber = inputNumber;
    }

    getType(){return this.gamepadType;}
    getInputType(){return this.inputType;}
    getInputNumber(){return this.inputNumber;}
}

const XboxGamePadInputs = Object.freeze({
    BUTTON_A: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 0),
    BUTTON_B: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 1),
    BUTTON_X: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 2),
    BUTTON_Y: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 3),

    BUTTON_LB: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 4),
    BUTTON_RB: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 5),
    BUTTON_LT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 6),
    BUTTON_RT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 7),

    BUTTON_SELECT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 8),
    BUTTON_START: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 9),

    BUTTON_STICK_CLICK_LEFT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 10),
    BUTTON_STICK_CLICK_RIGHT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 11),

    BUTTON_CROSS_TOP: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 12),
    BUTTON_CROSS_BOTTOM: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 13),
    BUTTON_CROSS_LEFT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 14),
    BUTTON_CROSS_RIGHT: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 15),

    BUTTON_CENTER: new GamepadInputIdentifier(XBOX_GAMEPAD, GAMEPAD_BUTTON, 16),

    // TODO axes
});

const T16000M_STICK = "T.16000M";