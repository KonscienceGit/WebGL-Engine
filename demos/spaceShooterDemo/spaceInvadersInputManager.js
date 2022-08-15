class SpaceInvadersInputManager extends GeneralInputManager{
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(SpaceInvadersActions.MENU_VALID_SELECTION, true);
        this.addInputToAction(SpaceInvadersActions.MENU_VALID_SELECTION, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(SpaceInvadersActions.MENU_VALID_SELECTION, US_Keyboard.Space);
        this.addInputToAction(SpaceInvadersActions.MENU_VALID_SELECTION, US_Keyboard.Enter);
        this.addInputToAction(SpaceInvadersActions.MENU_VALID_SELECTION, MouseInputIdentifiers.BUTTON_LEFT);

        this.createButtonAction(SpaceInvadersActions.MENU_RETURN_TO_MAIN,true);
        this.addInputToAction(SpaceInvadersActions.MENU_RETURN_TO_MAIN, XboxGamePadInputs.BUTTON_START);
        this.addInputToAction(SpaceInvadersActions.MENU_RETURN_TO_MAIN, US_Keyboard.Escape);

        // This action differ from Menu valid selection, as menu action is only fired when the button is pressed (holding don't auto click menus)
        // While the Ship fire action is actually repeating as long as the button is being held.
        this.createButtonAction(SpaceInvadersActions.SHIP_FIRE,false);
        this.addInputToAction(SpaceInvadersActions.SHIP_FIRE, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(SpaceInvadersActions.SHIP_FIRE, US_Keyboard.Space);
        this.addInputToAction(SpaceInvadersActions.SHIP_FIRE, MouseInputIdentifiers.BUTTON_LEFT);

        this.createAxisAction(SpaceInvadersActions.SHIP_LEFT);
        this.addInputToAction(SpaceInvadersActions.SHIP_LEFT, XboxGamePadInputs.BUTTON_CROSS_LEFT);
        this.addInputToAction(SpaceInvadersActions.SHIP_LEFT, XboxGamePadInputs.AXIS_LEFTAXIS_LEFT);
        this.addInputToAction(SpaceInvadersActions.SHIP_LEFT, US_Keyboard.ArrowLeft);

        this.createAxisAction(SpaceInvadersActions.SHIP_RIGHT);
        this.addInputToAction(SpaceInvadersActions.SHIP_RIGHT, XboxGamePadInputs.BUTTON_CROSS_RIGHT);
        this.addInputToAction(SpaceInvadersActions.SHIP_RIGHT, XboxGamePadInputs.AXIS_LEFTAXIS_RIGHT);
        this.addInputToAction(SpaceInvadersActions.SHIP_RIGHT, US_Keyboard.ArrowRight);

        this.createPositionAction(SpaceInvadersActions.SHIP_MOVE_TO_CURSOR);
        this.addInputToAction(SpaceInvadersActions.SHIP_MOVE_TO_CURSOR, MouseInputIdentifiers.CURSOR_POSITION);
    }
}
