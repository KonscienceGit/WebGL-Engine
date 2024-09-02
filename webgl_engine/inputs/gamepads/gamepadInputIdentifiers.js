import {AbstractInputIdentifier} from "../abstractInputIdentifier.js";

export class GamepadInputType {
    static {
        this.GAMEPAD_BUTTON = "BUTTON";
        this.GAMEPAD_AXIS = "AXIS";
    }
}

export class GamepadType {
    static {
        this.XBOX_GAMEPAD = "Xbox";
        this.T16000M_STICK = "T.16000M";
    }
}

export class GamepadInputIdentifier extends AbstractInputIdentifier{
    /**
     * @param gamepadType
     * @param inputType
     * @param inputNumber
     * @param {number} [axisDirection] 1 if positive part of axis, -1 if negative part.
     */
    constructor(gamepadType, inputType, inputNumber, axisDirection) {
        super();
        this.gamepadType = gamepadType;
        this.inputType = inputType;
        this.inputNumber = inputNumber;
        this.axisDirection = axisDirection ? axisDirection : 1;
    }

    getType(){return this.gamepadType;}
    getInputType(){return this.inputType;}
    getInputNumber(){return this.inputNumber;}
    getAxisDirection(){return this.axisDirection;}
}

export class XboxGamePadInputs {
    static {
        this.BUTTON_A = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 0);
        this.BUTTON_B = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 1);
        this.BUTTON_X = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 2);
        this.BUTTON_Y = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 3);
        this.BUTTON_LB = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 4);
        this.BUTTON_RB = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 5);
        this.BUTTON_LT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 6);
        this.BUTTON_RT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 7);
        this.BUTTON_SELECT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 8);
        this.BUTTON_START = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 9);

        this.BUTTON_STICK_CLICK_LEFT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 10);
        this.BUTTON_STICK_CLICK_RIGHT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 11);
        this.BUTTON_CROSS_TOP = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 12);
        this.BUTTON_CROSS_BOTTOM = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 13);
        this.BUTTON_CROSS_LEFT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 14);
        this.BUTTON_CROSS_RIGHT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 15);
        this.BUTTON_CENTER = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_BUTTON, 16);
        this.AXIS_LEFTAXIS_LEFT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 0, -1);
        this.AXIS_LEFTAXIS_RIGHT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 0, 1);
        this.AXIS_LEFTAXIS_UP = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 1, -1);
        this.AXIS_LEFTAXIS_DOWN = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 1, 1);
        this.AXIS_RIGHTAXIS_LEFT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 2, -1);
        this.AXIS_RIGHTAXIS_RIGHT = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 2, 1);
        this.AXIS_RIGHTAXIS_UP = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 3, -1);
        this.AXIS_RIGHTAXIS_DOWN = new GamepadInputIdentifier(GamepadType.XBOX_GAMEPAD, GamepadInputType.GAMEPAD_AXIS, 3, 1);
    }
}

//TODO T16000M flight stick
