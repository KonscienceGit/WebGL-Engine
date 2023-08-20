class Orrery2DInputManager extends GeneralInputManager {
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(Orrery2DActions.LEFT_CLICK, true);
        this.addInputToAction(Orrery2DActions.LEFT_CLICK, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(Orrery2DActions.LEFT_CLICK, US_Keyboard.Enter);
        this.addInputToAction(Orrery2DActions.LEFT_CLICK, MouseInputIdentifiers.BUTTON_LEFT);

        this.createButtonAction(Orrery2DActions.RIGHT_CLICK, true);
        this.addInputToAction(Orrery2DActions.RIGHT_CLICK, XboxGamePadInputs.BUTTON_B);
        this.addInputToAction(Orrery2DActions.RIGHT_CLICK, US_Keyboard.Space);
        this.addInputToAction(Orrery2DActions.RIGHT_CLICK, MouseInputIdentifiers.BUTTON_RIGHT);

        this.createPositionAction(Orrery2DActions.CURSOR_AT);
        this.addInputToAction(Orrery2DActions.CURSOR_AT, MouseInputIdentifiers.CURSOR_POSITION);
    }
}
