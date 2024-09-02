import {GeneralInputManager} from "../../webgl_engine/inputs/generalInputManager.js";
import {MouseInputIdentifiers} from "../../webgl_engine/inputs/mouse/mouseInputIdentifiers.js";
import {XboxGamePadInputs} from "../../webgl_engine/inputs/gamepads/gamepadInputIdentifiers.js";
import {US_Keyboard} from "../../webgl_engine/inputs/keyboard/keyboardInputIdentifiers.js";

export class SpaceShooterInputManager extends GeneralInputManager{
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(SpaceShooterActions.MENU_VALID_SELECTION, true);
        this.addInputToAction(SpaceShooterActions.MENU_VALID_SELECTION, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(SpaceShooterActions.MENU_VALID_SELECTION, US_Keyboard.Space);
        this.addInputToAction(SpaceShooterActions.MENU_VALID_SELECTION, US_Keyboard.Enter);
        this.addInputToAction(SpaceShooterActions.MENU_VALID_SELECTION, MouseInputIdentifiers.BUTTON_LEFT);

        this.createButtonAction(SpaceShooterActions.MENU_RETURN_TO_MAIN,true);
        this.addInputToAction(SpaceShooterActions.MENU_RETURN_TO_MAIN, XboxGamePadInputs.BUTTON_START);
        this.addInputToAction(SpaceShooterActions.MENU_RETURN_TO_MAIN, US_Keyboard.Escape);

        // This action differ from Menu valid selection, as menu action is only fired when the button is pressed (holding don't auto click menus)
        // While the Ship fire action is actually repeating as long as the button is being held.
        this.createButtonAction(SpaceShooterActions.SHIP_FIRE,false);
        this.addInputToAction(SpaceShooterActions.SHIP_FIRE, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(SpaceShooterActions.SHIP_FIRE, US_Keyboard.Space);
        this.addInputToAction(SpaceShooterActions.SHIP_FIRE, MouseInputIdentifiers.BUTTON_LEFT);

        this.createAxisAction(SpaceShooterActions.SHIP_LEFT);
        this.addInputToAction(SpaceShooterActions.SHIP_LEFT, XboxGamePadInputs.BUTTON_CROSS_LEFT);
        this.addInputToAction(SpaceShooterActions.SHIP_LEFT, XboxGamePadInputs.AXIS_LEFTAXIS_LEFT);
        this.addInputToAction(SpaceShooterActions.SHIP_LEFT, US_Keyboard.ArrowLeft);

        this.createAxisAction(SpaceShooterActions.SHIP_RIGHT);
        this.addInputToAction(SpaceShooterActions.SHIP_RIGHT, XboxGamePadInputs.BUTTON_CROSS_RIGHT);
        this.addInputToAction(SpaceShooterActions.SHIP_RIGHT, XboxGamePadInputs.AXIS_LEFTAXIS_RIGHT);
        this.addInputToAction(SpaceShooterActions.SHIP_RIGHT, US_Keyboard.ArrowRight);

        this.createPositionAction(SpaceShooterActions.SHIP_MOVE_TO_CURSOR);
        this.addInputToAction(SpaceShooterActions.SHIP_MOVE_TO_CURSOR, MouseInputIdentifiers.CURSOR_POSITION);
    }
}
