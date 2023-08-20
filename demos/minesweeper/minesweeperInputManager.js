class MinesweeperInputManager extends GeneralInputManager {
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(MinesweeperActions.LEFT_CLICK, true);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, US_Keyboard.Enter);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, MouseInputIdentifiers.BUTTON_LEFT);

        this.createButtonAction(MinesweeperActions.RIGHT_CLICK, true);
        this.addInputToAction(MinesweeperActions.RIGHT_CLICK, XboxGamePadInputs.BUTTON_B);
        this.addInputToAction(MinesweeperActions.RIGHT_CLICK, US_Keyboard.Space);
        this.addInputToAction(MinesweeperActions.RIGHT_CLICK, MouseInputIdentifiers.BUTTON_RIGHT);

        this.createPositionAction(MinesweeperActions.CURSOR_AT);
        this.addInputToAction(MinesweeperActions.CURSOR_AT, MouseInputIdentifiers.CURSOR_POSITION);
    }
}
