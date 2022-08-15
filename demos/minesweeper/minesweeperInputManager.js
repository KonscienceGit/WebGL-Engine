class MinesweeperInputManager extends GeneralInputManager{
    constructor(renderer) {
        super(renderer);
        this.initActions();
    }

    initActions() {
        this.createButtonAction(MinesweeperActions.LEFT_CLICK, true);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, XboxGamePadInputs.BUTTON_A);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, US_Keyboard.Enter);
        this.addInputToAction(MinesweeperActions.LEFT_CLICK, MouseInputIdentifiers.BUTTON_LEFT);

        this.createPositionAction(MinesweeperActions.CURSOR_AT);
        this.addInputToAction(MinesweeperActions.CURSOR_AT, MouseInputIdentifiers.CURSOR_POSITION);
    }
}
