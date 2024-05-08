import {GeneralInputManager} from "../../webgl_engine/inputs/generalInputManager.js";
import {MouseInputIdentifiers} from "../../webgl_engine/inputs/mouse/mouseInputIdentifiers.js";
import {XboxGamePadInputs} from "../../webgl_engine/inputs/gamepads/gamepadInputIdentifiers.js";
import {US_Keyboard} from "../../webgl_engine/inputs/keyboard/keyboardInputIdentifiers.js";

export class GraphInputsManager extends GeneralInputManager{
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(GraphActions.LEFT_CLICK,true);
        this.addInputToAction(GraphActions.LEFT_CLICK, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(GraphActions.LEFT_CLICK, US_Keyboard.Enter);
        this.addInputToAction(GraphActions.LEFT_CLICK, MouseInputIdentifiers.BUTTON_LEFT);

        this.createPositionAction(GraphActions.CURSOR_MOVE);
        this.addInputToAction(GraphActions.CURSOR_MOVE, MouseInputIdentifiers.CURSOR_POSITION);

        this.createAxisAction(GraphActions.MOUSEWHEEL_MOVE_UP);
        this.addInputToAction(GraphActions.MOUSEWHEEL_MOVE_UP, MouseInputIdentifiers.WHEEL_1_UP);
        this.createAxisAction(GraphActions.MOUSEWHEEL_MOVE_DOWN);
        this.addInputToAction(GraphActions.MOUSEWHEEL_MOVE_DOWN, MouseInputIdentifiers.WHEEL_1_DOWN);
    }
}
